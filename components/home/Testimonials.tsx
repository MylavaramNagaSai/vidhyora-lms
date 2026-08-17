"use client";
import { useState, useEffect, useRef } from 'react';

// Reusable Star Rating Component
const StarRating = ({ rating, theme = 'light' }: { rating: number, theme?: 'light' | 'dark' }) => {
  const activeColor = theme === 'dark' ? 'text-amber-400' : 'text-amber-500';
  const inactiveColor = theme === 'dark' ? 'text-white/20' : 'text-slate-200';
  
  return (
    <div className="flex mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= rating ? activeColor : inactiveColor}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ))}
    </div>
  );
};

// --- Custom Hover-to-Unmute Video Card (Split Layout) ---
const HoverVideoCard = ({ item }: { item: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  };

  return (
    <div 
      className="relative group w-full rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-transform duration-500 hover:-translate-y-2 flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. TOP HALF: VIDEO SECTION (Fixed height, no overlays blocking the video) */}
      <div className="relative w-full h-[400px] bg-black overflow-hidden flex justify-center items-center">
        
        {/* Ambient Glass Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video 
            src={item.content} 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter blur-[30px] opacity-40 scale-125" 
          />
        </div>

        {/* Foreground Full Uncropped Video */}
        <video 
          ref={videoRef}
          src={item.content} 
          autoPlay
          loop
          muted
          playsInline
          className="relative z-10 w-full h-full object-contain" 
        />
        
        {/* Volume Indicator Icon */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2.5 rounded-full opacity-100 group-hover:opacity-0 transition-opacity pointer-events-none border border-white/10 z-30">
          <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </div>
        <div className="absolute top-4 right-4 bg-blue-600 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg shadow-blue-900/50 z-30">
          <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 010 7.072M19.07 4.93a10 10 0 010 14.142"/></svg>
        </div>
      </div>

      {/* 2. BOTTOM HALF: TEXT & DETAILS SECTION */}
      <div className="p-6 bg-slate-900 flex flex-col justify-center border-t border-slate-800/50 z-20">
        <StarRating rating={item.rating} theme="dark" />
        
        <div className="flex items-center gap-4 mt-1">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 shadow-sm shrink-0 bg-slate-800">
            <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-black text-white text-base leading-tight">{item.name}</h4>
            <p className="text-xs font-bold text-blue-400 mt-0.5">{item.designation}</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};


export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const videoTestimonials = testimonials.filter(t => t.type === 'video');
  const audioTestimonials = testimonials.filter(t => t.type === 'audio');
  const textTestimonials = testimonials.filter(t => t.type === 'text');

  if (isLoading) {
    return (
      <section className="bg-slate-50 py-32 flex justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <div className="flex flex-col">
      
      {/* =========================================
          ROW 1: VIDEO TESTIMONIALS (Cinematic Dark)
          ========================================= */}
      {videoTestimonials.length > 0 && (
        <section className="bg-slate-950 py-32 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-[1600px] mx-auto px-6 xl:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] bg-blue-500/10 border border-blue-500/20 px-5 py-2 rounded-full inline-block mb-4">
                Watch
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                View what our learners are saying
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoTestimonials.map((item) => (
                <HoverVideoCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* =========================================
          ROW 2: AUDIO TESTIMONIALS (Warm & Wide)
          ========================================= */}
      {audioTestimonials.length > 0 && (
        <section className="bg-orange-50/50 py-24 border-b border-orange-100">
          <div className="max-w-[1200px] mx-auto px-6 xl:px-8">
            <div className="text-center mb-16">
              <span className="text-orange-600 font-black text-xs uppercase tracking-[0.2em] bg-orange-100 border border-orange-200 px-5 py-2 rounded-full inline-block mb-4">
                Listen
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Hear their success stories
              </h2>
            </div>
            
            <div className="flex flex-col gap-6">
              {audioTestimonials.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-900/5 flex flex-col md:flex-row items-center gap-8 transition-transform hover:-translate-y-1">
                  
                  <div className="flex items-center gap-5 shrink-0 md:w-1/3">
                    <img src={item.avatarUrl} alt={item.name} className="h-20 w-20 rounded-full object-cover border-4 border-orange-50 shadow-sm" />
                    <div>
                      <h4 className="font-black text-slate-900 text-xl">{item.name}</h4>
                      <p className="text-xs font-bold text-slate-500 mb-2">{item.designation}</p>
                      <StarRating rating={item.rating} />
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    <audio controls src={item.content} className="w-full h-14" />
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* =========================================
          ROW 3: TEXT TESTIMONIALS (Expansive & Plush)
          ========================================= */}
      {textTestimonials.length > 0 && (
        <section className="bg-slate-50 py-32">
          <div className="max-w-[1600px] mx-auto px-6 xl:px-8">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] bg-emerald-100 border border-emerald-200 px-5 py-2 rounded-full inline-block mb-4">
                Read
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Read what our learners are saying
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {textTestimonials.map((item) => (
                <div key={item.id} className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col relative group hover:-translate-y-2 transition-transform duration-500">
                  
                  <div className="absolute top-6 right-8 text-[8rem] text-slate-50 font-serif leading-none pointer-events-none group-hover:text-emerald-50 transition-colors">
                    "
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <StarRating rating={item.rating} />
                    
                    <div className="flex-1 my-6">
                      <p className="text-slate-700 font-medium text-xl leading-relaxed">
                        "{item.content}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
                      <img src={item.avatarUrl} alt={item.name} className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md bg-slate-100" />
                      <div>
                        <h4 className="font-black text-slate-900 text-base leading-tight">{item.name}</h4>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">{item.designation}</p>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}