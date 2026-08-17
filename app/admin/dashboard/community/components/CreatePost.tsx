"use client";
import React, { useState, useRef, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CurrentUser, Post } from '../types';

const ImageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>);
const AudioIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 2c-1.7 0-3 1.2-3 2.6v6.8c0 1.4 1.3 2.6 3 2.6s3-1.2 3-2.6V4.6C15 3.2 13.7 2 12 2z"></path><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18.4v3.3M8 22h8"></path></svg>);
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

const toDatetimeLocal = (timestamp: number) => {
  const date = new Date(timestamp);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

interface CreatePostProps {
  currentUser: CurrentUser;
  activeRoomId: string;
  editingPost?: Post | null;
  onCancelEdit?: () => void;
}

export default function CreatePost({ currentUser, activeRoomId, editingPost, onCancelEdit }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  // File Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Existing Media States
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  const [existingAudio, setExistingAudio] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content || '');
      
      if (editingPost.scheduledFor) {
        setShowSchedule(true);
        setScheduledDate(toDatetimeLocal(editingPost.scheduledFor));
      } else {
        setShowSchedule(false);
        setScheduledDate('');
      }

      setExistingImage(editingPost.imageUrl || null);
      setExistingVideo(editingPost.videoUrl || null);
      setExistingAudio(editingPost.audioUrl || null);
    } else {
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setContent('');
    setShowSchedule(false);
    setScheduledDate('');
    setImageFile(null);
    setVideoFile(null);
    setAudioFile(null);
    setExistingImage(null);
    setExistingVideo(null);
    setExistingAudio(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleClearImage = () => { setImageFile(null); setExistingImage(null); };
  const handleClearVideo = () => { setVideoFile(null); setExistingVideo(null); };
  const handleClearAudio = () => { setAudioFile(null); setExistingAudio(null); };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile && !videoFile && !audioFile && !existingImage && !existingVideo && !existingAudio) return;
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = existingImage;
      let finalVideoUrl = existingVideo;
      let finalAudioUrl = existingAudio;

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

      const scheduledTimestamp = (showSchedule && scheduledDate) ? new Date(scheduledDate).getTime() : null;

      if (editingPost) {
        const updatePayload: any = {
          content: content.trim(),
          scheduledFor: scheduledTimestamp,
          imageUrl: finalImageUrl,
          videoUrl: finalVideoUrl,
          audioUrl: finalAudioUrl
        };
        await updateDoc(doc(db, 'community_posts', editingPost.id), updatePayload);
        if (onCancelEdit) onCancelEdit();
      } else {
        await addDoc(collection(db, 'community_posts'), {
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          content: content.trim(),
          courseRoomId: activeRoomId,
          isApproved: currentUser.role === 'admin', 
          createdAt: serverTimestamp(),
          isPinned: false,
          scheduledFor: scheduledTimestamp,
          imageUrl: finalImageUrl,
          videoUrl: finalVideoUrl,
          audioUrl: finalAudioUrl,
          likes: [],
          comments: 0
        });
        resetForm();
      }

    } catch (e) {
      console.error(e);
      alert("Error processing post. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  // Determine current media URLs (Prioritize new file preview over existing DB url)
  const currentImageUrl = imageFile ? URL.createObjectURL(imageFile) : existingImage;
  const currentVideoUrl = videoFile ? URL.createObjectURL(videoFile) : existingVideo;
  const currentAudioUrl = audioFile ? URL.createObjectURL(audioFile) : existingAudio;

  return (
    <div className={`bg-white border rounded-3xl p-5 shadow-sm transition-all ${editingPost ? 'border-blue-400 shadow-blue-500/20' : 'border-slate-200'}`}>
      
      {editingPost && (
        <div className="flex items-center justify-between mb-4 ml-14">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">Editing Scheduled Post</span>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
          {currentUser.name.charAt(0)}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
          className="w-full bg-slate-50 border border-transparent rounded-2xl px-4 py-3 outline-none focus:border-blue-200 focus:bg-white resize-none font-medium text-slate-700 transition-all"
          rows={3}
        />
      </div>

      {/* RICH MEDIA PREVIEWS */}
      <div className="ml-14 mb-4 flex flex-col gap-4">
        
        {/* Full Image Preview */}
        {currentImageUrl && (
          <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
            <img src={currentImageUrl} alt="Preview" className="w-full max-h-72 object-contain" />
            <button 
              onClick={handleClearImage} 
              className="absolute top-3 right-3 bg-slate-900/60 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg"
            >
              <XIcon />
            </button>
          </div>
        )}

        {/* Full Video Preview */}
        {currentVideoUrl && (
          <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 bg-black group">
            <video src={currentVideoUrl} controls className="w-full max-h-72" />
            <button 
              onClick={handleClearVideo} 
              className="absolute top-3 right-3 z-10 bg-slate-900/60 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg"
            >
              <XIcon />
            </button>
          </div>
        )}

        {/* Native Audio Preview */}
        {currentAudioUrl && (
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 p-4 bg-slate-50 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Audio Track Attached</span>
              <button onClick={handleClearAudio} className="text-slate-400 hover:text-red-500 transition-colors">
                <XIcon />
              </button>
            </div>
            <audio src={currentAudioUrl} controls className="w-full h-10 outline-none" />
          </div>
        )}
      </div>

      <input type="file" accept="image/*" hidden ref={imageInputRef} onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      <input type="file" accept="video/*" hidden ref={videoInputRef} onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
      <input type="file" accept="audio/*" hidden ref={audioInputRef} onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />

      {showSchedule && (
        <div className="mb-4 ml-14 flex items-center gap-3 bg-amber-50 p-3 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
          <ClockIcon />
          <input 
            type="datetime-local" 
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-amber-900 w-full"
          />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 ml-14">
        <div className="flex flex-wrap gap-1">
          <button onClick={() => imageInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-500">
            <ImageIcon /> Photo
          </button>
          <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-500">
            <VideoIcon /> Video
          </button>
          <button onClick={() => audioInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-500">
            <AudioIcon /> Audio
          </button>
          <button onClick={() => setShowSchedule(!showSchedule)} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-xs font-bold ${showSchedule ? 'bg-amber-100 text-amber-700' : 'hover:bg-slate-50 text-slate-500'}`}>
            <ClockIcon /> Schedule
          </button>
        </div>
        
        <div className="flex gap-2">
          {editingPost && (
            <button onClick={handleCancelEdit} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">
              Cancel
            </button>
          )}
          <button 
            onClick={handleSubmit}
            disabled={(!content.trim() && !imageFile && !videoFile && !audioFile && !existingImage && !existingVideo && !existingAudio) || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            {isSubmitting ? 'Saving...' : (editingPost ? 'Update Post' : (showSchedule && scheduledDate ? 'Schedule' : 'Post'))}
          </button>
        </div>
      </div>
    </div>
  );
}