export default function QuickActionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
        <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform origin-left">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <h4 className="font-bold text-slate-900 mb-1">Checkpoint Exams</h4>
        <p className="text-xs font-medium text-slate-500">2 pending assessments</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group">
        <div className="text-amber-500 mb-4 group-hover:scale-110 transition-transform origin-left">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h4 className="font-bold text-slate-900 mb-1">Resource Vault</h4>
        <p className="text-xs font-medium text-slate-500">Download slides & code</p>
      </div>
    </div>
  );
}