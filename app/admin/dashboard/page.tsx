export default function OverviewStats() {
  return (
    <>
      <h2 className="text-2xl font-black text-slate-800 mb-6">Overview Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Students", value: "0" },
          { label: "Total Revenue", value: "₹0" },
          { label: "Active Courses", value: "0" },
          { label: "Pending Actions", value: "0" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            <span className="text-4xl font-black text-slate-300">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
         <span className="text-4xl mb-3">📭</span>
         <h3 className="text-lg font-bold text-slate-800">No Recent Activity</h3>
         <p className="text-sm text-slate-500 mt-1">Connect your database to begin tracking live platform events.</p>
      </div>
    </>
  );
}
