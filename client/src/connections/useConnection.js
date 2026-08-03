import {useEffect, useRef, useState} from "react"


const generateName = () => {
    const adjectives = ["Ninja", "Cosmic", "Lazy", "Sneaky", "Spicy", "Chaotic", "Fluffy", "Cursed", "Vibing", "Feral"]
    const animals = ["Panda", "Capybara", "Axolotl", "Quokka", "Raccoon", "Platypus", "Narwhal", "Wombat", "Tardigrade", "Pangolin"]
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const animal = animals[Math.floor(Math.random() * animals.length)]
    return `${adj} ${animal}`
}
const name = generateName();

//a custom hook
function useConnection(roomId) {
    const [peerName, setPeerName] = useState(null)
    const [role, setRole] = useState(null);
    const [connectionState, setConnectionState] = useState("idle");
    const roleRef = useRef(null);
    const channelRef = useRef(null);
    const peerJoinedAtRef = useRef(null); //timestamp when peer joined, for benchmarking

    // websocket connection the moment page loads
    useEffect(() => {
        // ===== BENCH: clock starts the moment this effect runs =====
        const t0 = performance.now();
        const mark = (label) => {
            console.log(`[BENCH] ${label}: ${(performance.now() - t0).toFixed(1)}ms`);
        }
        //open websocket connection
        const ws = new WebSocket(`${import.meta.env.VITE_BACKEND_URL.replace("http", "ws")}/signal`);
        // webrtc object
        const pc = new RTCPeerConnection({
            iceServers: [{urls: "stun:stun.l.google.com:19302"}] //stun server
        })

        // runs automatically when connection is established
        ws.onopen = () => {
            mark("ws_open")
            // console.log("WebSocket connection opened");
            //backend expects a type, roomId and name
            ws.send(JSON.stringify({type: "join", roomId, name})); //convert to string before sending
        }
        // runs automatically when server sends a message
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            // console.log("Message from server: ", msg);
            if (msg.type === "role") {
                mark(`role_assigned (${msg.role})`)
                setRole(msg.role); //updates ui
                roleRef.current = msg.role; //immediately readable
            }
            // when other peer joins server will respond with 'peer_joined'
            if (msg.type === "peer_joined") {
                mark("peer_joined")
                peerJoinedAtRef.current = performance.now();
                setPeerName(msg.name); //set peer name
                //now initiator will do the offer
                if (roleRef.current === "initiator") {
                    //initiator side creates data channel before the offer and saves it
                    channelRef.current = pc.createDataChannel("fileTransfer")
                    // event fires when the data channel is successfully established
                    channelRef.current.onopen = () => {
                        console.log(`[BENCH] TOTAL HANDSHAKE TIME: ${(performance.now() - peerJoinedAtRef.current).toFixed(1)}ms`)
                        setConnectionState("connected")
                    }
                    // creating a function because await requires async but onmessage is not an async function , so cant use await directly inside of it
                    const handlePeerJoined = async () => {
                        const offer = await pc.createOffer(); //returns sdp
                        // tell the connection what the other side sent
                        await pc.setLocalDescription(offer); // triggers the browser to start the ICE candidate gathering process.
                        mark("offer_sent")
                        ws.send(JSON.stringify({type: "offer", sdp: offer, roomId}))
                    }
                    handlePeerJoined(); //IIFE , returns a promise, but we don't care about the return value
                }
            }
            if (msg.type === "error" && msg.error === "room_not_found") {
                setConnectionState("room_not_found")
            }
            if(msg.type==="error" && msg.error === "room_full"){
                setConnectionState("room_full")
            }
            //responder receives offer from initiator
            if (msg.type === "offer") {
                const handleOffer = async () => {
                    await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)); //offer , tell the connection what the other side sent
                    const answer = await pc.createAnswer(); //answer to the offer, returns sdp
                    await pc.setLocalDescription(answer); // tell the connection about the answer
                    mark("answer_sent")
                    ws.send(JSON.stringify({type: "answer", sdp: answer, roomId}))
                }
                handleOffer(); //IIFE
            }
            //initiator receives answer from the responder
            if (msg.type === "answer") {
                const handleAnswer = async () => {
                    await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));  // tell the connection what the other side sent
                    mark("answer_received")
                }
                handleAnswer(); //IIFE
            }
            if (msg.type === "ice") {
                const handleIce = async () => {
                    await pc.addIceCandidate(new RTCIceCandidate(msg.iceCandidate));
                }
                handleIce(); //IIFE
            }
            if (msg.type === "peer_left") {
                setConnectionState("failed")
                setPeerName(null)
            }
        }
        //events browser fires automatically, not triggered by ws messages from the server
        //browser automatically starts gathering ICE can
        // didates whenever setLocalDescription or setRemoteDescription is called
        let firstIceLogged = false; //flag to mark the first ice candidate
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                if (!firstIceLogged) {
                    mark("first_ice_candidate")
                    firstIceLogged = true;
                }
                ws.send(JSON.stringify({type: "ice", iceCandidate: event.candidate, roomId}));
            }
        }
        // responder side, fires when browser receives a DataChannel from the other peer
        pc.ondatachannel = (event) => {
            channelRef.current = event.channel;
            channelRef.current.onopen = () => {
                console.log(`[BENCH] TOTAL HANDSHAKE TIME: ${(performance.now() - peerJoinedAtRef.current).toFixed(1)}ms`)
                setConnectionState("connected")
            }
        }

        // cleanup on unmount , user closes the tab
        return () => {
            ws.close(); // close websocket connection
            pc.close(); // close webrtc connection
        }

    }, []) //run once

    return {role, connectionState, channelRef, peerName, name};

}

export default useConnection