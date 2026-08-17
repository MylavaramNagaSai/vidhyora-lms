"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

// --- Premium SVG Icons ---
const PulseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const DesktopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const MobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// --- Interfaces ---
interface Visitor {
  id: string;
  ip: string;
  location: string;
  device: 'desktop' | 'mobile';
  page: string;
  lastActive: any;
}

interface AnalyticsStats {
  liveCount: number;
  todayCount: number;
  totalCount: number;
}

export default function LiveAnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats>({ liveCount: 0, todayCount: 0, totalCount: 0 });
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to Global Stats (Live, Today, Total)
    const statsRef = doc(db, 'analytics', 'global_stats');
    const unsubscribeStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          liveCount: data.liveCount || 0,
          todayCount: data.todayCount || 0,
          totalCount: data.totalCount || 0,
        });
      }
      setIsLoading(false);
    });

    // 2. Listen to Active Live Visitors Collection
    const visitorsRef = collection(db, 'live_visitors');
    const q = query(visitorsRef, orderBy('lastActive', 'desc'), limit(50));
    
    const unsubscribeVisitors = onSnapshot(q, (snapshot) => {
      const activeUsers: Visitor[] = [];
      snapshot.forEach((doc) => {
        activeUsers.push({ id: doc.id, ...doc.data() } as Visitor);
      });
      setVisitors(activeUsers);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeStats();
      unsubscribeVisitors();
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Live Analytics
            {stats.liveCount > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </h2>
          <p className="text-slate-500 font-medium mt-1">Real-time traffic monitoring and network telemetry.</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Live Active Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Active Now</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {isLoading ? '--' : stats.liveCount}
              </h3>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
              <PulseIcon />
            </div>
          </div>
          <p className="text-xs font-bold text-red-600 mt-4 flex items-center gap-1 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Real-time tracking active
          </p>
        </div>

        {/* Today's Views Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Views Today</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {isLoading ? '--' : stats.todayCount.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <CalendarIcon />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-4 relative z-10">Resets automatically at midnight IST</p>
        </div>

        {/* Total Views Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Lifetime Views</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {isLoading ? '--' : stats.totalCount.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <GlobeIcon />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-4 relative z-10">Permanent data store</p>
        </div>

      </div>

      {/* Live Visitor Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Live Network Traffic</h3>
          <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-lg">
            {visitors.length} Connected
          </span>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4">IP Address</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4">Active Page</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {visitors.length > 0 ? (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm font-bold text-slate-900 font-mono">{visitor.ip}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <MapPinIcon />
                        {visitor.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                        {visitor.page}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 capitalize">
                        {visitor.device === 'desktop' ? <DesktopIcon /> : <MobileIcon />}
                        {visitor.device}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                      <PulseIcon />
                    </div>
                    <p className="text-sm font-bold text-slate-900">No active visitors</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">Waiting for incoming traffic...</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}