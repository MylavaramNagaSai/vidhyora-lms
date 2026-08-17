import Link from 'next/link';
import GlobalBanner from '@/components/GlobalBanner';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex flex-col shadow-md">
      
      {/* 1. MAIN NAVBAR */}
      <nav className="bg-white py-5 border-b border-slate-200 relative z-20">
        <div className="w-full px-4 xl:px-8 flex justify-between items-center max-w-[1800px] mx-auto gap-4">
          
          {/* BRAND LOGO */}
          <div className="flex-none">
            <Link href="/" className="text-3xl font-black text-blue-600 tracking-tight">Vidhyora</Link>
          </div>
          
          {/* NAVIGATION LINKS & SEARCH BAR */}
          <div className="flex-1 flex justify-center items-center gap-4 xl:gap-8">
            
            {/* Nav Links with Icons & Polished Text */}
            <div className="hidden lg:flex items-center gap-5">
              
              <Link href="/" className="group flex items-center gap-1.5 text-[13px] xl:text-[14px] text-slate-600 font-bold hover:text-blue-600 transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home
              </Link>

              <Link href="/mastery-in-ai" className="group flex items-center gap-1.5 text-[13px] xl:text-[14px] text-slate-600 font-bold hover:text-blue-600 transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                AI Mastery
              </Link>

              <Link href="/gen-ai" className="group flex items-center gap-1.5 text-[13px] xl:text-[14px] text-slate-600 font-bold hover:text-blue-600 transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                Generative AI
              </Link>

              <Link href="/rag-ai" className="group flex items-center gap-1.5 text-[13px] xl:text-[14px] text-slate-600 font-bold hover:text-blue-600 transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                Applied RAG
              </Link>

              <Link href="/soft-skills" className="group flex items-center gap-1.5 text-[13px] xl:text-[14px] text-slate-600 font-bold hover:text-blue-600 transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Soft Skills
              </Link>

              <Link href="/train-the-trainer" className="group flex items-center gap-1.5 text-[13px] xl:text-[14px] text-slate-600 font-bold hover:text-blue-600 transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                Train the Trainer
              </Link>

              <Link href="/charity" className="group flex items-center gap-1.5 text-[13px] xl:text-[14px] text-slate-600 font-bold hover:text-blue-600 transition-colors whitespace-nowrap">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Social Impact
              </Link>
              
            </div>

            {/* Universal Search Bar */}
            <div className="relative w-full max-w-[220px] hidden xl:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-full text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white" 
                placeholder="Search courses..." 
              />
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex-none flex items-center gap-3">
            
            <Link href="/login" className="px-5 py-2.5 rounded-lg font-bold text-[14px] text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-sm border border-transparent whitespace-nowrap flex items-center gap-2">
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              LMS Login
            </Link>
            
            <Link href="/signup" className="px-5 py-2.5 rounded-lg font-bold text-[14px] text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm border border-transparent whitespace-nowrap">
              Join for free
            </Link>

            <Link href="/verify-certificate" className="px-5 py-2.5 rounded-lg font-bold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm border border-transparent whitespace-nowrap flex items-center gap-2">
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Verify Certificate
            </Link>

          </div>
        </div>
      </nav>

      {/* 2. DYNAMIC INFINITE SCROLLING BANNER (Database Driven) */}
      <GlobalBanner />
      
    </header>
  );
}