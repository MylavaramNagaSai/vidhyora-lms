"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { CurrentUser } from '../../types';

export default function CommentSection({ postId, currentUser }: { postId: string, currentUser: CurrentUser }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit & Reply States
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const commentsRef = collection(db, 'community_posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'community_posts', postId, 'comments'), {
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: newComment.trim(),
        replyToId: replyingTo ? replyingTo.id : null, 
        createdAt: serverTimestamp()
      });
      setNewComment("");
      setReplyingTo(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    await deleteDoc(doc(db, 'community_posts', postId, 'comments', commentId));
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    await updateDoc(doc(db, 'community_posts', postId, 'comments', commentId), {
      content: editContent.trim(),
      isEdited: true
    });
    setEditingCommentId(null);
  };

  // Structuring Threads
  const topLevelComments = comments.filter(c => !c.replyToId);
  const getReplies = (parentId: string) => comments.filter(c => c.replyToId === parentId);

  // Reusable Comment Bubble Component
  const renderCommentBubble = (comment: any, isReply: boolean = false) => {
    const isAuthorOrAdmin = comment.authorId === currentUser.id || currentUser.role === 'admin';
    const isEditing = editingCommentId === comment.id;
    
    // Formatted Time String
    const timeStr = comment.createdAt?.toDate 
      ? new Date(comment.createdAt.toDate()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) 
      : 'Just now';

    return (
      <div key={comment.id} className={`flex gap-3 group ${isReply ? 'ml-10 mt-3 relative' : ''}`}>
        
        {/* The Connector line for Replies */}
        {isReply && <div className="absolute -left-6 top-3 w-4 h-4 border-l-2 border-b-2 border-slate-200 rounded-bl-xl pointer-events-none"></div>}

        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0 shadow-sm ${comment.authorRole === 'admin' ? 'bg-blue-600' : 'bg-slate-800'}`}>
          {comment.authorName?.charAt(0) || 'S'}
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="bg-white border border-blue-200 shadow-sm rounded-2xl p-3 inline-block w-full max-w-sm">
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none focus:border-blue-500 resize-none mb-2" rows={2}/>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingCommentId(null)} className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg">Cancel</button>
                <button onClick={() => handleSaveEdit(comment.id)} className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm">Save</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 inline-block">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{comment.authorName}</span>
                  {comment.authorRole === 'admin' && <span className="bg-blue-100 text-blue-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm">Admin</span>}
                  
                  {/* NEW: Time and Date explicitly moved here next to the name! */}
                  <span className="text-[10px] text-slate-400 font-medium ml-1 flex items-center gap-1">
                    <span className="w-0.5 h-0.5 bg-slate-300 rounded-full inline-block"></span> 
                    {timeStr}
                  </span>
                </div>
                
                <p className="text-xs text-slate-700 leading-relaxed">
                  {comment.content}
                  {comment.isEdited && <span className="text-[9px] text-slate-400 font-medium ml-2">(Edited)</span>}
                </p>
              </div>

              {/* Action row strictly below the bubble */}
              <div className="flex items-center gap-3 mt-1 ml-2">
                <button 
                  onClick={() => { 
                    setReplyingTo({ id: isReply ? comment.replyToId : comment.id, name: comment.authorName }); 
                    document.getElementById(`comment-input-${postId}`)?.focus(); 
                  }} 
                  className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Reply
                </button>
                
                {isAuthorOrAdmin && (
                  <>
                    <button onClick={() => { setEditingCommentId(comment.id); setEditContent(comment.content); }} className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors">Edit</button>
                    <button onClick={() => handleDeleteComment(comment.id)} className="text-[10px] font-bold text-slate-500 hover:text-red-500 transition-colors">Delete</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-4 border-t border-slate-100 mt-2">
      
      {/* Existing Comments Area */}
      {comments.length > 0 && (
        <div className="space-y-4 mb-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
          {topLevelComments.map(comment => (
            <div key={comment.id} className="flex flex-col gap-1">
              {/* Parent Comment */}
              {renderCommentBubble(comment, false)}
              
              {/* Nested Replies */}
              {getReplies(comment.id).length > 0 && (
                <div className="space-y-1">
                  {getReplies(comment.id).map(reply => renderCommentBubble(reply, true))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Always Visible Input Area */}
      <div className="relative mt-2">
        {/* Reply Badge Indicator */}
        {replyingTo && (
           <div className="flex items-center justify-between bg-blue-50 text-blue-700 px-4 pt-2 pb-4 rounded-t-2xl text-xs font-bold -mb-3 relative z-0">
             <span>Replying to {replyingTo.name}</span>
             <button onClick={() => setReplyingTo(null)} className="hover:text-red-500 transition-colors">Cancel</button>
           </div>
        )}
        
        <div className="flex gap-3 items-center relative z-10 bg-white pt-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <input 
            id={`comment-input-${postId}`}
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            placeholder="Write a comment..." 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
          <button 
            onClick={handlePostComment}
            disabled={!newComment.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-5 rounded-full transition-colors shadow-md shadow-blue-600/20"
          >
            Post
          </button>
        </div>
      </div>

    </div>
  );
}