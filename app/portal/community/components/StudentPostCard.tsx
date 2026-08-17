"use client";
import React, { useState } from 'react';
import { Post, CurrentUser } from '../types';
import ReactionButton from './interactions/ReactionButton';
import RepostButton from './interactions/RepostButton';
import CommentSection from './interactions/CommentSection';

const MessageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>);
const ShareIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const MoreIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>);
const PinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.1 12.3l-8.4-8.4a1 1 0 0 0-1.4 0l-1.4 1.4-4-1.4a1 1 0 0 0-1.2.3l-2.8 3.5a1 1 0 0 0 .1 1.4l4.2 3.5-5.5 5.5a1 1 0 0 0 0 1.4l1.4 1.4a1 1 0 0 0 1.4 0l5.5-5.5 3.5 4.2a1 1 0 0 0 1.4.1l3.5-2.8a1 1 0 0 0 .3-1.2l-1.4-4 1.4-1.4a1 1 0 0 0 0-1.4z"></path></svg>);
const XIconSm = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const LinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>);
const ClockIconSm = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);
const EditIconSm = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);

// Social Icons
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.3 22H3.2l7.2-8.3L3 2h6.4l4.4 5.9L18.9 2z"/></svg>);
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
const LinkedInIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>);
const WhatsAppIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>);

const reactionEmojiMap: Record<string, string> = { like: '👍', love: '❤️', haha: '😆', wow: '😲', sad: '😢', angry: '😡' };

export default function StudentPostCard({ post, currentUser, onDeleteAction, onEditAction }: { post: Post, currentUser: CurrentUser, onDeleteAction: (post: Post) => void, onEditAction?: (post: Post) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showReactionList, setShowReactionList] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const isAuthor = post.authorId === currentUser.id;
  const isPending = !post.isApproved;

  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/portal/community/post/${post.id}`;
  const shareText = `Check out this post on Vidhyora!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => { setIsCopied(true); setTimeout(() => { setIsCopied(false); setShowShareMenu(false); }, 2000); });
  };

  const reactionCount = post.reactions?.length || 0;
  
  // Format Timestamp accurately
  const timeStr = post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Just now';

  return (
    <div className={`bg-white border rounded-3xl p-5 shadow-sm transition-all ${post.isPinned ? 'border-blue-300 shadow-blue-500/10' : isPending ? 'border-amber-300 shadow-amber-500/10' : 'border-slate-200 hover:shadow-md'}`}>
      
      {/* Dynamic Top Badges */}
      {isPending && <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 uppercase tracking-widest mb-4 ml-12"><ClockIconSm /> Pending TA Review</div>}
      {post.isPinned && !isPending && <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase tracking-widest mb-3 ml-12"><PinIcon /> Pinned Post</div>}
      {post.isRepost && !isPending && <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-12">Reposted from {post.originalAuthor}</div>}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white shadow-sm ${post.authorRole === 'admin' ? 'bg-blue-600' : 'bg-slate-800'}`}>
            {post.authorName?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 leading-none">{post.authorName}</h4>
              {post.authorRole === 'admin' && <span className="bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md">Admin</span>}
            </div>
            <span className="text-xs font-medium text-slate-400">
              {timeStr} {post.isEdited && <span className="italic font-bold text-slate-500 ml-1">(Edited)</span>}
            </span>
          </div>
        </div>

        {/* 3-Dot Menu (Only for Approved Posts) */}
        {isAuthor && !isPending && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><MoreIcon /></button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 shadow-xl rounded-2xl py-2 z-10 animate-in fade-in zoom-in-95">
                <button onClick={() => { onDeleteAction(post); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Delete Post</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        {post.content && <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>}
        {post.imageUrl && <div className="w-full rounded-2xl overflow-hidden border border-slate-100 mb-4 bg-slate-50"><img src={post.imageUrl} alt="Attachment" className="w-full object-cover max-h-[500px]" /></div>}
        {post.videoUrl && <div className="w-full rounded-2xl overflow-hidden border border-slate-100 mb-4 bg-black"><video src={post.videoUrl} controls className="w-full max-h-[500px]" /></div>}
        {post.audioUrl && <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 flex flex-col gap-2"><span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Audio File</span><audio src={post.audioUrl} controls className="w-full h-10 outline-none" /></div>}
      </div>

      {/* PENDING VIEW: Editing and Deleting Controls */}
      {isPending ? (
        <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2">
          {onEditAction && (
            <button onClick={() => onEditAction(post)} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2.5 rounded-xl transition-colors text-sm">
              <EditIconSm /> Edit Request
            </button>
          )}
          <button onClick={() => onDeleteAction(post)} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm">
            <XIconSm /> Cancel
          </button>
        </div>
      ) : (
        /* APPROVED VIEW: Standard Feed Controls */
        <>
          {reactionCount > 0 && (
            <div className="relative mb-3">
              <button onClick={() => setShowReactionList(!showReactionList)} className="flex items-center gap-2 px-2 py-1 -ml-2 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <span className="text-sm">👍</span>
                <span className="text-xs font-bold text-slate-500 hover:text-blue-600 hover:underline">{reactionCount} Reaction{reactionCount !== 1 && 's'}</span>
              </button>
              
              {showReactionList && (
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl py-3 px-4 z-20 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reactions</span>
                    <button onClick={() => setShowReactionList(false)} className="text-slate-400 hover:text-slate-700 transition-colors"><XIconSm /></button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {post.reactions?.map((r, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg">{reactionEmojiMap[r.type] || '👍'}</span>
                        <span className="text-sm font-bold text-slate-800 truncate">{(r as any).userName || 'A User'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 relative">
            <div className="flex gap-1 w-full">
              <ReactionButton post={post} currentUser={currentUser} />
              <button onClick={() => setShowComments(!showComments)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-colors text-xs font-bold ${showComments ? 'bg-slate-50 text-blue-600' : 'hover:bg-slate-50 text-slate-500'}`}><MessageIcon /> Comment</button>
              <RepostButton post={post} currentUser={currentUser} />
              
              <div className="flex-1 relative">
                <button onClick={() => setShowShareMenu(!showShareMenu)} className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-colors text-xs font-bold ${showShareMenu ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-500'}`}><ShareIcon /> Share</button>
                {showShareMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-20 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"><span className="text-slate-900"><TwitterIcon /></span> Share to X</a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"><span className="text-[#0077b5]"><LinkedInIcon /></span> Share to LinkedIn</a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"><span className="text-[#1877F2]"><FacebookIcon /></span> Share to Facebook</a>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareLink)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"><span className="text-[#25D366]"><WhatsAppIcon /></span> Send via WhatsApp</a>
                    <div className="h-px w-full bg-slate-100 my-1"></div>
                    <button onClick={handleCopyLink} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl">{isCopied ? <span className="text-emerald-500 font-black">Copied!</span> : <><span className="text-slate-400"><LinkIcon /></span> Copy Link</>}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {showComments && <CommentSection postId={post.id} currentUser={currentUser} />}
        </>
      )}
    </div>
  );
}