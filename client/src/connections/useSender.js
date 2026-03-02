function useSender(channelRef) {
    //convert file to array buffer
    const sendFile = async (file) => {
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
                //pause transmission by creating a promise
                await new Promise((resolve) => {
                    channelRef.current.bufferedAmountLowThreshold = 2 * 1024 * 1024 // drain threshold for the WebRTC data channel to 2 MB
                    channelRef.current.onbufferedamountlow = resolve //when buffer drains remind me
                })
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
        }
        //notify the receiver about all chunks are sent
        channelRef.current.send(JSON.stringify({
            type: "transfer_complete",
            fileId: file.name
        }))
    }
    return {sendFile} //handing the function to the component
}

export default useSender