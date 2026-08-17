import Link from 'next/link';

export default function CommunitySection() {
  return (
    <section className="bg-slate-50 py-24 border-y border-slate-200">
      <div className="max-w-[1500px] mx-auto px-8 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Side: Pitch and CTA */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-sm tracking-wide">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            Vidhyora Exclusive
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Join a thriving, <span className="text-blue-600">invite-only</span> learning community.
          </h2>
          
          <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
            When you join a Vidhyora cohort, you aren't just buying a course. You are gaining lifetime access to a private network of ambitious learners, industry experts, and continuous live support.
          </p>

          <div className="pt-4">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
              Join the Community
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>

        {/* Right Side: The 4 Changelog Points Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* Point 1: Invite Only Community */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-600 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Invite-Only Access</h3>
            <p className="text-slate-600 font-medium text-sm">Gain exclusive entry to our private LMS community platform to network with peers and collaborate on projects.</p>
          </div>

          {/* Point 2: 52 Sundays & Lifetime Support */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-600 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">52 Sundays & Support</h3>
            <p className="text-slate-600 font-medium text-sm">Enjoy lifetime support and attend 52 weeks of free Sunday masterclasses to keep your skills completely up-to-date.</p>
          </div>

          {/* Point 3: Wall of Wins */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-600 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Wall of Wins</h3>
            <p className="text-slate-600 font-medium text-sm">Watch real-time live actions of student successes, course completions, and checkpoint exam victories across the platform.</p>
          </div>

          {/* Point 4: Live Classes + Recordings */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-600 hover:shadow-xl transition-all group">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Live Zoom & Recordings</h3>
            <p className="text-slate-600 font-medium text-sm">Attend highly interactive live classes, and get instant access to the recording vault if you ever miss a session.</p>
          </div>

        </div>
      </div>
    </section>
  );
}