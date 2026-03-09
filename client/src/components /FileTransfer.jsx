import {useState} from "react";
import useSender from "../connections/useSender.js";

function FileTransfer({channelRef}) {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0); //0-100

    const {sendFile} = useSender(channelRef);

    const share = () => {
        sendFile(file)
    }

    return (
        <>
            <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
            <button onClick={share}>Send</button>
            <div>Progress: {progress}%</div>
        </>
    )
}