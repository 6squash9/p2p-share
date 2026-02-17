package com.suyash.p2pshare.model;

import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

public class Room {
   private String roomId;
   private Set<WebSocketSession> sessions;

   public Room(String roomId){
       this.roomId = roomId;
       this.sessions = new HashSet<>();
   }
   public void joinRoom(WebSocketSession session){
       sessions.add(session);
   }
   public void leaveRoom(WebSocketSession session){
       sessions.remove(session);
   }
   public Set<WebSocketSession> getAllSessions(){
       return sessions;
   }
}
