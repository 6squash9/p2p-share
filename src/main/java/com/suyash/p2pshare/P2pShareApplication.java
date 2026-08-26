package com.suyash.p2pshare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling // powers RoomService.evictIdleRooms()
@SpringBootApplication
public class P2pShareApplication {

    public static void main(String[] args) {
        SpringApplication.run(P2pShareApplication.class, args);
    }

}
