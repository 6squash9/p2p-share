package com.suyash.p2pshare.service;

import com.suyash.p2pshare.model.JoinResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.socket.WebSocketSession;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

class RoomServiceTest {

    private ConnectionCounter counter;
    private RoomService service;

    @BeforeEach
    void setUp(@TempDir Path dir) {
        counter = new ConnectionCounter(dir.resolve("connections.txt").toString());
        counter.load();
        service = new RoomService(counter);
        // maxRooms is @Value-injected; outside a Spring context it is 0 and createRoom() refuses
        ReflectionTestUtils.setField(service, "maxRooms", 10);
    }

    @Test
    void initiatorAloneIsNotAConnection() {
        String roomId = service.createRoom();

        assertEquals(JoinResult.SUCCESS_INITIATOR, service.joinRoom(roomId, mock(WebSocketSession.class)));
        assertEquals(0, counter.get());
    }

    @Test
    void secondPeerJoiningCountsOnce() {
        String roomId = service.createRoom();

        service.joinRoom(roomId, mock(WebSocketSession.class));
        assertEquals(JoinResult.SUCCESS_RESPONDER, service.joinRoom(roomId, mock(WebSocketSession.class)));
        assertEquals(1, counter.get());
    }

    @Test
    void responderLeavingAndAnotherJoiningDoesNotCountAgain() {
        String roomId = service.createRoom();
        WebSocketSession initiator = mock(WebSocketSession.class);
        WebSocketSession firstResponder = mock(WebSocketSession.class);

        service.joinRoom(roomId, initiator);
        service.joinRoom(roomId, firstResponder);
        assertEquals(1, counter.get());

        // the room survives this because the initiator is still in it
        service.disconnect(roomId, firstResponder);
        assertEquals(JoinResult.SUCCESS_RESPONDER, service.joinRoom(roomId, mock(WebSocketSession.class)));
        assertEquals(1, counter.get(), "a rejoin on the same room is not a new connection");
    }

    @Test
    void eachRoomCountsSeparately() {
        for (int i = 0; i < 2; i++) {
            String roomId = service.createRoom();
            service.joinRoom(roomId, mock(WebSocketSession.class));
            service.joinRoom(roomId, mock(WebSocketSession.class));
        }
        assertEquals(2, counter.get());
    }
}
