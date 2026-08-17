"use client";
import { useState, useEffect } from "react";

// --- Premium SVG Icons (Zero Emojis) ---
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
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

const InfinityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
    <path d="M18.38 5.61A4.62 4.62 0 1 1 21.5 12a4.62 4.62 0 0 1-3.12 6.39"></path>
    <path d="M5.62 18.39A4.62 4.62 0 1 1 2.5 12a4.62 4.62 0 0 1 3.12-6.39"></path>
    <path d="M12 12 5.62 5.61"></path>
    <path d="M12 12l6.38 6.39"></path>
  </svg>
);

export default function CentralCourseHub() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Most Popular");
  
  // Real-time ticker for Flash Sales
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getCountdown = (targetDateString: string) => {
    if (!targetDateString) return null;
    const target = new Date(targetDateString).getTime();
    const diff = target - currentTime;
    
    if (diff <= 0) return null; 

    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    
    return `${h}h ${m}m ${s}s`;
  };

  const tabs = ["Most Popular", "Trending", "Discounted"];

  const displayCourses = courses.filter((course) => {
    const isFlashSaleActive = getCountdown(course.rightNowValidUntil) !== null;
    
    if (activeTab === "Most Popular") return course.badge === "Most Popular" || course.badge === "New";
    if (activeTab === "Trending") return course.badge === "Trending" || course.badge === "Filling Fast";
    if (activeTab === "Discounted") return course.originalPrice > course.price || course.badge === "Discounted" || isFlashSaleActive;
    return true;
  });

  const finalCourses = displayCourses.length > 0 ? displayCourses : courses;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Central Course Hub</h2>
          <p className="text-slate-500 font-medium mt-2">Browse structured syllabus tracks with live batch indicators and date locks.</p>
        </div>
        
        <div className="flex p-1 bg-slate-100/80 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalCourses.map((course) => {
            const countdown = getCountdown(course.rightNowValidUntil);
            const isFlashSaleActive = countdown !== null;
            const displayPrice = isFlashSaleActive ? course.rightNowPrice : course.price;

            return (
              <div key={course.id} className="bg-white border border-slate-200 rounded-[2rem] hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
                
                {/* Dynamic Cover Image Banner */}
                <div className="relative w-full h-48 bg-slate-100 border-b border-slate-100 overflow-hidden">
                  {course.imageUrl ? (
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-sm">
                      No Cover Image
                    </div>
                  )}
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                      {course.badge}
                    </span>
                  </div>
                  {course.seatsLeft > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-red-50/95 backdrop-blur-sm text-red-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-red-200/50 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        {course.seatsLeft} Seats Left
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1">
                  {/* Title & Brief */}
                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{course.title}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-2">
                    <span className="text-slate-700 font-bold">Syllabus:</span> {course.brief && course.brief[0] ? course.brief[0] : 'Comprehensive Track + Certificate'}
                  </p>

                  {/* Features Box (SVGs replacing Emojis) */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl mb-8 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CalendarIcon />
                      <span>Next Batch: {course.batchStartDate || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <InfinityIcon />
                      <span>Lifetime Support</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-auto flex items-end justify-between pt-2">
                    <div>
                      {/* Live Flash Sale Indicator */}
                      {isFlashSaleActive && (
                        <div className="flex items-center gap-1.5 mb-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 w-fit rounded-lg border border-orange-200">
                          <ZapIcon />
                          <span className="text-[10px] font-black uppercase tracking-wider tabular-nums">{countdown}</span>
                        </div>
                      )}

                      <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                        ₹{displayPrice}
                        {/* Strikethrough Logic */}
                        {isFlashSaleActive && course.price > course.rightNowPrice && (
                          <span className="text-sm font-bold text-slate-400 line-through">₹{course.price}</span>
                        )}
                        {!isFlashSaleActive && course.originalPrice > course.price && (
                          <span className="text-sm font-bold text-slate-400 line-through">₹{course.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    <button className="px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white text-sm font-black rounded-xl transition-colors shadow-lg active:scale-95">
                      Enroll Now
                    </button>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State Fallback */}
      {!loading && courses.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Courses Available</h3>
          <p className="text-slate-500 font-medium">New cohorts will be deployed soon. Check back later!</p>
        </div>
      )}
    </div>
  );
}