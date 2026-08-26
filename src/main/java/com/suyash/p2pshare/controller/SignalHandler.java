package com.suyash.p2pshare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.suyash.p2pshare.model.JoinResult;
import com.suyash.p2pshare.model.Room;
import com.suyash.p2pshare.model.SignalMessage;
import com.suyash.p2pshare.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class SignalHandler extends TextWebSocketHandler {
    //ObjectMapper as static final field instead of creating per message
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final String FALLBACK_NAME = "Anonymous Peer";
    // when a session joins a room, we store it here
    private final Map<WebSocketSession, String> sessionToRoom = new ConcurrentHashMap<>(); //if they disconnect abruptly, we can still find their roomId
    private final Map<WebSocketSession, String> sessionToName = new ConcurrentHashMap<>();
    private final RoomService roomService;

    public SignalHandler(RoomService roomService) {
        this.roomService = roomService;
    }

    // method is called by the Spring WebSocket framework when a client establishes a WebSocket connection.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.debug("Browser connected! Session ID: {}", session.getId());
    }

    // json -> java object
    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, TextMessage message) throws Exception {
        String json = message.getPayload();
        log.debug("Received message: {}", json);

        SignalMessage msg; //target class to deserialize json into object
        try {
            msg = mapper.readValue(json, SignalMessage.class);
        } catch (Exception e) {
            // anything that isn't parseable JSON. don't let it bubble up as a stack
            // trace, that's a free way for anyone to flood the logs.
            log.debug("Dropping unparseable message from session {}", session.getId());
            sendError(session, "bad_message");
            return;
        }

        String type = msg.getType();
        String roomId = msg.getRoomId();
        String name = msg.getName() == null ? FALLBACK_NAME : msg.getName();

        // every branch below dereferences these, and ConcurrentHashMap.get(null)
        // throws too, so reject incomplete messages up front rather than NPE-ing.
        if (type == null || roomId == null) {
            sendError(session, "bad_message");
            return;
        }

        //routing logic
        if (type.equals("join")) {
            JoinResult result = roomService.joinRoom(roomId, session);
            if (result == JoinResult.SUCCESS_INITIATOR) {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(Map.of("type", "role", "role", "initiator"))));
                sessionToRoom.put(session, roomId);
                sessionToName.put(session, name);
            } else if (result == JoinResult.SUCCESS_RESPONDER) {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(Map.of("type", "role", "role", "responder"))));
                sessionToRoom.put(session, roomId);
                sessionToName.put(session, name);
                //find peer A session and get their name
                Room room = roomService.getRoom(roomId);
                if (room != null) {
                    for (WebSocketSession s : room.getAllSessions()) {
                        //session = peer B session df
                        if (s != session) {
                            String peerAName = sessionToName.getOrDefault(s, FALLBACK_NAME);
                            // notify peer B about peer A's name
                            session.sendMessage(new TextMessage(mapper.writeValueAsString(Map.of("type", "peer_joined", "name", peerAName))));
                            // notify peer A about peer B's name and start the offer
                            notifyPeer(roomId, session, new TextMessage(mapper.writeValueAsString(Map.of("type", "peer_joined", "name", name))));
                        }
                    }
                }
            } else if (result == JoinResult.ROOM_FULL) {
                sendError(session, "room_full");
            } else if (result == JoinResult.ROOM_NOT_FOUND) {
                sendError(session, "room_not_found");
                session.close();
            }
        } else if (type.equals("leave")) {
            notifyPeer(roomId, session, new TextMessage(mapper.writeValueAsString(Map.of("type", "peer_left"))));//notify first
            roomService.disconnect(roomId, session);//then disconnect
            forget(session);
        } else {
            //offer answer ice relay
            roomService.sendMessage(roomId, session, new TextMessage(json));
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        //afterConnectionClosed only gives us the session, not the roomId
        String roomId = sessionToRoom.get(session);
        if (roomId != null) {
            notifyPeer(roomId, session, new TextMessage(mapper.writeValueAsString(Map.of("type", "peer_left")))); //notify first
            roomService.disconnect(roomId, session); //then disconnect
        }
        forget(session);
        log.debug("Browser disconnected! Session ID: {}", session.getId());
    }

    // both maps are keyed by the session OBJECT, so anything left behind pins that
    // session in heap for the life of the process. sessionToName used to never be
    // cleared at all.
    private void forget(WebSocketSession session) {
        sessionToRoom.remove(session);
        sessionToName.remove(session);
    }

    private void sendError(WebSocketSession session, String error) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(mapper.writeValueAsString(Map.of("type", "error", "error", error))));
        }
    }

    //notify the peer about disconnect
    private void notifyPeer(String roomId, WebSocketSession session, TextMessage message) throws IOException {
        roomService.sendMessage(roomId, session, message);
    }
}
