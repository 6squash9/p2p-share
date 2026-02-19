package com.suyash.p2pshare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Jackson annotation to ignore unknown fields
public class SignalMessage {
    // the server only needs to understand what it has to ACT on so we are using type and roomId
    private String type;
    private String roomId;
}
