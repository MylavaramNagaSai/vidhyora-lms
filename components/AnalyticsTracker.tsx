"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const visitorIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isTracked = false;

    const initiateTracking = async () => {
      try {
        const res = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pathname })
        });
        const data = await res.json();
        
        if (data.visitorId) {
          visitorIdRef.current = data.visitorId;
          isTracked = true;
        }
      } catch (error) {
        console.error("Analytics initialization blocked.");
      }
    };

    initiateTracking();

    const handleUnload = () => {
      if (visitorIdRef.current) {
        // sendBeacon guarantees delivery even as the browser window dies
        const url = '/api/analytics/leave';
        const body = JSON.stringify({ visitorId: visitorIdRef.current });
        navigator.sendBeacon(url, body);
      }
    };

    // Attach to the browser's exit event
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      // Cleanup if the component unmounts (e.g., navigating away in a SPA router)
      if (isTracked) {
        handleUnload();
        visitorIdRef.current = null;
      }
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [pathname]);

  return null; // Silent component
}