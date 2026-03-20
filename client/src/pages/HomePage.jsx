import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function HomePage() {
    const [inputRoomId, setInputRoomId] = useState("");
    const navigate = useNavigate();

    const createRoom = async () => {
        //call POST/rooms to get roomId
        const response = await axios.post("http://localhost:8080/rooms");
        //navigate to the roomCreated
        navigate(`/room/${response.data.roomId}`);
    }

    const joinRoom = () => {
        //navigate to the entered roomId
        navigate(`/room/${inputRoomId}`)
    }

    return (
        <>
        <div className="home-wrapper">

            
        </div>



            <button onClick={createRoom}>Create a Room</button>
            <input type="text" placeholder="enter the roomId"
                   value={inputRoomId} onChange={(e) => {
                setInputRoomId(e.target.value)
            }}/>
            <button onClick={joinRoom}>Join the Room</button>
        </>
    )
}

export default HomePage