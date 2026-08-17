import Link from 'next/link';

export default function AboutUsSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-[1500px] mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-6">
          <span className="text-blue-600 font-black text-sm uppercase tracking-widest">About Vidhyora</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Democratizing Elite Tech & Leadership Education.
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Vidhyora was founded with a single mission: to bridge the gap between academic theory and industry reality. We noticed that traditional recorded courses lacked accountability, while standard bootcamps were too expensive.
          </p>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            By combining live Zoom cohorts, rigorous checkpoint exams, and a thriving invite-only community, we ensure that every student who joins Vidhyora graduates with the exact skills top companies are looking for.
          </p>
          <div className="pt-4">
            <Link href="/about" className="inline-block px-8 py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg">
              Read Our Full Story
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-12">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 h-48 flex flex-col justify-end">
              <h3 className="text-4xl font-black text-blue-600">100%</h3>
              <p className="font-bold text-slate-700">Live & Interactive</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-48 flex flex-col justify-end">
              <h3 className="text-4xl font-black text-slate-900">24/7</h3>
              <p className="font-bold text-slate-700">Community Access</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 h-48 flex flex-col justify-end">
              <h3 className="text-4xl font-black text-emerald-600">52</h3>
              <p className="font-bold text-slate-700">Free Sunday Classes</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 h-48 flex flex-col justify-end">
              <h3 className="text-4xl font-black text-purple-600">Top 1%</h3>
              <p className="font-bold text-slate-700">Industry Instructors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
