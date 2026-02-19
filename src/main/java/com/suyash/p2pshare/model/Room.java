package com.suyash.p2pshare.model;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class Room {
   private String roomId;
   private Set<WebSocketSession> sessions;

   public Room(String roomId){
       this.roomId = roomId;
       this.sessions = ConcurrentHashMap.newKeySet();
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

   public void broadcastMessage(WebSocketSession sender, TextMessage message) throws IOException {
//       send to everyone in this room EXCEPT the sender
        for(WebSocketSession x : sessions){
            // skip the sender
            if(x.isOpen() && x != sender){
                x.sendMessage(message);
            }
        }
   }
}
