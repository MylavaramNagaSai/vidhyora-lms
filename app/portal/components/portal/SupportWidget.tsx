export default function SupportWidget() {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 text-center flex flex-col items-center justify-center mt-6">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </div>
      <h4 className="font-bold text-slate-900 mb-2">Need Technical Help?</h4>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">Our TA team is online right now in the community Discord.</p>
      
      <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-700 transition-colors flex items-center gap-1">
        Open Support Ticket <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  );
}