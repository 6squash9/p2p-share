import { useEffect, useState } from "react"


//a custom hook
function useConnection(roomId) {
    const [role,setRole] = useState(null);
    const [connectionState , setConnectionState] = useState("idle");

    useEffect(()=>{
        //connection logic 
        const ws = new WebSocket("ws://localhost:8080/signal"); //open websocket connection 
        

    },[])

}

export default useConnection