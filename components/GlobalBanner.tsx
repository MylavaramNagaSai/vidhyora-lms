"use client";
import { useState, useEffect } from 'react';

export default function GlobalBanner() {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        // Only get active banners
        const activeBanners = data.filter((b: any) => b.isActive);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Failed to fetch global banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // If there are no active banners, collapse the component entirely so it takes up zero space.
  if (banners.length === 0) return null;

  // We duplicate the array 10 times. This guarantees that even on ultra-wide 
  // 4k monitors, there is enough content to scroll seamlessly.
  const scrollingArray = Array(10).fill(banners).flat();

  return (
    <>
      <style>
        {`
          @keyframes marquee-scroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); } 
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            /* Adjust the 40s to make it slower or faster */
            animation: marquee-scroll 40s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      
      <div className="w-full bg-[#1e40af] text-white overflow-hidden flex items-center h-10 border-b border-[#1e3a8a]">
        <div className="animate-marquee cursor-pointer">
          {scrollingArray.map((banner, index) => (
            <div key={index} className="flex items-center shrink-0 px-8">
              <span className="text-[13px] font-bold tracking-wide whitespace-nowrap">
                {banner.text}
              </span>
              {/* Star Separator */}
              <span className="mx-8 text-[#60a5fa] text-xs">★</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}