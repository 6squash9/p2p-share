package com.suyash.p2pshare.controller;

import com.suyash.p2pshare.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
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
        return ResponseEntity.ok(Map.of("roomId", roomId)); //creates a small json object
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> checkRoom(@PathVariable String roomId) {
        boolean exists = roomService.roomExists(roomId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
