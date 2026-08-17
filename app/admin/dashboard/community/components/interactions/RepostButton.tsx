"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Post, CurrentUser } from '../../types';

const RepostIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>);

export default function RepostButton({ post, currentUser }: { post: Post, currentUser: CurrentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleConfirmRepost = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'community_posts'), {
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: post.content,
        courseRoomId: post.courseRoomId,
        isApproved: true,
        isRepost: true,
        originalAuthor: post.authorName,
        imageUrl: post.imageUrl || null,
        videoUrl: post.videoUrl || null,
        audioUrl: post.audioUrl || null,
        createdAt: serverTimestamp(),
        isPinned: false,
        reactions: [],
        comments: 0
      });
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-500"
      >
        <RepostIcon /> Repost
      </button>

      {/* Sleek Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <RepostIcon />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Share this post?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              This will instantly repost this content to the global community feed under your name.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmRepost}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                {isSubmitting ? 'Sharing...' : 'Yes, Share it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}