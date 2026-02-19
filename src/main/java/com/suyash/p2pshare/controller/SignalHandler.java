package com.suyash.p2pshare.controller;

import com.suyash.p2pshare.model.Room;
import com.suyash.p2pshare.model.SignalMessage;
import com.suyash.p2pshare.service.RoomService;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

public class SignalHandler extends TextWebSocketHandler {
    // when a session joins a room, we store it here
    Map<WebSocketSession, String> sessionToRoom = new HashMap<>(); //if they disconnect abruptly, we can still find their roomId

    RoomService roomService;
    public SignalHandler(RoomService roomService){
        this.roomService = roomService;
    }
    // method is called by the Spring WebSocket framework when a client establishes a WebSocket connection.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Browser connected! Session ID: " + session.getId());
    }

    // json -> java object
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String json = message.getPayload();
        System.out.println("Received Message" + json);
        ObjectMapper mapper = new ObjectMapper(); //class required to convert json to java object
        SignalMessage msg  = mapper.readValue(json, SignalMessage.class); //target class to deserialize json into object
        //routing logic
        if(msg.getType().equals("join")){
            roomService.joinRoom(msg.getRoomId(),session);
            sessionToRoom.put(session,msg.getRoomId());
        }
        else if(msg.getType().equals("leave")){
            roomService.disconnect(msg.getRoomId(),session);
        }
        else {
            //offer answer ice relay
            roomService.sendMessage(msg.getRoomId(),session,new TextMessage(json));
        }

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        //afterConnectionClosed only gives us the session, not the roomId
        String roomId = sessionToRoom.get(session);
        if(roomId!=null){
        roomService.disconnect(roomId,session);
        sessionToRoom.remove(session);
        }
    }
}
