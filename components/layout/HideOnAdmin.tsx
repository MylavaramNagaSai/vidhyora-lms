"use client";
import { usePathname } from 'next/navigation';

export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Instantly hide the marketing Navbar/Footer if the user is in the Admin OR Student Portal
  const isHiddenRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/portal');

  if (isHiddenRoute) {
    return null; 
  }

  return <>{children}</>;
}