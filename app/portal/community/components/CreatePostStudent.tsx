"use client";
import React, { useState, useRef } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CurrentUser } from '../types';

const ImageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>);
const AudioIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 2c-1.7 0-3 1.2-3 2.6v6.8c0 1.4 1.3 2.6 3 2.6s3-1.2 3-2.6V4.6C15 3.2 13.7 2 12 2z"></path><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18.4v3.3M8 22h8"></path></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

export default function CreatePostStudent({ currentUser, activeRoomId }: { currentUser: CurrentUser, activeRoomId: string }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Media States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null); // NEW
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null); // NEW

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile && !videoFile && !audioFile) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = null;
      let finalVideoUrl = null;
      let finalAudioUrl = null; // NEW

      if (imageFile) {
        const fileRef = ref(storage, `community/images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(fileRef);
      }
      if (videoFile) {
        const fileRef = ref(storage, `community/videos/${Date.now()}_${videoFile.name}`);
        await uploadBytes(fileRef, videoFile);
        finalVideoUrl = await getDownloadURL(fileRef);
      }
      if (audioFile) {
        const fileRef = ref(storage, `community/audio/${Date.now()}_${audioFile.name}`);
        await uploadBytes(fileRef, audioFile);
        finalAudioUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'community_posts'), {
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: content.trim(),
        courseRoomId: activeRoomId,
        isApproved: false, // MUST BE FALSE FOR STUDENTS
        createdAt: serverTimestamp(),
        isPinned: false,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        audioUrl: finalAudioUrl, // NEW
        likes: [],
        comments: 0
      });

      setContent(''); setImageFile(null); setVideoFile(null); setAudioFile(null);
      alert("Post submitted! It will appear on the feed once approved by a TA.");
    } catch (e) {
      console.error(e);
      alert("Error submitting post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImageUrl = imageFile ? URL.createObjectURL(imageFile) : null;
  const currentVideoUrl = videoFile ? URL.createObjectURL(videoFile) : null;
  const currentAudioUrl = audioFile ? URL.createObjectURL(audioFile) : null; // NEW

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-black shrink-0 shadow-md">
          {currentUser.name.charAt(0)}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}? Share your progress or ask a question...`}
          className="w-full bg-slate-50 border border-transparent rounded-2xl px-4 py-3 outline-none focus:border-blue-200 focus:bg-white resize-none font-medium text-slate-700 transition-all"
          rows={3}
        />
      </div>

      <div className="ml-14 mb-4 flex flex-col gap-4">
        {currentImageUrl && (
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200">
            <img src={currentImageUrl} alt="Preview" className="w-full max-h-48 object-cover" />
            <button onClick={() => setImageFile(null)} className="absolute top-2 right-2 bg-slate-900/60 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"><XIcon /></button>
          </div>
        )}
        {currentVideoUrl && (
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 bg-black">
            <video src={currentVideoUrl} controls className="w-full max-h-48" />
            <button onClick={() => setVideoFile(null)} className="absolute top-2 right-2 z-10 bg-slate-900/60 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"><XIcon /></button>
          </div>
        )}
        {/* NEW AUDIO PREVIEW */}
        {currentAudioUrl && (
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 p-4 bg-slate-50 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Audio Track Attached</span>
              <button onClick={() => setAudioFile(null)} className="text-slate-400 hover:text-red-500 transition-colors"><XIcon /></button>
            </div>
            <audio src={currentAudioUrl} controls className="w-full h-10 outline-none" />
          </div>
        )}
      </div>

      <input type="file" accept="image/*" hidden ref={imageInputRef} onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      <input type="file" accept="video/*" hidden ref={videoInputRef} onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
      <input type="file" accept="audio/*" hidden ref={audioInputRef} onChange={(e) => setAudioFile(e.target.files?.[0] || null)} /> {/* NEW */}

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 ml-14">
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-500"><ImageIcon /> Photo</button>
          <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-500"><VideoIcon /> Video</button>
          {/* NEW AUDIO BUTTON */}
          <button onClick={() => audioInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-500"><AudioIcon /> Audio</button>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={(!content.trim() && !imageFile && !videoFile && !audioFile) || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          {isSubmitting ? 'Sending...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
}