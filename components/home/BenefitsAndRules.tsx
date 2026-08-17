export default function BenefitsAndRules() {
  return (
    <section className="py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-[1500px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* How Can We Benefit */}
        <div className="space-y-8">
          <div>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Why Choose Vidhyora</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">How You Benefit By Joining</h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="text-lg font-bold text-white">Flexible Syllabus Duration (21 / 30 / 60 Days)</h3>
                <p className="text-slate-400 text-sm mt-1">Choose between short 21-day sprints, 30-day deep dives, or 60-day placement-guaranteed bootcamps.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="text-lg font-bold text-white">52 Sundays Free Masterclasses</h3>
                <p className="text-slate-400 text-sm mt-1">Never stop learning. Get 1 full year of continuous live Sunday upgrade sessions included free.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500 text-purple-400 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="text-lg font-bold text-white">Automated Certificate & Placement Track</h3>
                <p className="text-slate-400 text-sm mt-1">Pass checkpoint exams inside the LMS to automatically generate verifiable certificates and unlock corporate hiring pools.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Piracy & Platform Trust Rules */}
        <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/20 text-red-400 font-bold text-xs uppercase mb-4 border border-red-500/30">
              🛡️ Platform Security & Content Trust
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Strict Content Protection Rules</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              To safeguard instructor intellectual property and protect our premium learning community, Vidhyora enforces active security measures across all LMS accounts:
            </p>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✓</span> Encrypted Watermarked Video Streams
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✓</span> Zero Account Sharing Policy (Single Device Concurrent Lock)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✓</span> Direct Checkpoint Exam Authentication
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 font-bold">✓</span> Instant Ban for Attempted Screen Recording
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-400">
            <span className="text-white font-bold">Notice:</span> By creating an account, you agree to our strict content protection guidelines and invite-only community terms.
          </div>
        </div>

      </div>
    </section>
  );
}
