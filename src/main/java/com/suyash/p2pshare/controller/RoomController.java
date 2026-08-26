package com.suyash.p2pshare.controller;

import com.suyash.p2pshare.service.RoomService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
// Allow requests from frontend (different origin) to avoid browser CORS blocking
@RestController
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<?> createRoom() {
        String roomId = roomService.createRoom();
        if (roomId == null) {
            // ceiling reached. say so honestly instead of returning a 200 with a
            // null roomId, which the client would happily navigate to.
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .header(HttpHeaders.RETRY_AFTER, "60")
                    .body(Map.of("error", "capacity", "message", "Too many active rooms right now. Please try again shortly."));
        }
        return ResponseEntity.ok(Map.of("roomId", roomId)); //creates a small json object
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> checkRoom(@PathVariable String roomId) {
        boolean exists = roomService.roomExists(roomId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
