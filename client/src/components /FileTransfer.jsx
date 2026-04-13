import { useState, useEffect } from "react";
import useSender from "../connections/useSender.js";
import useReceiver from "../connections/useReceiver.js";
import { UploadCloud } from "lucide-react";

function FileTransfer({ channelRef, onReceivedFilesChange }) {
    const [file, setFile] = useState(null);
    const [sendProgress, setSenderProgress] = useState(0); //0-100

    const { sendFile } = useSender(channelRef, setSenderProgress);
    const { progress, receivedFiles } = useReceiver(channelRef);

    // Bubble up receivedFiles to parent (RoomPage) so it can render the side panel
    useEffect(() => {
        if (onReceivedFilesChange) {
            onReceivedFilesChange(receivedFiles);
        }
    }, [receivedFiles]);

    const share = () => {
        if (file) {
            sendFile(file);
        }
    }

    return (
        <div className="transfer-section">
            <div className="file-input-wrapper">
                <input
                    type="file"
                    className="file-input-actual"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="file-input-button">
                    <UploadCloud size={20} />
                    <span className="file-input-name" title={file ? file.name : "Select a file to send..."}>
                        {file ? file.name : "Select a file to send..."}
                    </span>
                </div>
            </div>

            <button
                className="send-button"
                onClick={share}
                disabled={!file || (sendProgress > 0 && sendProgress < 100)}
            >
                {sendProgress > 0 && sendProgress < 100 ? `Sending... ${sendProgress}%` : "Send File"}
            </button>

            {sendProgress > 0 && (
                <div className="progress-container">
                    <div className="progress-label">
                        <span>Uploading {file?.name}</span>
                        <span>{sendProgress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${sendProgress}%` }}></div>
                    </div>
                </div>
            )}

            {progress > 0 && progress < 100 && (
                <div className="progress-container">
                    <div className="progress-label">
                        <span>Receiving file...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default FileTransfer
