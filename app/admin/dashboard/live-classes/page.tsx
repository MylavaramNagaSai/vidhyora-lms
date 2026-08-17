"use client";
import { useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

export default function LiveClassesPage() {
  const [roomToken, setRoomToken] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const startClass = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/live-classes/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomName: 'vidhyora-cohort-1', 
          participantName: 'Admin (Host)' 
        })
      });
      
      const data = await response.json();
      if (data.token) {
        setRoomToken(data.token);
      } else {
        alert(data.error || "Failed to fetch LiveKit token. Check server logs.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error connecting to SFU.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLocalRecord = async () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true 
      });
      
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
      let chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `Vidhyora_Cohort_Recording_${new Date().toISOString().split('T')[0]}.webm`;
        a.click();
        
        window.URL.revokeObjectURL(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Recording failed to start:", error);
      alert("Could not access screen for local recording.");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col">
       <div className="flex items-center justify-between mb-6">
         <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Live Classes</h2>
           <p className="text-sm font-medium text-slate-500 mt-1">High-performance SFU active. Max capacity: 100+ concurrent learners.</p>
         </div>
         
         <div className="flex gap-3">
           <button 
             onClick={handleLocalRecord}
             className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${
               isRecording 
                 ? 'bg-red-50 text-red-600 border-red-200' 
                 : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
             }`}
           >
             {isRecording ? "Stop Local Recording" : "Start Local Record"}
           </button>
           <button 
             onClick={startClass}
             disabled={isConnecting}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-lg transition-colors"
           >
             {isConnecting ? "Connecting..." : "Initialize Session"}
           </button>
         </div>
       </div>
       
       <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl flex items-center justify-center">
         {!roomToken ? (
           <div className="text-center p-6">
             <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-slate-400 font-medium text-sm">
               {isConnecting ? "Fetching secure token..." : 'Click "Initialize Session" in the top right to start the Live Class'}
             </p>
           </div>
         ) : (
           <LiveKitRoom
             video={true}
             audio={true}
             token={roomToken}
             serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
             data-lk-theme="default"
             className="w-full h-full"
           >
             <VideoConference />
             <RoomAudioRenderer />
           </LiveKitRoom>
         )}
       </div>
    </div>
  );
}
