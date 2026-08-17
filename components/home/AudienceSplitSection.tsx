import Link from 'next/link';

export default function AudienceSplitSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      {/* For Individuals */}
      <div className="bg-slate-50 py-24 px-8 lg:px-24 flex flex-col justify-center items-start border-b lg:border-b-0 lg:border-r border-slate-200">
        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs uppercase mb-6">For Individuals</span>
        <h2 className="text-4xl font-black text-slate-900 mb-6">Accelerate Your Career.</h2>
        <p className="text-slate-600 font-medium text-lg mb-8 max-w-md">
          Upskill with live mentors, pass rigorous checkpoint exams, and earn certifications that top companies actually trust.
        </p>
        <Link href="/courses" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg">
          Browse Individual Courses
        </Link>
      </div>

      {/* For Business */}
      <div className="bg-slate-900 py-24 px-8 lg:px-24 flex flex-col justify-center items-start text-white">
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded-full text-xs uppercase mb-6">For Business</span>
        <h2 className="text-4xl font-black text-white mb-6">Train Your Entire Team.</h2>
        <p className="text-slate-300 font-medium text-lg mb-8 max-w-md">
          Request custom corporate training batches. Empower your workforce with private LMS access and live instruction.
        </p>
        <Link href="/corporate-training" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-all shadow-lg">
          Request Corporate Access
        </Link>
      </div>
    </section>
  );
}
