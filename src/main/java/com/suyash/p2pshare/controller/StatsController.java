package com.suyash.p2pshare.controller;

import com.suyash.p2pshare.service.ConnectionCounter;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/stats")
public class StatsController {
    private final ConnectionCounter connectionCounter;

    public StatsController(ConnectionCounter connectionCounter) {
        this.connectionCounter = connectionCounter;
    }

    // public, unauthenticated, and deliberately boring: one integer. the browser
    // is told to cache it for a minute so refresh-spam never reaches the server.
    @GetMapping
    public ResponseEntity<?> stats() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).cachePublic())
                .body(Map.of("connections", connectionCounter.get()));
    }
}
