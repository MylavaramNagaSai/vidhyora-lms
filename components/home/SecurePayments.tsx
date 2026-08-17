export default function SecurePayments() {
  return (
    <section className="py-16 bg-slate-950 text-white border-b-4 border-blue-600">
      <div className="max-w-[1500px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-black text-white">Secure Checkout & Hybrid Pricing</h2>
          <p className="text-slate-400 font-medium max-w-lg">
            Choose between Live Interactive Cohorts or Recorded Access. All payments are securely processed with military-grade encryption.
          </p>
        </div>

        <div className="flex-none flex items-center justify-center gap-8 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <div className="px-6 py-3 bg-white rounded-lg font-black text-[#0B1221] text-xl tracking-tighter">
              <span className="text-[#3395FF]">Razor</span>pay
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">100% Secure Gateway</span>
          </div>
          
          <div className="hidden md:block w-px h-12 bg-slate-800"></div>

          <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 rounded-lg border border-slate-700">
               <span className="text-2xl">🎟️</span>
               <span className="font-bold text-white">Coupons Accepted</span>
             </div>
             <span className="text-xs font-bold text-slate-500 uppercase">Apply at Checkout</span>
          </div>
        </div>

      </div>
    </section>
  );
}
