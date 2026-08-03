import {useEffect, useRef, useState} from "react";

function useReceiver(channelRef) {

    const fileMetaRef = useRef(null); //reference for the file meta
    const pendingChunkRef = useRef(null); //reference for the chunk data
    const chunkRef = useRef([]); //reference for the array
    const [progress, setProgress] = useState(0);
    // const [downloadUrl, setDownloadUrl] = useState(null);
    // const [fileName, setFileName] = useState(null);
    const [receivedFiles, setReceivedFiles] = useState([])

    // ===== BENCH =====
    const chunkTimestampsRef = useRef([]);
    const receiveStartRef = useRef(null);

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
                chunkTimestampsRef.current.push(performance.now()); //BENCH
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
                    chunkTimestampsRef.current = []; // ===== BENCH: reset =====
                    receiveStartRef.current = performance.now(); // ===== BENCH: mark start =====
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

                    // ===== BENCH: compute + log =====
                    const totalDurationMs = performance.now() - receiveStartRef.current;
                    const timestamps = chunkTimestampsRef.current;
                    const gaps = [];
                    for (let i = 1; i < timestamps.length; i++) gaps.push(timestamps[i] - timestamps[i - 1]);
                    const percentile = (arr, p) => {
                        if (arr.length === 0) return 0;
                        const sorted = [...arr].sort((a, b) => a - b);
                        return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)];
                    }
                    const throughputMBps = (fileMetaRef.current.size / 1024 / 1024) / (totalDurationMs / 1000);

                    console.log(`%c[BENCH RECEIVER] ${fileMetaRef.current.name}`, "color:#6214D9;font-weight:bold");
                    console.table({
                        "File size (MB)": (fileMetaRef.current.size / 1024 / 1024).toFixed(2),
                        "Total chunks": timestamps.length,
                        "Total duration (ms)": totalDurationMs.toFixed(1),
                        "Throughput (MB/s)": throughputMBps.toFixed(2),
                        "Inter-chunk gap P50 (ms)": percentile(gaps, 50).toFixed(2),
                        "Inter-chunk gap P95 (ms)": percentile(gaps, 95).toFixed(2),
                        "Inter-chunk gap P99 (ms)": percentile(gaps, 99).toFixed(2),
                    });
                }
            }
        }
    }, []); // [] is safe because useReceiver only mounts when connectionState === "connected"
    // meaning channelRef.current is guaranteed to be set at this point
    return {progress, receivedFiles}
}

export default useReceiver