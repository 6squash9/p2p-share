import { useEffect, useState } from "react"


//a custom hook
function useConnection(roomId) {
    const [role, setRole] = useState(null);
    const [connectionState, setConnectionState] = useState("idle");

    useEffect(() => {
        //connection logic 
        const ws = new WebSocket("ws://localhost:8080/signal"); //open websocket connection 
        ws.onopen = () => {
            console.log("WebSocket connection opened");
            ws.send(JSON.stringify({ type: "join", roomId }));
        }
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log("Message from server: ", msg);
        }
    }, [])

    return { role, connectionState };

}

export default useConnection