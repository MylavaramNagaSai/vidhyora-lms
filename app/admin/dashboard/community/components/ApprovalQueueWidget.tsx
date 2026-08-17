"use client";
import React from 'react';
import { Post } from '../types';

interface ApprovalQueueProps {
  pendingQueue: Post[];
  onApprove: (id: string) => void;
  onReject: (post: Post) => void;
}

export default function ApprovalQueueWidget({ pendingQueue, onApprove, onReject }: ApprovalQueueProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Approval Queue</h3>
        <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendingQueue.length} Needs Review</span>
      </div>
      
      {pendingQueue.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4 font-medium">All caught up! No pending posts.</p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {pendingQueue.map((post) => (
            <div key={post.id} className="border border-slate-100 bg-slate-50 rounded-xl p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-900 text-xs truncate mr-2">{post.authorName}</span>
                <span className="text-[10px] text-amber-500 font-bold shrink-0">Review</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 line-clamp-3">{post.content}</p>
              <div className="flex gap-2">
                <button onClick={() => onApprove(post.id)} className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold py-1.5 rounded-lg transition-colors">Approve</button>
                <button onClick={() => onReject(post)} className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold py-1.5 rounded-lg transition-colors">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}