"use client";
import React from 'react';
import { Post } from '../types';

const ClockIconSm = () => (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>);

interface ScheduledQueueProps {
  scheduledQueue: Post[];
  onDelete: (post: Post) => void;
  onEditRequest: (post: Post) => void; // <-- NEW: Passes the post up!
}

export default function ScheduledQueueWidget({ scheduledQueue, onDelete, onEditRequest }: ScheduledQueueProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Scheduled</h3>
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{scheduledQueue.length} Pending</span>
      </div>
      
      {scheduledQueue.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4 font-medium">No posts scheduled.</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {scheduledQueue.map((post) => (
            <div key={post.id} className="border border-slate-100 bg-slate-50 rounded-xl p-3 relative hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-900 text-xs truncate">{post.authorName}</span>
              </div>
              
              <p className="text-xs text-slate-600 mb-3 line-clamp-2">{post.content || 'Media Post Attached'}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-600 flex items-center">
                  <ClockIconSm />
                  {new Date(post.scheduledFor!).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => onEditRequest(post)} className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">Edit</button>
                  <button onClick={() => onDelete(post)} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}