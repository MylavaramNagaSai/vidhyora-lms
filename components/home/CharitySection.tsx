import Link from 'next/link';

export default function CharitySection() {
  return (
    <section className="bg-emerald-900 text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
      <div className="max-w-[1500px] mx-auto px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        
        <div className="flex-1 space-y-6">
          <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase px-3 py-1.5 rounded-full border border-emerald-500/30">
            Vidhyora Care Initiative
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Learning That Empowers. <br /><span className="text-emerald-400">Education That Gives Back.</span>
          </h2>
          <p className="text-emerald-100 font-medium text-base leading-relaxed max-w-xl">
            10% of every course enrollment directly funds technology education, laptops, and internet access for underprivileged students across rural regions. Join us in making tech literacy accessible to all.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/charity" className="px-7 py-3.5 bg-emerald-500 text-slate-950 font-black rounded-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-950/50">
              Donate / Support Cause
            </Link>
            <Link href="/charity" className="px-7 py-3.5 bg-emerald-950/80 border border-emerald-700 text-emerald-200 font-bold rounded-lg hover:bg-emerald-900 transition-all">
              View Transparency Report
            </Link>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="bg-emerald-950/60 border border-emerald-800 p-6 rounded-2xl text-center">
            <p className="text-4xl font-black text-emerald-400">5,000+</p>
            <p className="text-xs text-emerald-200 font-bold mt-2 uppercase tracking-wider">Free Scholarships Provided</p>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800 p-6 rounded-2xl text-center">
            <p className="text-4xl font-black text-emerald-400">100%</p>
            <p className="text-xs text-emerald-200 font-bold mt-2 uppercase tracking-wider">Transparent Funding</p>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800 p-6 rounded-2xl text-center">
            <p className="text-4xl font-black text-emerald-400">52/yr</p>
            <p className="text-xs text-emerald-200 font-bold mt-2 uppercase tracking-wider">Free Sunday Classes</p>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800 p-6 rounded-2xl text-center">
            <p className="text-4xl font-black text-emerald-400">50+</p>
            <p className="text-xs text-emerald-200 font-bold mt-2 uppercase tracking-wider">Partner Schools</p>
          </div>
        </div>

      </div>
    </section>
  );
}
