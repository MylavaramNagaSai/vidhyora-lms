import React from 'react';

export default function WallOfWins() {
  const wins = [
    { student: "Rahul M.", action: "passed Gen AI Checkpoint Exam", time: "2 mins ago", icon: "🏆", badge: "Score 96%" },
    { student: "Priya S.", action: "enrolled in Aug 15 AI Cohort", time: "5 mins ago", icon: "🚀", badge: "Batch #12" },
    { student: "Anish K.", action: "verified Certificate #V-89412", time: "12 mins ago", icon: "✅", badge: "Verified" },
    { student: "Sneha P.", action: "completed 30-Day Soft Skills Track", time: "18 mins ago", icon: "🎓", badge: "Graduated" },
    { student: "Vikram R.", action: "unlocked Lifetime Sunday Masterclass", time: "25 mins ago", icon: "⭐", badge: "VIP Member" },
  ];

  return (
    <section className="bg-slate-900 py-12 border-y border-slate-800 text-white overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-8 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h2 className="text-xl font-black text-white tracking-wide uppercase">Wall of Wins • Live Platform Activity</h2>
        </div>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:block">Updated Real-Time</span>
      </div>

      {/* Ticker Container */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 px-8">
        {wins.map((win, idx) => (
          <div key={idx} className="flex-none bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center gap-4 min-w-[320px] shadow-lg hover:border-blue-500 transition-colors">
            <span className="text-2xl bg-slate-900 p-2 rounded-lg">{win.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2 mb-1">
                <p className="text-sm font-bold text-white truncate">{win.student}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-300 border border-blue-700/50">{win.badge}</span>
              </div>
              <p className="text-xs text-slate-300 truncate">{win.action}</p>
              <p className="text-[10px] text-slate-500 mt-1">{win.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
