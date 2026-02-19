package com.suyash.p2pshare.service;

import com.suyash.p2pshare.model.Room;
import com.suyash.p2pshare.model.JoinResult;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {
    //storage to store all the rooms keyId by roomId
    Map<String, Room> rooms = new ConcurrentHashMap<>(); //thread safe

    public JoinResult joinRoom(String roomId, WebSocketSession session){
        if(!rooms.containsKey(roomId)){
            System.out.println("Room not found !");
            //lets create the room
            Room room = new Room(roomId);
            rooms.put(roomId,room);
            System.out.println("new Room created");
            //now join the room
            room.joinRoom(session);
            return JoinResult.SUCCESS_INITIATOR;
        }
        else{
            //check if room has space to enter
            if(rooms.get(roomId).getAllSessions().size() >= 2 ){
                System.out.println("Room already full");
                return JoinResult.ROOM_FULL;
            }
            else {
                // join the room
                rooms.get(roomId).joinRoom(session);
                return JoinResult.SUCCESS_RESPONDER;
            }
        }
    }

    public void disconnect(String roomId , WebSocketSession session){
        //if any browser disconnects
        Room room = rooms.get(roomId);
        if(room != null) {
            //remove the session from the room
               room.leaveRoom(session);
            //if room occupancy is 0 then delete the room
            if (room.getAllSessions().size() == 0) {
                rooms.remove(roomId);
            }
        }
    }

   public void sendMessage(String roomId , WebSocketSession sender, TextMessage message) throws IOException {
        Room room = rooms.get(roomId);
        if(room != null && sender.isOpen()){
            room.broadcastMessage(sender,message);
        }
   }
}