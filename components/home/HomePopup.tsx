"use client";
import { useState, useEffect } from 'react';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function HomePopup() {
  const [activePopup, setActivePopup] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Immediately check session to prevent unnecessary render blocking
    const hasSeenPopup = sessionStorage.getItem('vidhyora_popup_dismissed');
    if (hasSeenPopup) return;

    const fetchPopups = async () => {
      try {
        const res = await fetch('/api/popups');
        const popups = await res.json();
        const now = new Date().getTime();

        const currentPopup = popups.find((popup: any) => {
          if (!popup.isActive) return false;
          const start = new Date(popup.startDate).getTime();
          const end = new Date(popup.endDate).getTime();
          return now >= start && now <= end;
        });

        if (currentPopup) {
          setActivePopup(currentPopup);
          
          // 2. Ultra-short delay allows the background website DOM to paint first, 
          // making the site feel lightning fast before the overlay kicks in.
          setTimeout(() => {
            setIsOpen(true);
          }, 150); 
        }
      } catch (error) {
        console.error("Failed to fetch popups:", error);
      }
    };

    fetchPopups();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('vidhyora_popup_dismissed', 'true');
  };

  if (!isOpen || !activePopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* 3. INCREASED SIZE: Upgraded to max-w-5xl for a massive, cinematic view */}
      <div className="relative max-w-5xl w-full flex justify-center bg-transparent rounded-2xl animate-in zoom-in-95 duration-300">
        
        {/* Close Button - Moved slightly inward to ensure it stays on screen on all devices */}
        <button 
          onClick={handleClose}
          className="absolute -top-12 right-0 md:-right-4 p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-colors z-50"
        >
          <CloseIcon />
        </button>

        {/* 4. IMAGE OPTIMIZATION: Added fetchpriority, max-h-[85vh], and object-contain */}
        {activePopup.linkUrl ? (
          <a href={activePopup.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center cursor-pointer group">
            <img 
              src={activePopup.imageUrl} 
              alt={activePopup.name} 
              fetchPriority="high"
              className="w-full max-h-[85vh] mx-auto rounded-2xl object-contain shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)] group-hover:opacity-95 transition-opacity" 
            />
          </a>
        ) : (
          <img 
            src={activePopup.imageUrl} 
            alt={activePopup.name} 
            fetchPriority="high"
            className="w-full max-h-[85vh] mx-auto rounded-2xl object-contain shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)]" 
          />
        )}

      </div>
    </div>
  );
}