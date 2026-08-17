"use client";
import React from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Post, CurrentUser } from '../../types';

const ThumbsUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>);

const REACTIONS = [
  { type: 'like', emoji: '👍', color: 'text-blue-600', label: 'Like', animClass: 'fb-anim-like' },
  { type: 'love', emoji: '❤️', color: 'text-rose-600', label: 'Love', animClass: 'fb-anim-love' },
  { type: 'haha', emoji: '😆', color: 'text-amber-500', label: 'Haha', animClass: 'fb-anim-haha' },
  { type: 'wow',  emoji: '😲', color: 'text-amber-500', label: 'Wow', animClass: 'fb-anim-wow' },
  { type: 'sad',  emoji: '😢', color: 'text-amber-500', label: 'Sad', animClass: 'fb-anim-sad' },
  { type: 'angry', emoji: '😡', color: 'text-orange-600', label: 'Angry', animClass: 'fb-anim-angry' }
];

export default function ReactionButton({ post, currentUser }: { post: Post, currentUser: CurrentUser }) {
  const userReaction = post.reactions?.find(r => r.userId === currentUser.id);
  
  const handleReact = async (type: string) => {
    const currentReactions = post.reactions || [];
    const filteredReactions = currentReactions.filter(r => r.userId !== currentUser.id);
    
    if (userReaction?.type !== type) {
      filteredReactions.push({ 
        userId: currentUser.id, 
        userName: currentUser.name, 
        type: type as any 
      });
    }

    await updateDoc(doc(db, 'community_posts', post.id), { reactions: filteredReactions });
  };

  const activeReactionStyle = userReaction 
    ? REACTIONS.find(r => r.type === userReaction.type) 
    : null;

  return (
    <div className="relative group flex-1">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fbLike {
          0%, 100% { transform: rotate(0deg) scale(1.3) translateY(-4px); }
          25% { transform: rotate(-15deg) scale(1.3) translateY(-4px); }
          75% { transform: rotate(15deg) scale(1.3) translateY(-4px); }
        }
        @keyframes fbLove {
          0%, 100% { transform: scale(1.3) translateY(-4px); }
          50% { transform: scale(1.5) translateY(-4px); }
        }
        @keyframes fbHaha {
          0%, 100% { transform: scale(1.3) translateY(-4px); }
          50% { transform: scale(1.3) translateY(-8px); }
        }
        @keyframes fbWow {
          0%, 100% { transform: scale(1.3) translateY(-4px); }
          50% { transform: scale(1.4) translateY(-4px); }
        }
        @keyframes fbSad {
          0%, 100% { transform: scale(1.3) translateY(-4px); }
          50% { transform: scale(1.3) translateY(-2px); }
        }
        @keyframes fbAngry {
          0%, 100% { transform: scale(1.3) translateY(-4px) rotate(0deg); }
          25% { transform: scale(1.3) translateY(-4px) rotate(-10deg); }
          75% { transform: scale(1.3) translateY(-4px) rotate(10deg); }
        }

        .fb-anim-like:hover { animation: fbLike 0.6s infinite ease-in-out; }
        .fb-anim-love:hover { animation: fbLove 0.8s infinite ease-in-out; }
        .fb-anim-haha:hover { animation: fbHaha 0.4s infinite ease-in-out; }
        .fb-anim-wow:hover { animation: fbWow 1s infinite ease-in-out; }
        .fb-anim-sad:hover { animation: fbSad 2s infinite ease-in-out; }
        .fb-anim-angry:hover { animation: fbAngry 0.3s infinite ease-in-out; }
      `}} />

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-2 hidden group-hover:flex z-40">
        <div className="flex items-center bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 rounded-full px-3 py-2 gap-2 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
          {REACTIONS.map((r) => (
            <div key={r.type} className="relative flex flex-col items-center">
              <button 
                onClick={() => handleReact(r.type)}
                className={`text-[28px] leading-none transition-all duration-300 transform origin-bottom hover:scale-[1.3] hover:-translate-y-1 ${r.animClass}`}
                style={{ animationFillMode: 'both' }}
              >
                {r.emoji}
              </button>
              {/* Tooltip removed! */}
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => handleReact(userReaction ? userReaction.type : 'like')}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-colors text-xs font-bold ${activeReactionStyle ? 'bg-slate-50' : 'hover:bg-slate-50 text-slate-500'}`}
      >
        {activeReactionStyle ? (
          <span className={`flex items-center gap-2 ${activeReactionStyle.color}`}>
            <span className="text-sm">{activeReactionStyle.emoji}</span> {activeReactionStyle.label}
          </span>
        ) : (
          <><ThumbsUpIcon /> Like</>
        )}
      </button>
    </div>
  );
}