import {useParams} from "react-router-dom";
import useConnection from "../connections/useConnection.js";
import FileTransfer from "../components /FileTransfer.jsx";
import {useEffect} from "react";

function RoomPage() {
    const {roomId} = useParams(); //get the roomId from the url
    const {role, connectionState, channelRef, peerName, name} = useConnection(roomId); //object destructuring

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
    }
    useEffect(() => {
        if (connectionState === "connected") {
            const handleBeforeUnload = (e) => {
                e.preventDefault()
            }
            window.addEventListener("beforeunload", handleBeforeUnload)
            return () => window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [connectionState])

    return (
        <>
            <div>You are: {name}</div>
            {peerName && <div>{peerName} has joined!</div>}
            {/*conditional rendering*/}
            {connectionState === "connected" ? <div style={{color: "green"}}>Webrtc Connected</div> :
                <div style={{color: "red"}}>Webrtc not Connected</div>}
            <div>Your RoomId:- {roomId}</div>
            {connectionState === "connected" ? <FileTransfer channelRef={channelRef}></FileTransfer> :
                <div>please connect</div>}
            <button onClick={copyLink}>Copy the link of this Room</button>
        </>
    )
}

export default RoomPage