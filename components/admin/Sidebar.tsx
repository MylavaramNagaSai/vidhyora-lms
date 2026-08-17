"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // 1. All of your menu items (excluding the Overview Panel)
  const navLinks = [
    { name: 'Community', href: '/admin/dashboard/community' }, // <-- NEW: Added Community Hub
    { name: 'LMS Media', href: '/admin/dashboard/lms-media' },
    { name: 'Live Classes', href: '/admin/dashboard/live-classes' },
    { name: 'Course Manager', href: '/admin/dashboard/courses' },
    { name: 'LMS Management', href: '/admin/dashboard/lms' },
    { name: 'Upcoming Sessions', href: '/admin/dashboard/cohorts' },
    { name: 'Certifications', href: '/admin/dashboard/certificates' },
    { name: 'Helpdesk & Tickets', href: '/admin/dashboard/helpdesk' },
    { name: 'Corporate B2B', href: '/admin/dashboard/b2b-leads' },
    { name: 'Email Campaigns', href: '/admin/dashboard/emails' },
    { name: 'Charity Tracker', href: '/admin/dashboard/charity' },
    { name: 'Popups', href: '/admin/dashboard/popups' },
    { name: 'Banners', href: '/admin/dashboard/banners' },
    { name: 'Testimonials', href: '/admin/dashboard/testimonials' },
    { name: 'Skills Section', href: '/admin/dashboard/skills' },
  ];

  // 2. Automatically sort the array: Shortest letter count first, then alphabetical
  const sortedLinks = navLinks.sort((a, b) => {
    if (a.name.length === b.name.length) {
      return a.name.localeCompare(b.name); // Alphabetical fallback for ties
    }
    return a.name.length - b.name.length; // Shortest to longest
  });

  // 3. Assemble the final menu with Overview Panel locked at index 0
  const finalLinks = [
    { name: 'Overview Panel', href: '/admin/dashboard' },
    ...sortedLinks
  ];

  return (
    <aside className="w-72 bg-white text-slate-800 flex-col hidden lg:flex fixed h-full z-20 border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* Sleek Header - Centered */}
      <div className="p-7 border-b border-slate-100 flex justify-center bg-white">
        <Link href="/admin/dashboard" className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <span className="text-center">Admin Panel</span>
        </Link>
      </div>
      
      {/* Navigation Links - Flat List (Auto-sorted shortest to longest) */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar bg-slate-50/50">
        {finalLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`flex items-center justify-start px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 translate-x-1' 
                  : 'text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm hover:translate-x-1'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      
      {/* Footer Profile - Bright and Clean */}
      <div className="p-4 border-t border-slate-200 bg-white flex justify-center shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 w-full hover:border-blue-200 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            A
          </div>
          <div className="text-left flex-1">
            <p className="text-[14px] font-black text-slate-900 leading-none mb-1">Vidhyora Admin</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Level</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-600"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </div>
      </div>

    </aside>
  );
}