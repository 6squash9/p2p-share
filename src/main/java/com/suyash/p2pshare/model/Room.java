package com.suyash.p2pshare.model;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class Room {
    private String roomId;
    private Set<WebSocketSession> sessions;
    // last time anything happened in this room. the sweeper uses this to decide
    // whether the room has been abandoned. volatile is enough: a stale read only
    // delays eviction by one sweep cycle, and it can never evict a live room
    // because the sweeper also requires the room to be empty.
    private volatile long lastActivityAt;

    public Room(String roomId) {
        this.roomId = roomId;
        this.sessions = ConcurrentHashMap.newKeySet();
        this.lastActivityAt = System.currentTimeMillis();
    }

    public void joinRoom(WebSocketSession session) {
        sessions.add(session);
    }

    public void leaveRoom(WebSocketSession session) {
        sessions.remove(session);
    }

    public Set<WebSocketSession> getAllSessions() {
        return Collections.unmodifiableSet(sessions);
    }

    public boolean isEmpty() {
        return sessions.isEmpty();
    }

    // called whenever a real peer does something, so an active room never expires
    public void touch() {
        lastActivityAt = System.currentTimeMillis();
    }

    public boolean isIdleFor(long millis) {
        return System.currentTimeMillis() - lastActivityAt > millis;
    }

    public void broadcastMessage(WebSocketSession sender, TextMessage message) throws IOException {
        // send to everyone in this room EXCEPT the sender
        for (WebSocketSession x : sessions) {
            // skip the sender
            if (x.isOpen() && x != sender) {
                x.sendMessage(message);
            }
        }
    }
}
