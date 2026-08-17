import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-8 border-t-4 border-blue-600">
      <div className="max-w-[1500px] mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Column 1: Branding & Socials */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight inline-block cursor-pointer">
            Vidhyora
          </h2>
          <p className="text-gray-400 font-medium text-[15px] leading-relaxed">
            Master your skills in AI and Technology through exclusive, live interactive Zoom cohorts.
          </p>
          
          {/* Social Logos Just Below Brand Text */}
          <div className="flex gap-5 pt-2">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500 transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors" aria-label="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.031 2.016A9.97 9.97 0 002.04 12c0 1.63.398 3.228 1.156 4.672l-1.572 5.753 5.877-1.541a9.96 9.96 0 004.53 1.082h.005c5.503 0 9.975-4.473 9.975-9.976a9.97 9.97 0 00-2.92-7.054 9.97 9.97 0 00-7.06-2.92zm0 1.677c4.58 0 8.3 3.722 8.3 8.307a8.303 8.303 0 01-8.3 8.307 8.28 8.28 0 01-4.218-1.152l-.302-.178-3.136.822.836-3.056-.195-.31A8.28 8.28 0 013.716 12c0-4.585 3.72-8.307 8.315-8.307zm4.72 11.233c-.258-.13-1.528-.754-1.764-.842-.236-.086-.41-.13-.58.13-.173.258-.668.841-.818 1.014-.15.172-.3.193-.56.064-1.393-.687-2.457-1.464-3.415-3.097-.098-.168.082-.149.336-.653.086-.172.043-.323-.021-.452-.064-.13-.58-1.398-.795-1.914-.208-.5-.42-.43-.58-.438l-.495-.008c-.172 0-.452.064-.688.323-.236.258-.903.882-.903 2.152 0 1.27.925 2.497 1.054 2.67.13.172 1.821 2.778 4.412 3.873.618.261 1.1.416 1.478.532.618.197 1.182.169 1.626.103.5-.075 1.528-.624 1.743-1.227.215-.603.215-1.119.15-1.228-.064-.107-.236-.172-.494-.301z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition-colors" aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M21.582 6.186a2.64 2.64 0 00-1.854-1.874C18.093 3.87 12 3.87 12 3.87s-6.093 0-7.728.442A2.64 2.64 0 002.418 6.186C1.984 7.842 1.984 12 1.984 12s0 4.158.434 5.814a2.64 2.64 0 001.854 1.874c1.635.442 7.728.442 7.728.442s6.093 0 7.728-.442a2.64 2.64 0 001.854-1.874c.434-1.656.434-5.814.434-5.814s0-4.158-.434-5.814zM9.98 15.116V8.884l5.96 3.116-5.96 3.116z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Popular Cohorts */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white tracking-wide">Live Cohorts</h3>
          <ul className="space-y-4 text-gray-400 text-[15px] font-medium">
            <li><Link href="/mastery-in-ai" className="block hover:text-blue-500 transition-colors">Mastery in AI</Link></li>
            <li><Link href="/gen-ai" className="block hover:text-blue-500 transition-colors">Generative AI Bootcamps</Link></li>
            <li><Link href="/soft-skills" className="block hover:text-blue-500 transition-colors">Soft Skills & Leadership</Link></li>
            <li><Link href="/train-the-trainer" className="block hover:text-blue-500 transition-colors">Train the Trainer</Link></li>
          </ul>
        </div>

        {/* Column 3: Student Hub */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white tracking-wide">Student Hub</h3>
          <ul className="space-y-4 text-gray-400 text-[15px] font-medium">
            <li><Link href="/dashboard" className="block hover:text-blue-500 transition-colors">My Learning Dashboard</Link></li>
            <li><Link href="/verify-certificate" className="block hover:text-blue-500 transition-colors">Verify Certificate</Link></li>
            <li><Link href="/zoom-setup" className="block hover:text-blue-500 transition-colors">Zoom Setup Guide</Link></li>
            <li><Link href="/faq" className="block hover:text-blue-500 transition-colors">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        {/* Column 4: Vidhyora For Business */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white tracking-wide">For Business</h3>
          <ul className="space-y-4 text-gray-400 text-[15px] font-medium">
            <li><Link href="/corporate-training" className="block hover:text-blue-500 transition-colors">Corporate Training</Link></li>
            <li><Link href="/hire-graduates" className="block hover:text-blue-500 transition-colors">Hire Our Graduates</Link></li>
            <li><Link href="/become-instructor" className="block hover:text-blue-500 transition-colors">Become an Instructor</Link></li>
            <li><Link href="/partners" className="block hover:text-blue-500 transition-colors">Partner Program</Link></li>
          </ul>
        </div>

        {/* Column 5: System Portals (Unified Blue Buttons) */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white tracking-wide">System Access</h3>
          <div className="flex flex-col space-y-3">
            
            <Link href="/login" className="flex items-center gap-3 px-4 py-3 bg-blue-900 text-blue-100 font-bold rounded-lg border border-blue-800 hover:bg-blue-700 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              LMS Login
            </Link>
            
            <Link href="/admin/login" className="flex items-center gap-3 px-4 py-3 bg-blue-900 text-blue-100 font-bold rounded-lg border border-blue-800 hover:bg-blue-700 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Admin Login
            </Link>
            
            <Link href="/developer/login" className="flex items-center gap-3 px-4 py-3 bg-blue-900 text-blue-100 font-bold rounded-lg border border-blue-800 hover:bg-blue-700 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              Developer Login
            </Link>

          </div>
        </div>

      </div>
      
      {/* TIGHTENED BOTTOM BAR */}
      <div className="max-w-[1500px] mx-auto px-8 mt-16 pt-6 border-t border-gray-800">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 text-gray-500 text-[14px]">
          
          {/* Left: Copyright */}
          <div className="flex-1 text-center lg:text-left">
            <p>© 2026 Vidhyora. All rights reserved.</p>
          </div>
          
          {/* Middle: Developer Credit */}
          <div className="flex-1 text-center">
            <p className="font-medium cursor-default">
              Designed and developed by <span className="text-white font-bold tracking-wider hover:text-blue-500 transition-colors cursor-pointer">Mylavaram Naga Sai</span>
            </p>
          </div>

          {/* Right: Legal Links Only */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="flex gap-6 font-medium">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}