import PortalNavbar from './components/portal/PortalNavbar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Your dedicated LMS Navbar injected globally for the portal */}
      <PortalNavbar />
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}