package com.suyash.p2pshare.model;

import lombok.Data;

@Data
public class SignalMessage {
    private String type; // "offer", "answer", or "ice-candidate"
    private String roomId; // which room this message belongs to
    private String senderId; // set by server (websocket session id of sender)
    private String role; // "initiator" or "responder", set by server based on join order
    private Object sdp; // webrtc offer/answer SDP
    private Object iceCandidate; // webrtc ICE candidate
    private ErrorDetails error;

    @Data
    public static class ErrorDetails {
        private String code; // e.g. "ROOM_FULL", "ROOM_NOT_FOUND", "ROOM_EXPIRED"
        private String message; // human-readable error message
    }
}
