"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default function CoursePlayer({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params for Next.js 15+ compatibility
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;
  
  const router = useRouter();
  
  const [course, setCourse] = useState<any>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticateAndFetchCourse = async () => {
      try {
        // 1. Verify Student is logged in
        const authRes = await fetch('/api/auth/me'); 
        if (!authRes.ok) return router.push('/login');
        const { email } = await authRes.json();

        // 2. Fetch the Student's access rules
        const studentQ = query(collection(db, 'lms_students'), where('email', '==', email));
        const studentSnap = await getDocs(studentQ);
        if (studentSnap.empty || studentSnap.docs[0].data().status === 'Revoked') {
          return router.push('/portal');
        }

        const studentData = studentSnap.docs[0].data();

        // 3. Fetch the specific Course Data
        const courseRef = doc(db, 'mediaVaults', courseId);
        const courseSnap = await getDoc(courseRef);
        
        if (!courseSnap.exists() || courseSnap.data().status !== 'Published') {
          return router.push('/portal');
        }

        // CRITICAL FIX: Added "as any" to satisfy TypeScript's strict type checking
        const courseData = { id: courseSnap.id, ...courseSnap.data() } as any;

        // 4. Double check: Are they allowed to view this specific course?
        if (studentData.accessType !== 'Full Platform Bundle' && !studentData.specificCourses?.includes(courseData.name)) {
          return router.push('/portal'); // Kick them out if they click a URL they don't own
        }

        // Setup Player
        setCourse(courseData);

      } catch (error) {
        console.error("Error loading player:", error);
        router.push('/portal');
      } finally {
        setIsLoading(false);
      }
    };

    authenticateAndFetchCourse();
  }, [courseId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course || !course.videos || course.videos.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-black mb-2">No videos available</h2>
        <p className="text-slate-400 mb-6">This course is empty or under construction.</p>
        <Link href="/portal" className="bg-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-500 transition-colors">Go Back</Link>
      </div>
    );
  }

  const activeVideo = course.videos[activeVideoIndex];

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-16 bg-[#0f172a] border-b border-slate-800 flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
            <ArrowLeftIcon />
          </Link>
          <h1 className="text-lg font-black text-white">{course.name}</h1>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
          Module {activeVideoIndex + 1} of {course.videos.length}
        </div>
      </header>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Video Player */}
        <div className="flex-1 flex flex-col relative bg-black">
          {/* Cinematic Iframe Container */}
          <div className="w-full relative pt-[56.25%] overflow-hidden shadow-2xl">
            {/* The -top-[60px] trick hides the Google Drive header! */}
            <div 
              className="absolute left-0 top-[-60px] w-full h-[calc(100%+60px)] [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-none"
              dangerouslySetInnerHTML={{ __html: activeVideo.iframe }}
            />
          </div>

          <div className="p-8 lg:p-12 overflow-y-auto">
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">{activeVideo.title || `Video ${activeVideoIndex + 1}`}</h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
              {activeVideo.description || "No description provided for this lesson."}
            </p>
          </div>
        </div>

        {/* Right: Playlist Sidebar */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0f172a] border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Course Playlist</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {course.videos.map((video: any, idx: number) => {
              const isActive = idx === activeVideoIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`w-full text-left p-4 rounded-2xl flex gap-4 transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600/10 border border-blue-500/30 shadow-inner' 
                      : 'bg-transparent border border-transparent hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isActive ? <PlayIcon /> : <span className="font-bold text-sm">{idx + 1}</span>}
                  </div>
                  
                  <div className="flex-1 overflow-hidden flex flex-col justify-center">
                    <h4 className={`text-sm font-bold truncate leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {video.title || `Untitled Video ${idx + 1}`}
                    </h4>
                    {isActive && <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1 block">Now Playing</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}