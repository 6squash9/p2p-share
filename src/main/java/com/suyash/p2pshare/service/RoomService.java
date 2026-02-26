package com.suyash.p2pshare.service;

import com.suyash.p2pshare.model.JoinResult;
import com.suyash.p2pshare.model.Room;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {
    // storage to store all the rooms keyId by roomId
    private final Map<String, Room> rooms = new ConcurrentHashMap<>(); // thread safe

    public JoinResult joinRoom(String roomId, WebSocketSession session) {
        Room room = rooms.computeIfAbsent(roomId, id -> new Room(id)); // atomic check-and-create to prevent race
                                                                       // conditions.
        synchronized (room) {
            int size = room.getAllSessions().size();
            if (size >= 2) {
                System.out.println("Room already full");
                return JoinResult.ROOM_FULL;
            } else if (size == 0) {
                room.joinRoom(session);
                System.out.println("New Room Created, joined as initiator");
                return JoinResult.SUCCESS_INITIATOR;
            } else {
                room.joinRoom(session);
                System.out.println("Joined existing room as responder");
                return JoinResult.SUCCESS_RESPONDER;
            }
        }
    }

    public void disconnect(String roomId, WebSocketSession session) {
        // if any browser disconnects
        rooms.computeIfPresent(roomId, (id, room) -> {
            room.leaveRoom(session);
            return room.getAllSessions().isEmpty() ? null : room;
        });
    }

    public void sendMessage(String roomId, WebSocketSession sender, TextMessage message) throws IOException {
        Room room = rooms.get(roomId);
        if (room != null) {
            room.broadcastMessage(sender, message);
        }
    }

    // room is pre-created via REST before anyone joins via WebSocket. previously
    // computeIfAbsent was doing the room creation lazily on first join — now we're
    // just doing it explicitly upfront.
    public String createRoom() {
        String roomId = UUID.randomUUID().toString();
        rooms.put(roomId, new Room(roomId));
        System.out.println("Room created with ID: " + roomId);
        return roomId;
    }

    public boolean roomExists(String roomId) {
        System.out.println("Checking room: " + roomId + " | exists: " + rooms.containsKey(roomId));
        return rooms.containsKey(roomId);
    }
}
