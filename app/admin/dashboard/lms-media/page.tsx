"use client";
import React, { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// --- Premium SVG Icons ---
const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-3">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const DangerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function LMSMediaManager() {
  const [view, setView] = useState<'directory' | 'dashboard'>('directory');
  const [courses, setCourses] = useState<any[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [isSavingVideos, setIsSavingVideos] = useState(false);
  
  // Custom Modal States
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<number | null>(null);

  // Create Form State
  const [courseForm, setCourseForm] = useState({
    name: '', sessions: '', chapters: '', totalVideos: '', days: '', thumbnail: ''
  });

  // Dynamic Video Builder State
  const [videoForms, setVideoForms] = useState<any[]>([]);
  
  // Preview Modal State
  const [previewVideo, setPreviewVideo] = useState<any | null>(null);

  // Fetch Vaults on Load
  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const vaultsCol = collection(db, 'mediaVaults');
        const q = query(vaultsCol, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching vaults:", error);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchVaults();
  }, []);

  // Handle Thumbnail Conversion to Base64
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseForm({ ...courseForm, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Create New Course Vault
  const handleCreateCourseVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingVault(true);

    try {
      const newCourseData = {
        ...courseForm,
        status: 'Draft',
        videos: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'mediaVaults'), newCourseData);
      setCourses([{ id: docRef.id, ...newCourseData }, ...courses]);
      
      setCourseForm({ name: '', sessions: '', chapters: '', totalVideos: '', days: '', thumbnail: '' });
    } catch (error) {
      console.error("Error creating vault:", error);
      alert("Failed to create storage vault. Please try again.");
    } finally {
      setIsCreatingVault(false);
    }
  };

  // TRIGGER Custom Course Deletion Modal
  const handleDeleteCourseVault = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation(); 
    setCourseToDelete(courseId);
  };

  // EXECUTE Course Deletion
  const confirmDeleteCourseVault = async () => {
    if (!courseToDelete) return;
    try {
      await deleteDoc(doc(db, 'mediaVaults', courseToDelete));
      setCourses(courses.filter(c => c.id !== courseToDelete));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course vault.");
    } finally {
      setCourseToDelete(null);
    }
  };

  // Open the Course Builder and generate the boxes
  const openCourseDashboard = (course: any) => {
    setActiveCourseId(course.id);
    
    const expectedVideoCount = parseInt(course.totalVideos) || 0;
    const existingVideos = course.videos || [];
    
    const initializedForms = Array.from({ length: Math.max(expectedVideoCount, existingVideos.length) }).map((_, i) => {
      if (existingVideos[i]) return existingVideos[i];
      return { title: '', description: '', iframe: '' };
    });

    setVideoForms(initializedForms);
    setView('dashboard');
  };

  // Add a brand new video slot dynamically
  const handleAddVideoSlot = () => {
    setVideoForms([...videoForms, { title: '', description: '', iframe: '' }]);
  };

  // Update a specific video box's data
  const handleVideoChange = (index: number, field: string, value: string) => {
    const updatedForms = [...videoForms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    setVideoForms(updatedForms);
  };

  // TRIGGER Custom Slot Deletion Modal
  const handleDeleteVideoSlot = (index: number) => {
    setSlotToDelete(index);
  };

  // EXECUTE Slot Deletion
  const confirmDeleteVideoSlot = () => {
    if (slotToDelete === null) return;
    const updatedForms = [...videoForms];
    updatedForms.splice(slotToDelete, 1);
    setVideoForms(updatedForms);
    setSlotToDelete(null);
  };

  // Save all video data to Firestore
  const handleSaveAllVideos = async () => {
    if (!activeCourseId) return;
    setIsSavingVideos(true);

    try {
      const courseRef = doc(db, 'mediaVaults', activeCourseId);
      const newVideoCount = videoForms.length.toString();

      await updateDoc(courseRef, { 
        videos: videoForms,
        totalVideos: newVideoCount
      });
      
      setCourses(courses.map(c => c.id === activeCourseId ? { ...c, videos: videoForms, totalVideos: newVideoCount } : c));
      alert("All videos saved successfully!");
    } catch (error) {
      console.error("Error saving videos:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSavingVideos(false);
    }
  };

  // Publish the course
  const handlePublishCourse = async () => {
    if (!activeCourseId) return;
    try {
      const courseRef = doc(db, 'mediaVaults', activeCourseId);
      await updateDoc(courseRef, { status: 'Published' });
      setCourses(courses.map(course => course.id === activeCourseId ? { ...course, status: 'Published' } : course));
      setView('directory');
    } catch (error) {
      console.error("Error publishing:", error);
    }
  };

  const activeCourse = courses.find(c => c.id === activeCourseId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
       
       {/* HEADER */}
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">
             {view === 'directory' ? 'LMS Media Vault' : 'Course Video Builder'}
           </h2>
           <p className="text-slate-500 font-medium mt-1">
             {view === 'directory' 
               ? 'Initialize course storage and manage media vaults.' 
               : `Managing content for: ${activeCourse?.name}`}
           </p>
         </div>
         {view === 'dashboard' && (
           <button onClick={() => setView('directory')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-bold text-sm rounded-xl transition-all shadow-sm">
             <ArrowLeftIcon /> Back to Vaults
           </button>
         )}
       </div>

       {/* ======================= DIRECTORY VIEW ======================= */}
       {view === 'directory' && (
         <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
           
           {/* CREATE VAULT FORM */}
           <div className="xl:col-span-4 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 h-fit">
             <h3 className="text-xl font-bold text-slate-900 mb-6">Initialize Course Vault</h3>
             
             <form onSubmit={handleCreateCourseVault} className="space-y-4">
               
               <div>
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Course Thumbnail</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ImageIcon /></div>
                   <input required disabled={isCreatingVault} type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 disabled:opacity-50" />
                 </div>
                 {courseForm.thumbnail && (
                   <img src={courseForm.thumbnail} alt="Preview" className="mt-2 h-20 w-auto rounded-lg border border-slate-200 shadow-sm" />
                 )}
               </div>

               <div>
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Course Name</label>
                 <input required disabled={isCreatingVault} value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm disabled:opacity-50" placeholder="e.g. Master React 2026" />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Total Sessions</label>
                   <input required disabled={isCreatingVault} value={courseForm.sessions} onChange={e => setCourseForm({...courseForm, sessions: e.target.value})} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm disabled:opacity-50" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Total Chapters</label>
                   <input required disabled={isCreatingVault} value={courseForm.chapters} onChange={e => setCourseForm({...courseForm, chapters: e.target.value})} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm disabled:opacity-50" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Total Expected Videos</label>
                   <input required disabled={isCreatingVault} value={courseForm.totalVideos} onChange={e => setCourseForm({...courseForm, totalVideos: e.target.value})} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm disabled:opacity-50" placeholder="e.g. 30" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Days to Complete</label>
                   <input required disabled={isCreatingVault} value={courseForm.days} onChange={e => setCourseForm({...courseForm, days: e.target.value})} type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm disabled:opacity-50" />
                 </div>
               </div>

               <button type="submit" disabled={isCreatingVault} className="w-full py-3.5 text-white font-black bg-slate-900 hover:bg-blue-600 rounded-xl transition-all disabled:opacity-50 mt-6 shadow-lg">
                 {isCreatingVault ? 'Initializing...' : 'Create Storage Vault'}
               </button>
             </form>
           </div>

           {/* VAULT LIST */}
           <div className="xl:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-slate-900 mb-6">Course Storage Vaults</h3>
             
             {isFetchingData ? (
               <div className="text-center py-16 text-slate-400 font-bold text-sm">
                 <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                 Loading Vaults...
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {courses.map((course) => (
                   <div key={course.id} onClick={() => openCourseDashboard(course)} className="p-6 border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group bg-slate-50 hover:bg-white relative overflow-hidden flex flex-col justify-between">
                     
                     <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                     
                     <button 
                       onClick={(e) => handleDeleteCourseVault(e, course.id)}
                       className="absolute top-4 right-4 z-20 p-2 text-slate-300 hover:text-white hover:bg-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                       title="Delete Course Vault"
                     >
                       <TrashIcon />
                     </button>

                     <div>
                       {course.thumbnail ? (
                         <img src={course.thumbnail} alt={course.name} className="w-16 h-12 object-cover rounded-lg mb-3 shadow-sm border border-slate-200" />
                       ) : (
                         <FolderIcon />
                       )}
                       <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight group-hover:text-blue-600 transition-colors relative z-10 pr-8">{course.name}</h4>
                       
                       <div className="flex items-center gap-2 mb-4 relative z-10">
                         <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${
                           course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                         }`}>
                           {course.status}
                         </span>
                         <span className="text-xs font-bold text-slate-400">{course.totalVideos} Video Slots Configured</span>
                       </div>
                     </div>

                     <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-4 relative z-10 mt-auto">
                       <div>
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Chapters</div>
                         <div className="text-sm font-bold text-slate-700">{course.chapters}</div>
                       </div>
                       <div>
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Sessions</div>
                         <div className="text-sm font-bold text-slate-700">{course.sessions}</div>
                       </div>
                       <div>
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Duration</div>
                         <div className="text-sm font-bold text-slate-700">{course.days}D</div>
                       </div>
                     </div>
                   </div>
                 ))}

                 {courses.length === 0 && (
                   <div className="col-span-1 sm:col-span-2 text-center py-16 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                     No course vaults initialized yet. Setup your first course on the left.
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>
       )}

       {/* ======================= DASHBOARD BUILDER VIEW ======================= */}
       {view === 'dashboard' && activeCourse && (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           {/* Builder Action Header */}
           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between sticky top-4 z-40 gap-4">
             <div className="flex items-center gap-3">
               <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-black tracking-wide shrink-0">
                 {videoForms.length} Video Slots
               </span>
               <span className="text-sm font-medium text-slate-500 hidden lg:block">Fill in the data and paste your Google Drive IFrames below.</span>
             </div>
             
             <div className="flex gap-3">
               <button 
                 onClick={handleAddVideoSlot}
                 className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm shrink-0"
               >
                 <PlusIcon /> Add Slot
               </button>

               <button 
                 onClick={handleSaveAllVideos}
                 disabled={isSavingVideos}
                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 shrink-0"
               >
                 <SaveIcon /> {isSavingVideos ? 'Saving...' : 'Save All Changes'}
               </button>
               
               <button 
                 onClick={handlePublishCourse}
                 className={`px-5 py-2.5 text-sm font-black rounded-xl transition-all shadow-sm shrink-0 ${
                   activeCourse.status === 'Published' 
                     ? 'bg-green-100 text-green-700 border border-green-200'
                     : 'bg-slate-900 hover:bg-slate-800 text-white'
                 }`}
               >
                 {activeCourse.status === 'Published' ? 'Course Published' : 'Publish Course'}
               </button>
             </div>
           </div>

           {/* Generated Video Form Boxes */}
           <div className="space-y-6">
             {videoForms.map((video, idx) => (
               <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 relative overflow-hidden group hover:border-blue-300 transition-colors">
                 
                 {/* Video Number Badge */}
                 <div className="absolute top-0 left-0 bg-slate-900 text-white text-xs font-black px-4 py-1.5 rounded-br-xl shadow-sm">
                   Video #{idx + 1}
                 </div>

                 <button 
                   onClick={() => handleDeleteVideoSlot(idx)}
                   className="absolute top-0 right-0 bg-slate-100 text-slate-400 hover:text-white hover:bg-red-500 p-2.5 rounded-bl-xl shadow-sm transition-colors z-10"
                   title="Delete Video Slot"
                 >
                   <TrashIcon />
                 </button>

                 {/* Form Fields */}
                 <div className="flex-1 mt-6 space-y-4">
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Video Title</label>
                     <input 
                       type="text" 
                       value={video.title} 
                       onChange={(e) => handleVideoChange(idx, 'title', e.target.value)}
                       placeholder={`Enter title for video ${idx + 1}...`}
                       className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-900 text-sm" 
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Description</label>
                     <textarea 
                       rows={2}
                       value={video.description} 
                       onChange={(e) => handleVideoChange(idx, 'description', e.target.value)}
                       placeholder="What will students learn in this video?"
                       className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm resize-none" 
                     />
                   </div>
                 </div>

                 {/* Iframe Field & Actions */}
                 <div className="flex-1 mt-6 flex flex-col">
                   <div className="flex-1">
                     <label className="block text-[10px] font-black text-blue-600 uppercase tracking-wider mb-2">Google Drive IFrame Embed Code</label>
                     <textarea 
                       rows={4}
                       value={video.iframe} 
                       onChange={(e) => handleVideoChange(idx, 'iframe', e.target.value)}
                       placeholder='<iframe src="https://drive.google.com/file/d/VIDEO_ID/preview" width="640" height="480" allow="autoplay"></iframe>'
                       className="w-full h-24 px-4 py-2.5 rounded-xl border border-blue-200 focus:border-blue-500 outline-none font-mono text-slate-700 text-xs bg-blue-50/30 resize-none" 
                     />
                   </div>
                   
                   <div className="mt-4 flex justify-end">
                     <button 
                       onClick={() => setPreviewVideo(video)}
                       disabled={!video.iframe}
                       className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-lg text-sm transition-colors disabled:opacity-50"
                     >
                       <EyeIcon /> Preview Embed
                     </button>
                   </div>
                 </div>
                 
               </div>
             ))}
           </div>

         </div>
       )}

       {/* ======================= FULLSCREEN CINEMATIC PREVIEW MODAL ======================= */}
       {previewVideo && (
         <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 animate-in fade-in duration-200">
           
           <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0 bg-slate-950 z-10 shadow-md">
             <div>
               <h3 className="text-xl font-black text-white tracking-tight">{previewVideo.title || "Untitled Video"}</h3>
               <p className="text-sm font-medium text-slate-400 mt-1">{previewVideo.description || "No description provided."}</p>
             </div>
             <button 
               onClick={() => setPreviewVideo(null)}
               className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors font-bold shrink-0"
             >
               ✕
             </button>
           </div>
           
           <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
              {/* 
                 HACK: Pushing the iframe up by 60px and extending height to compensate.
                 This hides the Google Drive header (which contains the unwanted pop-out button) 
                 while keeping the video controls visible at the exact bottom of the screen!
              */}
              <div 
                className="absolute top-[-60px] left-0 w-full h-[calc(100%+60px)] [&>iframe]:!w-full [&>iframe]:!h-full [&>iframe]:!border-none"
                dangerouslySetInnerHTML={{ __html: previewVideo.iframe }}
              />
           </div>

         </div>
       )}

       {/* ======================= CUSTOM COURSE DELETE MODAL ======================= */}
       {courseToDelete && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5">
               <DangerIcon />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Delete Course Vault?</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               WARNING: Are you sure you want to permanently delete this course vault and all its video data? This action cannot be undone.
             </p>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setCourseToDelete(null)} 
                 className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmDeleteCourseVault} 
                 className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-red-600/20"
               >
                 Yes, Delete
               </button>
             </div>
           </div>
         </div>
       )}

       {/* ======================= CUSTOM SLOT DELETE MODAL ======================= */}
       {slotToDelete !== null && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5">
               <DangerIcon />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Remove Video Slot?</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               Are you sure you want to remove this video slot? You still need to click <span className="font-bold text-slate-700">'Save All Changes'</span> at the top to finalize this deletion.
             </p>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setSlotToDelete(null)} 
                 className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmDeleteVideoSlot} 
                 className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-red-600/20"
               >
                 Remove Slot
               </button>
             </div>
           </div>
         </div>
       )}

    </div>
  );
}