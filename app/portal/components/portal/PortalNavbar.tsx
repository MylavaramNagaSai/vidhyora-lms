import Link from 'next/link';

export default function PortalNavbar() {
  
  // We define the style once here. Now all 3 buttons will look identical!
  // bg-blue-600 is the default color, hover:bg-indigo-500 changes it when you hover!
  const navButtonClass = "h-10 px-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-all duration-300 shadow-sm group";

  return (
    <nav className="bg-[#0b1120] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800/50">
      {/* Left Side: Brand and Portal Name */}
      <div className="flex items-center gap-3">
        <Link href="/portal" className="text-xl font-bold text-blue-500 tracking-tight">Vidhyora</Link>
        <span className="text-slate-600">|</span>
        <span className="text-sm font-semibold text-slate-200">LMS Portal</span>
      </div>
      
      {/* Right Side: Action Buttons and Profile */}
      <div className="flex items-center gap-3">
        
        {/* Button 1: Community Hub */}
        <Link href="/portal/community" className={navButtonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Community Hub
        </Link>

        {/* Button 2: View Certificates */}
        <Link href="/portal/certificates" className={navButtonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          View Certificates
        </Link>
        
        {/* Button 3: Raise Issue */}
        <Link href="/portal/support" className={navButtonClass}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Raise Issue
        </Link>

        {/* Subtle Divider */}
        <div className="w-px h-6 bg-slate-700 mx-1"></div>

        {/* Profile Avatar */}
        <div className="h-10 w-10 rounded-full bg-blue-900/50 border border-blue-500 text-blue-400 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-blue-800 transition-colors shrink-0">
          M
        </div>
        
      </div>
    </nav>
  );
}