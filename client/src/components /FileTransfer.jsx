import {useState} from "react";
import useSender from "../connections/useSender.js";
import useReceiver from "../connections/useReceiver.js";

function FileTransfer({channelRef}) {
    const [file, setFile] = useState(null);
    const [sendProgress, setSenderProgress] = useState(0); //0-100

    const {sendFile} = useSender(channelRef, setSenderProgress); //useSender returns an object
    const {progress} = useReceiver(channelRef)

    const share = () => {
        sendFile(file)
    }

    return (
        <>
            <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
            <button onClick={share} disabled={!file}>Send</button>
            <div>Progress during Sending: {sendProgress}%</div>
            <div>Progress during Receiving : {progress}%</div>
        </>
    )

}

export default FileTransfer
