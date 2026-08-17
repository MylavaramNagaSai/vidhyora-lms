export default function NextLiveClass() {
  return (
    <div className="bg-slate-950 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-2xl rounded-full pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-lg font-bold text-white">Next Live Class</h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 mb-5 relative z-10 backdrop-blur-sm">
        <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Tonight</span>
        <h4 className="font-bold text-white leading-tight mb-4 text-[15px]">Live Q&A: LangChain & Vector Databases</h4>
        
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          08:00 PM IST
        </div>
      </div>

      <button className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-colors relative z-10 text-sm shadow-lg shadow-white/5">
        Join Zoom Room
      </button>
    </div>
  );
}