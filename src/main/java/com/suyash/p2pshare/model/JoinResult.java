package com.suyash.p2pshare.model;

public enum JoinResult {
    SUCCESS_INITIATOR,    // First person to join - they create the offer
    SUCCESS_RESPONDER,    // Second person to join - they answer
    ROOM_FULL,           // Room already has 2 people
    ROOM_NOT_FOUND,      // Room doesn't exist
    ROOM_EXPIRED         // Room was inactive too long
}
