package com.suyash.p2pshare.model;

import lombok.Data;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Data
public class RoomState {
    private final Set<String> peers; //Session Ids of connected peers
    private Instant lastActivity; //Last time a peer joined or left the room

    public RoomState(){
        this.peers = ConcurrentHashMap.newKeySet(); //threadSafe set for concurrent access
        this.lastActivity = Instant.now();
    }

    public void updateActivity(){
        this.lastActivity = Instant.now();
    }

}
