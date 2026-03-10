import {useEffect, useRef, useState} from "react";

function useReceiver(channelRef) {

    const fileMetaRef = useRef(null); //reference for the file meta
    const pendingChunkRef = useRef(null); //reference for the chunk data
    const chunkRef = useRef([]); //reference for the array
    const [progress, setProgress] = useState(0);
    // const [downloadUrl, setDownloadUrl] = useState(null);
    // const [fileName, setFileName] = useState(null);
    const [receivedFiles, setReceivedFiles] = useState([])

    //wrapping the entire channelRef.onmessage in useEffect because  If channelRef.current is null when the component renders, accessing .onmessage on it will throw a TypeError.
    useEffect(() => {
        //if channelRef is null stop the execution , defensive check
        if (channelRef.current === null) {
            return;
        }
        //event = box
        channelRef.current.onmessage = (event) => {
            //event object can be carrying arraybuffer or json string
            //check if it is a arraybuffer
            if (event.data instanceof ArrayBuffer) {
                //true if binary
                chunkRef.current.push(event.data)
                //calculate total percentage done
                const chunksReceived = chunkRef.current.length;
                const totalChunks = fileMetaRef.current.totalChunks;
                if (totalChunks > 0) {
                    const percentage = chunksReceived / totalChunks * 100;
                    setProgress(percentage);
                }
            }
            // or it is a json string
            else {
                //convert json string to js object
                const msg = JSON.parse(event.data) //event.data = the actual data
                if (msg.type === "file_meta") {
                    //a new file is coming
                    fileMetaRef.current = msg; //save the file meta for now , TODO:checking storage
                    chunkRef.current = []; //empty the array
                    setProgress(0); //reset the progress
                }
                if (msg.type === "chunk") {
                    pendingChunkRef.current = msg; // TODO:data corruption
                }
                if (msg.type === "transfer_complete") {
                    // if (chunkRef.current.length === fileMetaRef.current.totalChunks) {} //TODO:check if all the chunks arrive, for now trust webrtc
                    // convert array buffer to an actual file
                    const blob = new Blob(chunkRef.current, {type: fileMetaRef.current.mime})
                    //trigger the download
                    const url = URL.createObjectURL(blob) //creates a temporary download URL
                    const a = document.createElement("a")  //creates a fake <a> tag
                    a.href = url
                    a.download = fileMetaRef.current.name //set file name for the download
                    a.click(); //triggers download
                    // URL.revokeObjectURL(url) // revokes the temporary download URL
                    // setProgress(0)
                    // setDownloadUrl(url)
                    // setFileName(fileMetaRef.current.name)
                    setReceivedFiles(prevState => [...prevState, {url: url, name: fileMetaRef.current.name}])
                }
            }
        }
    }, []); // [] is safe because useReceiver only mounts when connectionState === "connected"
    // meaning channelRef.current is guaranteed to be set at this point
    return {progress, receivedFiles}
}

export default useReceiver