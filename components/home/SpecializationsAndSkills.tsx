"use client";
import { useState, useEffect } from 'react';

// --- Premium SVG Icons ---
const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function SpecializationsAndSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        const data = await res.json();
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Keyboard accessibility for closing the Big Screen Popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSkill(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isLoading && skills.length === 0) return null;

  // Duplicate arrays to ensure the CSS infinite scroll never runs out of content
  const row1 = Array(15).fill(skills).flat();
  // Reverse the second row for an organic, staggered look
  const row2 = Array(15).fill([...skills].reverse()).flat();

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 overflow-hidden relative">
      
      <div className="max-w-[1500px] mx-auto px-8 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Platform Specializations & Skills
        </h2>
        <p className="text-lg text-slate-500 font-medium mt-4 max-w-2xl mx-auto">
          Hover over any technology and click to expand its core capabilities in full screen.
        </p>
      </div>

      {/* CSS for Infinite Scroll */}
      <style>{`
        @keyframes scroll-left { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        @keyframes scroll-right { 
          0% { transform: translateX(-50%); } 
          100% { transform: translateX(0); } 
        }
        .track-left { 
          display: flex; 
          width: max-content; 
          animation: scroll-left 50s linear infinite; 
        }
        .track-right { 
          display: flex; 
          width: max-content; 
          animation: scroll-right 50s linear infinite; 
        }
        /* Pauses the entire marquee when the user hovers over the container */
        .pause-on-hover:hover .track-left, 
        .pause-on-hover:hover .track-right { 
          animation-play-state: paused; 
        }
      `}</style>

      {isLoading ? (
        <div className="w-full flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="relative w-full pause-on-hover">
          
          {/* Gradient Edges for seamless fading */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

          {/* TOP TRACK (Scrolls Left) */}
          <div className="track-left flex gap-6 pb-6 px-6">
            {row1.map((skill, idx) => (
              <SkillCard key={`top-${idx}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
            ))}
          </div>

          {/* BOTTOM TRACK (Scrolls Right) */}
          <div className="track-right flex gap-6 pt-2 px-6">
            {row2.map((skill, idx) => (
               <SkillCard key={`bot-${idx}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
            ))}
          </div>

        </div>
      )}

      {/* --- BIG SCREEN POPUP MODAL --- */}
      {selectedSkill && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedSkill(null)}
        >
          <div 
            className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto md:overflow-hidden rounded-[2rem] shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside it
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedSkill(null)} 
              className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
            >
              <CloseIcon />
            </button>

            {/* Left Side: Massive Image View */}
            <div className="md:w-1/2 bg-slate-50 p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
              <img 
                src={selectedSkill.imageUrl} 
                alt={selectedSkill.name} 
                className="max-w-full max-h-[350px] object-contain drop-shadow-2xl" 
              />
            </div>

            {/* Right Side: Big Typography Bio */}
            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest rounded-full mb-6 w-fit">
                Core Specialization
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                {selectedSkill.name}
              </h2>
              <p className="text-lg md:text-xl font-medium text-slate-500 leading-relaxed">
                {selectedSkill.description}
              </p>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

// Sub-Component for individual Rich Cards on the scrolling track
function SkillCard({ skill, onClick }: { skill: any, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="w-[320px] shrink-0 bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 hover:-translate-y-2 group cursor-pointer flex flex-col"
    >
      {/* Image Container with Hover Overlay */}
      <div className="w-full h-44 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-center mb-5 relative overflow-hidden">
        
        {skill.imageUrl ? (
          <img 
            src={skill.imageUrl} 
            alt={skill.name} 
            className="max-w-full max-h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-slate-200 rounded-md animate-pulse"></div>
        )}
        
        {/* Click to expand overlay */}
        <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white text-blue-900 font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <ExpandIcon /> Big Screen
          </div>
        </div>
      </div>
      
      {/* Skill Data */}
      <div className="px-2 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{skill.name}</h3>
        <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>
      </div>
    </div>
  );
}