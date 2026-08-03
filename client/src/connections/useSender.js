function useSender(channelRef, setSenderProgress) {
    //convert file to array buffer
    const sendFile = async (file) => {
        // BENCH setup
        const chunkTimestamps = [];
        let backpressureEvents = 0;
        let backpressureTotalWaitMs = 0;
        const transferStart = performance.now();

        const CHUNK_SIZE = 64 * 1024; //64 KB
        // convert file to arraybuffer so we can slice it
        const arrayBuffer = await file.arrayBuffer() //returns a promise
        //send file meta to the receiver so they can prepare
        channelRef.current.send(JSON.stringify({
            type: "file_meta",
            name: file.name,
            size: file.size,
            mime: file.type,
            totalChunks: Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE)
        }))
        //lets slice the file
        for (let i = 0; i * CHUNK_SIZE < arrayBuffer.byteLength; i++) {
            const start = i * CHUNK_SIZE
            const end = start + CHUNK_SIZE
            const slice = arrayBuffer.slice(start, end)
            //backpressure handling
            // Monitors if queued data exceeds 8 MB
            if (channelRef.current.bufferedAmount > 8 * 1024 * 1024) {
                const waitStart = performance.now(); //BENCH
                backpressureEvents++; //BENCH
                //pause transmission by creating a promise
                await new Promise((resolve) => {
                    channelRef.current.bufferedAmountLowThreshold = 2 * 1024 * 1024 // drain threshold for the WebRTC data channel to 2 MB
                    channelRef.current.onbufferedamountlow = resolve //when buffer drains remind me
                })
                backpressureTotalWaitMs += (performance.now() - waitStart); //BENCH
            }

            // send chunk data for reassembling
            channelRef.current.send(
                JSON.stringify({
                    type: "chunk",
                    fileId: file.name,
                    index: i,
                    byteLength: slice.byteLength
                })
            )
            //send file
            channelRef.current.send(slice)
            chunkTimestamps.push(performance.now()); //BENCH

            //calculate progress sent
            const totalChunks = Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE)
            const percentage = ((i + 1) / totalChunks) * 100
            setSenderProgress(percentage);
        }
        //notify the receiver about all chunks are sent
        channelRef.current.send(JSON.stringify({
            type: "transfer_complete",
            fileId: file.name
        }))
        // setSenderProgress(0);


        // ===== BENCH: compute + log =====
        const totalDurationMs = performance.now() - transferStart;
        const gaps = [];
        for (let i = 1; i < chunkTimestamps.length; i++) gaps.push(chunkTimestamps[i] - chunkTimestamps[i - 1]);
        const percentile = (arr, p) => {
            if (arr.length === 0) return 0;
            const sorted = [...arr].sort((a, b) => a - b);
            return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)];
        }
        const throughputMBps = (file.size / 1024 / 1024) / (totalDurationMs / 1000);

        console.log(`%c[BENCH SENDER] ${file.name}`, "color:#6214D9;font-weight:bold");
        console.table({
            "File size (MB)": (file.size / 1024 / 1024).toFixed(2),
            "Total chunks": chunkTimestamps.length,
            "Total duration (ms)": totalDurationMs.toFixed(1),
            "Throughput (MB/s)": throughputMBps.toFixed(2),
            "Backpressure pauses": backpressureEvents,
            "Backpressure total wait (ms)": backpressureTotalWaitMs.toFixed(1),
            "Inter-chunk gap P50 (ms)": percentile(gaps, 50).toFixed(2),
            "Inter-chunk gap P95 (ms)": percentile(gaps, 95).toFixed(2),
            "Inter-chunk gap P99 (ms)": percentile(gaps, 99).toFixed(2),
        });
    }
    return {sendFile} //handing the function to the component
}

export default useSender