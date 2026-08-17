"use client";
import { useState, useEffect, useCallback } from 'react';

// --- Premium SVG Icons ---
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const RupeeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <path d="M6 3h12"></path>
    <path d="M6 8h12"></path>
    <path d="M6 13h8.5a4.5 4.5 0 0 0 0-9"></path>
    <path d="M11 16l-5-3"></path>
    <path d="M6 13h3l7.5 8"></path>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

interface LightboxState {
  media: any[];
  currentIndex: number;
}

export default function PublicCharityPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lightbox State
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    const fetchPublishedEvents = async () => {
      try {
        const res = await fetch('/api/charity');
        const data = await res.json();
        const publishedOnly = data.filter((event: any) => event.status === 'Published');
        setEvents(publishedOnly);
      } catch (error) {
        console.error("Failed to fetch public charity data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublishedEvents();
  }, []);

  // --- Lightbox Handlers ---
  const openLightbox = (mediaArray: any[], startIndex: number) => {
    setLightbox({ media: mediaArray, currentIndex: startIndex });
  };

  const closeLightbox = () => setLightbox(null);

  const nextMedia = useCallback(() => {
    if (!lightbox) return;
    setLightbox(prev => {
      if (!prev) return prev;
      const nextIndex = (prev.currentIndex + 1) % prev.media.length;
      return { ...prev, currentIndex: nextIndex };
    });
  }, [lightbox]);

  const prevMedia = useCallback(() => {
    if (!lightbox) return;
    setLightbox(prev => {
      if (!prev) return prev;
      const prevIndex = prev.currentIndex === 0 ? prev.media.length - 1 : prev.currentIndex - 1;
      return { ...prev, currentIndex: prevIndex };
    });
  }, [lightbox]);

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, nextMedia, prevMedia]);

  const totalImpactSpent = events.reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-rose-500/20">
      
      {/* --- HERO SECTION (Light Premium Theme) --- */}
      <div className="relative bg-white text-slate-900 pt-32 pb-24 overflow-hidden border-b border-slate-200">
        {/* Subtle architectural grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Soft glowing ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-400/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-bold text-sm mb-6 shadow-sm">
            <HeartIcon /> Vidhyora Social Impact
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight text-slate-900">
            Education. Empowerment. <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Real Impact.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Our commitment goes beyond code and curriculum. Explore the stories of how the Vidhyora community is driving real-world change and uplifting communities globally.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 transition-transform hover:-translate-y-1">
              <div className="text-4xl font-black text-slate-900 mb-1">{events.length}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Missions Completed</div>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 transition-transform hover:-translate-y-1">
              <div className="text-4xl font-black text-emerald-600 mb-1 flex items-center justify-center">
                <span className="text-2xl mr-1 font-bold text-emerald-400">₹</span>{totalImpactSpent.toLocaleString('en-IN')}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Fund Deployed</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- IMPACT STORIES --- */}
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-32">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <HeartIcon />
            <h3 className="text-2xl font-black text-slate-900 mt-4 mb-2">Our Journey is Just Beginning</h3>
            <p className="text-slate-500 font-medium">Impact stories will appear here as we execute our missions.</p>
          </div>
        ) : (
          events.map((event, index) => {
            // Reorder media: Images first, Videos last
            const images = event.media?.filter((m: any) => m.type === 'image') || [];
            const videos = event.media?.filter((m: any) => m.type === 'video') || [];
            const sortedMedia = [...images, ...videos];

            return (
              <article key={event.id} className="relative group">
                
                {/* Timeline Connector Line */}
                {index !== events.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[100%] h-32 w-px bg-gradient-to-b from-slate-200 to-transparent"></div>
                )}

                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-4 mb-5">
                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                      <CalendarIcon /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-4 py-2 rounded-full border border-rose-200 shadow-sm">
                      <TagIcon /> {event.category}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">{event.title}</h2>
                  
                  <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-4xl mx-auto whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {/* --- MEDIA GRID (No Scrolling, Images First, Videos Last) --- */}
                {sortedMedia.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {sortedMedia.map((m: any, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => openLightbox(sortedMedia, idx)}
                        className="group/media relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-sm transition-all hover:shadow-xl hover:ring-2 hover:ring-rose-400 hover:ring-offset-4 hover:ring-offset-slate-50"
                      >
                        {m.type === 'video' ? (
                          <>
                            <video src={m.url} className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105" />
                            {/* Video Play Overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity group-hover/media:bg-black/40">
                              <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white text-slate-900 shadow-xl transition-transform group-hover/media:scale-110">
                                <PlayIcon />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img 
                            src={m.url} 
                            alt={`Impact visual ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105" 
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Impact Investment Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6 border-t border-b border-slate-200 bg-white shadow-sm rounded-3xl">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Financial Impact Deployed:</span>
                  <span className="flex items-center text-xl font-black text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 shadow-sm">
                    <RupeeIcon /> {Number(event.amountSpent).toLocaleString('en-IN')}
                  </span>
                </div>

              </article>
            );
          })
        )}
      </div>

      {/* --- FULLSCREEN LIGHTBOX MODAL --- */}
      {/* Kept dark specifically for media viewing clarity (industry standard) */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center">
          
          {/* Controls */}
          <button onClick={closeLightbox} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors z-50">
            <CloseIcon />
          </button>
          
          {lightbox.media.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevMedia(); }} className="absolute left-4 md:left-10 p-3 bg-black/40 hover:bg-black/80 border border-white/10 backdrop-blur-md rounded-full transition-all hover:scale-110 z-50">
                <ChevronLeftIcon />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextMedia(); }} className="absolute right-4 md:right-10 p-3 bg-black/40 hover:bg-black/80 border border-white/10 backdrop-blur-md rounded-full transition-all hover:scale-110 z-50">
                <ChevronRightIcon />
              </button>
            </>
          )}

          {/* Media Content */}
          <div className="relative w-full max-w-6xl max-h-[85vh] px-4 md:px-24 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {lightbox.media[lightbox.currentIndex].type === 'video' ? (
              <video 
                src={lightbox.media[lightbox.currentIndex].url} 
                controls 
                autoPlay
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              <img 
                src={lightbox.media[lightbox.currentIndex].url} 
                alt="Fullscreen view" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
              />
            )}
            
            {/* Index Counter */}
            {lightbox.media.length > 1 && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/50 font-bold text-sm tracking-widest">
                {lightbox.currentIndex + 1} / {lightbox.media.length}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}