import {useParams} from "react-router-dom";
import useConnection from "../connections/useConnection.js";

function RoomPage() {
    const {roomId} = useParams(); //get the roomId from the url
    const {role, connectionState, channelRef} = useConnection(roomId); //object destructuring
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
    }
    return (
        <>
            {/*conditional rendering*/}
            {connectionState === "connected" ? <div style={{color: "green"}}>Connected</div> :
                <div style={{color: "red"}}>not Connected</div>}
            <div>{roomId}</div>
            <button onClick={copyLink}>Copy the link</button>
            <div></div>
        </>
    )
}

export default RoomPage