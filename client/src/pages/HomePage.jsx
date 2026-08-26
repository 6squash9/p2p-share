import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Navbar from "../components /Navbar";
import "./HomePage.css";

function HomePage() {
    const [inputRoomId, setInputRoomId] = useState("");
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

    const createRoom = async () => {
        setError("");
        setCreating(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rooms`);
            navigate(`/room/${response.data.roomId}`);
        } catch (err) {
            // the server returns 429 once it is at its room ceiling. without this
            // the button just silently did nothing on any failure.
            setError(
                err.response?.status === 429
                    ? "We're at capacity right now. Please try again in a minute."
                    : "Couldn't reach the server. Check your connection and try again."
            );
            setCreating(false);
        }
    }

    const joinRoom = () => {
        navigate(`/room/${inputRoomId}`)
    }

    return (
        <div className="home-wrapper">
            <Navbar/>
            <div className="home-bg"/>

            <div className="home-content">
                <h2>Your file. Their browser. <span className="accent-text">Nothing in between.</span></h2>
                <p className="home-subtitle">No signup. No storage. Direct browser-to-browser transfer.</p>

                <div className="room-controls">
                    <button className="primary-btn" onClick={createRoom} disabled={creating}>
                        {creating ? "Creating..." : "Create a New Room"}
                    </button>

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

                {error && <p className="home-error">{error}</p>}
            </div>
        </div>
    );
}

export default HomePage;