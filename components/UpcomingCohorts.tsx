"use client";
import { useState, useEffect } from "react";

// Premium SVG Icons (No external libraries needed)
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function UpcomingCohorts() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/cohorts");
        const data = await res.json();
        const activeSessions = data.filter((s: any) => s.status !== "Completed");
        setSessions(activeSessions);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading || sessions.length === 0) return null; 

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      
      {/* Left-Aligned Header (Matches Central Course Hub) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Live & Upcoming</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Masterclasses & Cohorts</h2>
          <p className="text-slate-500 font-medium mt-2">Join our expert-led interactive sessions. Reserve your spot before the cohort fills up.</p>
        </div>
      </div>

      {/* Premium Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 flex flex-col">
            
            {/* Image Container */}
            <div className="w-full h-52 relative overflow-hidden bg-slate-100">
              <img 
                src={session.imageUrl} 
                alt={session.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md ${
                  session.status === 'Live Now' ? 'bg-red-500/90 text-white' : 'bg-white/90 text-slate-900'
                }`}>
                  {session.status}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
              <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">Instructor: {session.instructor}</p>
              <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{session.title}</h3>
              <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2">
                {session.description}
              </p>

              {/* Footer with Premium Icons & Button */}
              <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarIcon />
                    <span className="text-xs font-bold text-slate-700">{session.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-400">
                    <ClockIcon />
                    <span className="text-xs font-bold text-slate-700">{session.time} IST</span>
                  </div>

                </div>
                
                <button className="px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                  Reserve
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}