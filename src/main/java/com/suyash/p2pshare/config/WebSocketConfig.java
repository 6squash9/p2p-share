package com.suyash.p2pshare.config;

import com.suyash.p2pshare.controller.SignalHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final SignalHandler signalHandler;

    public WebSocketConfig(SignalHandler signalHandler) {
        this.signalHandler = signalHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // "/signal" a WebSocket endpoint
        registry.addHandler(signalHandler, "/signal").setAllowedOrigins("*");
    }
}
