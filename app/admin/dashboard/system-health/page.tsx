export default function systemhealthPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
       <div className="flex items-center justify-between mb-8">
         <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Health</h2>
       </div>
       
       {/* Large, spacious empty state card */}
       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-24 flex flex-col items-center justify-center text-center">
         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-2 border-slate-100">
           <span className="text-5xl opacity-80">⚙️</span>
         </div>
         <h3 className="text-2xl font-black text-slate-900 mb-4">Module Unlinked</h3>
         <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
           The dashboard architecture for the <strong className="text-slate-800">System Health</strong> module is locked in. Connect your backend API to render the platform data here.
         </p>
       </div>
    </div>
  );
}
