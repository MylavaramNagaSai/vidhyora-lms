"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Your existing components
import WelcomeHeader from './components/portal/WelcomeHeader';
import ActiveCourseCard from './components/portal/ActiveCourseCard';
import QuickActionCards from './components/portal/QuickActionCards';
import NextLiveClass from './components/portal/NextLiveClass';
import SupportWidget from './components/portal/SupportWidget';

const LockIconLg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 mb-4 mx-auto">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const LockIconSm = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function StudentPortal() {
  const router = useRouter();
  
  // NEW: We now track both assigned AND unassigned (available) courses
  const [assignedCourses, setAssignedCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const authRes = await fetch('/api/auth/me'); 
        
        if (!authRes.ok) {
          router.push('/login');
          return;
        }

        const authData = await authRes.json();
        const loggedInEmail = authData.email; 

        if (!loggedInEmail) {
          router.push('/login');
          return;
        }

        const studentQuery = query(collection(db, 'lms_students'), where('email', '==', loggedInEmail));
        const studentSnap = await getDocs(studentQuery);

        if (studentSnap.empty) {
          setIsLoading(false);
          setIsCheckingAuth(false);
          return; 
        }

        const studentData = studentSnap.docs[0].data();
        setStudentName(studentData.studentName?.split(' ')[0] || "Student");

        const accessType = studentData.accessType;
        const allowedCourses = studentData.specificCourses || [];
        const isRevoked = studentData.status === 'Revoked';

        if (isRevoked) {
          setIsLoading(false);
          setIsCheckingAuth(false);
          return; 
        }

        const vaultsQuery = query(collection(db, 'mediaVaults'), where('status', '==', 'Published'));
        const vaultsSnap = await getDocs(vaultsQuery);

        const myAuthorizedCourses: any[] = [];
        const myLockedCourses: any[] = []; // NEW: Array for locked courses

        vaultsSnap.forEach(doc => {
          const course = { id: doc.id, ...doc.data() };
          
          // Logic: If bundle OR name is included, it's authorized. Else, it's locked.
          if (accessType === 'Full Platform Bundle' || allowedCourses.includes(course.name)) {
            myAuthorizedCourses.push(course);
          } else {
            myLockedCourses.push(course);
          }
        });

        setAssignedCourses(myAuthorizedCourses);
        setAvailableCourses(myLockedCourses); // NEW: Save locked courses to state

      } catch (error) {
        console.error("Auth or Data Fetch Error:", error);
        router.push('/login'); 
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-12 bg-slate-50 min-h-screen">
      <WelcomeHeader studentName={studentName} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 1: ENROLLED COURSES */}
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Your Enrolled Tracks
            </h2>
            <div className="space-y-6">
              {assignedCourses.length > 0 ? (
                assignedCourses.map((course, idx) => (
                  <ActiveCourseCard key={course.id} course={course} isFirst={idx === 0} />
                ))
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center flex flex-col items-center justify-center">
                  <LockIconLg />
                  <h3 className="text-xl font-black text-slate-900 mb-2">No Active Courses</h3>
                  <p className="text-slate-500 font-medium max-w-md">Your account does not currently have access to any published training modules.</p>
                </div>
              )}
            </div>
          </div>

          <QuickActionCards />

          {/* SECTION 2: AVAILABLE / LOCKED COURSES */}
          {availableCourses.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h2 className="text-lg font-black text-slate-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span> Available to Unlock
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {availableCourses.map((course) => (
                  <div key={course.id} className="bg-white/60 border border-slate-200 rounded-3xl p-5 shadow-sm grayscale-[30%] opacity-80 flex flex-col relative overflow-hidden">
                    <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner mb-4">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.name} className="object-cover w-full h-full opacity-50" />
                      ) : (
                        <div className="absolute inset-0 bg-slate-200"></div>
                      )}
                      {/* Padlock Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                          <LockIconSm />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-700 mb-1 leading-tight">{course.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mb-4">{course.chapters || 0} Chapters • {course.totalVideos || 0} Videos</p>
                    
                    <button className="mt-auto w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl transition-colors">
                      Request Access
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        
        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <NextLiveClass />
          <SupportWidget />
        </div>
        
      </div>
    </main>
  );
}