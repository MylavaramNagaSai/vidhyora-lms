"use client";
import React, { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function SinglePostView({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, 'community_posts', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists() && postSnap.data().isApproved) {
          setPost({ id: postSnap.id, ...postSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-black text-slate-900 mb-2">404</h1>
        <p className="text-slate-500 font-medium mb-6">This post was not found, or it may have been deleted.</p>
        <Link href="/login" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
          Go to Vidhyora Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header / Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-blue-600 tracking-tight mb-1">Vidhyora Community</h1>
          <p className="text-slate-500 font-medium text-sm">Join the top 1% tech network.</p>
        </div>

        {/* Post Container */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50">
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-white shadow-sm ${post.authorRole === 'admin' ? 'bg-blue-600' : 'bg-slate-800'}`}>
              {post.authorName?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black text-slate-900 leading-none">{post.authorName}</h4>
                {post.authorRole === 'admin' && (
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Admin</span>
                )}
              </div>
              <span className="text-sm font-medium text-slate-400">
                {new Date(post.createdAt?.toDate()).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="mb-8">
            {post.content && (
              <p className="text-slate-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>
            )}
            
            {post.imageUrl && (
              <div className="w-full rounded-2xl overflow-hidden border border-slate-100 mb-6 bg-slate-50">
                <img src={post.imageUrl} alt="Post Attachment" className="w-full object-cover" />
              </div>
            )}

            {post.videoUrl && (
              <div className="w-full rounded-2xl overflow-hidden border border-slate-100 mb-6 bg-black">
                <video src={post.videoUrl} controls className="w-full" />
              </div>
            )}

            {post.audioUrl && (
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Voice Note / Audio File</span>
                <audio src={post.audioUrl} controls className="w-full outline-none" />
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="border-t border-slate-100 pt-8 mt-4 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Want to join the conversation?</h3>
            <p className="text-slate-500 text-sm mb-6">Log in to your student portal to like, comment, and engage with the community.</p>
            <Link href="/login" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-10 rounded-xl transition-all shadow-lg shadow-slate-900/20">
              Log in to Vidhyora
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}