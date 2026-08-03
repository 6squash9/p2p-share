# PeerSend

**Your file. Their browser. Nothing in between.**

Browser-native, peer-to-peer file transfer. No accounts, no server-side storage, no file size cap. Files move directly from one browser to another over an encrypted WebRTC DataChannel, the server only helps the two browsers find each other and then gets out of the way.

🔗 **Live app:** [peersend.app](https://peersend.app)

---

## Why PeerSend

Cloud-relay file sharing services (WeTransfer, Google Drive, Dropbox, and similar tools) route every byte of a transfer through a third-party server. That means the provider bears real storage and bandwidth costs (which is why most cap free-tier file size), and the file sits, at least momentarily, on infrastructure the sender doesn't control.

PeerSend takes a different approach: two browsers establish a direct WebRTC connection, and once that connection is open, the file travels browser-to-browser over a DTLS-encrypted DataChannel. The server's only job is signaling, helping the two peers exchange connection metadata (SDP offers/answers and ICE candidates), and it is never in the data path. Because the server never sees file bytes, there is no architecturally-imposed file size limit.

## Features

- Create a room, get a shareable link or code, no login required
- Direct browser-to-browser transfer over WebRTC DataChannel, DTLS-encrypted
- Chunked sending (64KB chunks) with backpressure hysteresis (pauses above an 8MB buffered-send threshold, resumes below 2MB) to prevent unbounded sender-side memory growth on large files
- Live transfer progress on both sender and receiver, computed independently
- Automatic download on completion, plus a re-download panel for the current session
- Anonymous, auto-generated peer display names (e.g. "Cosmic Tardigrade")
- No database, no server-side file storage, all room/session state lives in memory and is cleared on disconnect or after a 30-minute inactivity TTL

## Architecture

```
Browser A (Initiator)                              Browser B (Responder)
 ┌─────────────────┐        Signaling Server         ┌─────────────────┐
 │   UI Layer       │◄──────(Spring Boot, WS)────────►│   UI Layer       │
 │ Connection Ctrl  │        REST + WebSocket          │ Connection Ctrl  │
 └────────┬─────────┘        (SDP / ICE only)          └────────┬─────────┘
          │                                                      │
          └──────────── WebRTC DataChannel (P2P, DTLS) ─────────┘
                         file bytes never touch the server
```

- **Signaling plane**: small JSON control messages (join, role assignment, SDP offer/answer, ICE candidates) relayed through the Spring Boot server over WebSocket
- **Data plane**: the actual file, chunked and sent directly between the two browsers once the DataChannel opens

## Tech Stack

| Layer | Technology |
|---|---|
| P2P transport | WebRTC (RTCDataChannel, ICE, STUN, DTLS) |
| Signaling | WebSocket, Spring Boot |
| Backend | Java, Spring Boot (`RoomController`, `SignalHandler`, `RoomService`) |
| Frontend | React + Vite, custom hooks (`useConnection`, `useSender`, `useReceiver`) |
| Hosting | Railway (backend), Vercel (frontend) |
| DNS / SSL | Cloudflare |

## Repo Structure

This is a monorepo: the Spring Boot backend lives at the repo root, the React frontend lives in `client/`.

```
p2p-share/
├── src/main/java/com/suyash/p2pshare/
│   ├── config/WebSocketConfig.java
│   ├── controller/RoomController.java
│   ├── controller/SignalHandler.java
│   ├── model/Room.java
│   ├── model/JoinResult.java
│   ├── model/SignalMessage.java
│   └── service/RoomService.java
├── src/main/resources/application.properties
├── pom.xml
├── mvnw / mvnw.cmd
└── client/
    ├── src/
    │   ├── connections/        # useConnection.js, useSender.js, useReceiver.js
    │   ├── pages/               # LandingPage, HomePage, RoomPage
    │   └── components/
    ├── vercel.json
    └── package.json
```

## Running Locally

**Backend** (from the repo root):
```bash
./mvnw spring-boot:run
```
Runs on `localhost:8080` by default.

**Frontend** (from `client/`):
```bash
cd client
npm install
npm run dev
```
Create a `.env` file in `client/` pointing at the local backend:
```
VITE_BACKEND_URL=http://localhost:8080
```

Open two browser tabs at the printed local URL, create a room in one, join it from the other.

## How a Transfer Works

1. Peer A creates a room and shares the link/code with Peer B.
2. Both browsers connect over WebSocket and exchange SDP offer/answer and ICE candidates, brokered by the signaling server.
3. Once a viable network path is found, a WebRTC DataChannel opens directly between the two browsers. The signaling server's job is now done.
4. The sender slices the file into 64KB chunks and streams them over the DataChannel, pausing whenever its outgoing buffer exceeds 8MB and resuming once it drains below 2MB.
5. The receiver reassembles chunks into a Blob as they arrive and triggers an automatic download on completion.

## Known Limitations

- No TURN relay, peers behind restrictive/symmetric NATs may fail to connect (STUN only)
- Receiver-side memory usage is unbounded for very large files (no streaming-to-disk yet)
- Single-file transfer per room in the current version

## Background

PeerSend was built as a Master's project (Scaler Neovarsity / Woolf, MS Computer Science). A full write-up, including requirement gathering, class diagrams, and real benchmark data on transfer performance and backpressure behavior, is available in the project report.