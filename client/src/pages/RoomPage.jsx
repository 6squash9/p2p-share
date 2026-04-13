import { useParams, useNavigate } from "react-router-dom";
import useConnection from "../connections/useConnection.js";
import FileTransfer from "../components /FileTransfer.jsx";
import Navbar from "../components /Navbar.jsx";
import { useEffect, useState, useCallback } from "react";
import { Copy, Check, Download, Inbox, Info, X } from "lucide-react";
import "./RoomPage.css";
import "./HomePage.css";
import Footer from "../components /Footer.jsx";

function RoomPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { role, connectionState, channelRef, peerName, name } = useConnection(roomId);
    const [copied, setCopied] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [receivedFiles, setReceivedFiles] = useState([]);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    const handleReceivedFilesChange = useCallback((files) => {
        setReceivedFiles(files);
    }, []);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const copyCode = () => {
        navigator.clipboard.writeText(roomId);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
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

    if (connectionState === "room_not_found") {
        return (
            <div className="room-wrapper">
                <Navbar />
                <div className="home-bg" />
                <div className="room-not-found-container">
                    <div className="home-content">
                        <h2>Room <span className="accent-text">Not Found</span></h2>
                        <p className="home-subtitle">This room no longer exists or has expired.</p>
                        <div className="room-controls room-not-found-controls">
                            <button className="primary-btn" onClick={() => navigate("/")}>Go Home</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
    if(connectionState === "room_full"){
        return(
            <div className="room-wrapper">
                <Navbar />
                <div className="home-bg" />
                <div className="room-not-found-container">
                    <div className="home-content">
                        <h2>Room <span className="accent-text">Full</span></h2>
                        <p className="home-subtitle">This room is full. Please create a new room to transfer files.</p>
                        <div className="room-controls room-not-found-controls">
                            <button className="primary-btn" onClick={() => navigate("/")}>Go Home</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
    return (
        <div className="room-wrapper">
            <div className="room-bg" />

            <div className="room-main">
                {/* Left: Main card */}
                <div className="room-card">
                    <div className="room-header">
                        <h1 className="room-title">Transfer Room</h1>
                        {connectionState !== "failed" && (
                            <div className="room-id-row">
                                <div className="room-id">
                                    Room Code: {roomId}
                                    <button className="copy-code-btn" onClick={copyCode} title="Copy room code">
                                        {copiedCode ? <Check size={11} /> : <Copy size={11} />}
                                    </button>
                                </div>
                                <button className="copy-link-btn" onClick={copyLink}>
                                    <span className="copy-link-inner">
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? "Copied!" : "Copy Room Link"}
                                    </span>
                                </button>
                            </div>
                        )}
                        {connectionState !== "failed" && (
                            <p className="share-hint">Send this link to a friend to connect</p>
                        )}
                    </div>


                    <div className={`connection-status ${connectionState === "connected" ? "status-connected" :
                        connectionState === "failed" ? "status-failed" :
                            "status-disconnected"
                        }`}>
                        <div className="status-dot"></div>
                        {connectionState === "connected" ? "Securely Connected" :
                            connectionState === "failed" ? "Session Ended" :
                                "Waiting for peer..."}
                    </div>

                    <div className="users-container">
                        <div className="user-row">
                            <div className="user-identity">
                                <div className="user-avatar">{name ? name.charAt(0).toUpperCase() : "U"}</div>
                                <div>
                                    <div className="user-name">{name || "You"}</div>
                                    <div className="user-label">Your Device</div>
                                </div>
                            </div>
                        </div>

                        {connectionState != "failed" && (
                            <div className="user-row" style={{ opacity: peerName ? 1 : 0.5 }}>
                                <div className="user-identity">
                                    <div className="user-avatar peer-avatar" style={!peerName ? { background: 'rgba(255,255,255,0.05)' } : undefined}>
                                        {peerName ? peerName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <div className="user-name">{peerName || 'Waiting...'}</div>
                                        <div className="user-label">{peerName ? 'Connected Peer' : 'Share link to connect'}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {connectionState === "failed" ? (
                        <div className="transfer-status-text">
                            Your peer has left. This session is over. Please create a new room to transfer files.
                        </div>
                    ) : connectionState === "connected" ? (
                        <FileTransfer channelRef={channelRef} onReceivedFilesChange={handleReceivedFilesChange} />
                    ) : (
                        <div className="transfer-status-text">
                            Files can be transferred securely once a peer connects.
                        </div>
                    )}

                </div>

                {/* Right: Received files panel — only shown when connected */}
                {(connectionState === "connected" || connectionState === "failed") ? (
                    <div className="received-files-panel">
                        <div className="received-files-panel-header">
                            <Inbox size={16} />
                            <span>Received Files</span>
                            {receivedFiles.length > 0 ? <span className="received-files-badge">{receivedFiles.length}</span> : null}
                        </div>

                        {showDisclaimer && (
                            <div className="room-disclaimer">
                                <div className="room-disclaimer-content">
                                    <Info size={14} className="disclaimer-icon" />
                                    <span>Files received in this session will be lost if you don't download them.</span>
                                </div>
                                <button className="disclaimer-close" onClick={() => setShowDisclaimer(false)} title="Dismiss">
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <div className="received-files-scroll">
                            {receivedFiles.length === 0 ? (
                                <div className="received-files-empty">
                                    <div className="received-files-empty-icon">📭</div>
                                    <div>Files received from your peer will appear here</div>
                                </div>
                            ) : (
                                receivedFiles.map((file, index) => (
                                    <div key={index} className="received-file-item">
                                        <a href={file.url} download={file.name} className="received-file-name">{file.name}</a>
                                        <a href={file.url} download={file.name} className="download-icon">
                                            <Download size={16} />
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default RoomPage