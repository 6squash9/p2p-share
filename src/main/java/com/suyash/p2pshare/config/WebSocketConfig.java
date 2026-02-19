package com.suyash.p2pshare.config;

import com.suyash.p2pshare.controller.SignalHandler;
import com.suyash.p2pshare.service.RoomService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // "/signal" a WebSocket endpoint
        registry.addHandler(new SignalHandler(new RoomService()),"/signal").setAllowedOrigins("*");
    }
}
