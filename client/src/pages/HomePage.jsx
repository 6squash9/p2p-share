import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components /Navbar";
import "./HomePage.css";

function HomePage() {
    const [inputRoomId, setInputRoomId] = useState("");
    const navigate = useNavigate();

    const createRoom = async () => {
        const response = await axios.post("http://localhost:8080/rooms");
        navigate(`/room/${response.data.roomId}`);
    }

    const joinRoom = () => {
        navigate(`/room/${inputRoomId}`)
    }

    return (
        <div className="home-wrapper">
            <Navbar />
            <div className="home-bg" />
            
            <div className="home-content">
                <h2>Your file. Their browser. <span className="accent-text">Nothing in between.</span></h2>
                <p className="home-subtitle">No signup. No storage. Direct browser-to-browser transfer.</p>
                
                <div className="room-controls">
                    <button className="primary-btn" onClick={createRoom}>Create a New Room</button>
                    
                    <div className="divider">or</div>
                    
                    <div className="join-group">
                        <input 
                            type="text" 
                            placeholder="Enter room code"
                            value={inputRoomId} 
                            onChange={(e) => setInputRoomId(e.target.value)} 
                        />
                        <button 
                            className="secondary-btn"
                            onClick={joinRoom}
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;