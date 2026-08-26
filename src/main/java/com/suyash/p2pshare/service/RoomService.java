package com.suyash.p2pshare.service;

import com.suyash.p2pshare.model.JoinResult;
import com.suyash.p2pshare.model.Room;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class RoomService {
    // storage to store all the rooms keyId by roomId
    private final Map<String, Room> rooms = new ConcurrentHashMap<>(); // thread safe

    // hard ceiling on how many rooms can exist at once. this is the backstop:
    // even if every other defence fails, room storage cannot grow past this.
    @Value("${peersend.rooms.max}")
    private int maxRooms;

    // how long a room with nobody in it survives before the sweeper removes it
    @Value("${peersend.rooms.ttl-minutes}")
    private double ttlMinutes;

    private long ttlMillis() {
        return (long) (ttlMinutes * 60_000);
    }

    public JoinResult joinRoom(String roomId, WebSocketSession session) {
        Room room = rooms.get(roomId);
        if (room == null) {
            return JoinResult.ROOM_NOT_FOUND;
        }
        // conditions.
        synchronized (room) {
            // the sweeper could have evicted this room between the get() above and
            // us taking its monitor. if that happened we'd be joining an orphaned
            // object that is no longer reachable from the map, so re-check.
            if (rooms.get(roomId) != room) {
                return JoinResult.ROOM_NOT_FOUND;
            }
            int size = room.getAllSessions().size();
            if (size >= 2) {
                log.debug("Room {} already full", roomId);
                return JoinResult.ROOM_FULL;
            } else if (size == 0) {
                room.joinRoom(session);
                room.touch();
                log.debug("Room {} joined as initiator", roomId);
                return JoinResult.SUCCESS_INITIATOR;
            } else {
                room.joinRoom(session);
                room.touch();
                log.debug("Room {} joined as responder", roomId);
                return JoinResult.SUCCESS_RESPONDER;
            }
        }
    }

    public void disconnect(String roomId, WebSocketSession session) {
        // if any browser disconnects
        Room room = rooms.get(roomId);
        if (room == null) {
            return;
        }
        synchronized (room) {
            room.leaveRoom(session);
            room.touch();
            // only drop the room once BOTH peers are gone. previously this used
            // computeIfPresent returning null, which removed the room on the first
            // disconnect and left the remaining peer talking to nothing.
            if (room.isEmpty()) {
                rooms.remove(roomId, room);
                log.debug("Room {} empty, removed", roomId);
            }
        }
    }

    public void sendMessage(String roomId, WebSocketSession sender, TextMessage message) throws IOException {
        Room room = rooms.get(roomId);
        if (room != null) {
            room.touch();
            room.broadcastMessage(sender, message);
        }
    }

    // room is pre-created via REST before anyone joins via WebSocket. previously
    // computeIfAbsent was doing the room creation lazily on first join — now we're
    // just doing it explicitly upfront.
    // returns null when the ceiling is reached, so the caller can answer 429.
    public String createRoom() {
        if (rooms.size() >= maxRooms) {
            log.warn("Room ceiling of {} reached, refusing to create", maxRooms);
            return null;
        }
        String roomId = UUID.randomUUID().toString();
        rooms.put(roomId, new Room(roomId));
        log.debug("Room created with ID: {}", roomId);
        return roomId;
    }

    public boolean roomExists(String roomId) {
        return roomId != null && rooms.containsKey(roomId);
    }

    public Room getRoom(String roomId) {
        return roomId == null ? null : rooms.get(roomId);
    }

    public int roomCount() {
        return rooms.size();
    }

    // rooms are created over REST but only ever removed when a WebSocket session
    // closes, so a room that is created and never joined used to live forever.
    // this sweep is what makes room storage bounded: anything empty and untouched
    // for the TTL gets dropped.
    @Scheduled(fixedDelayString = "${peersend.rooms.sweep-interval-ms}")
    public void evictIdleRooms() {
        long ttl = ttlMillis();
        int before = rooms.size();
        rooms.forEach((id, room) -> {
            synchronized (room) {
                if (room.isEmpty() && room.isIdleFor(ttl)) {
                    // two-arg remove: only delete if the map still holds THIS instance
                    rooms.remove(id, room);
                }
            }
        });
        int evicted = before - rooms.size();
        if (evicted > 0) {
            log.info("Swept {} idle rooms, {} remaining", evicted, rooms.size());
        }
    }
}
