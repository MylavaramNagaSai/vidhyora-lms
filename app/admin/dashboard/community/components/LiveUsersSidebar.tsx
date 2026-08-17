"use client";
import React from 'react';

export default function LiveUsersSidebar() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Live Members</h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      <div className="text-center py-8">
        <p className="text-xs font-medium text-slate-400">No active students found.</p>
      </div>
    </div>
  );
}