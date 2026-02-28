import React, { useEffect, useRef } from "react";

function VideoRoom() {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-xl mb-4">Live Video Room</h2>
        <video ref={videoRef} autoPlay muted className="rounded-xl w-[600px]" />
      </div>
    </div>
  );
}

export default VideoRoom;