"use client";
import { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Premium SVG Icons ---
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

const defaultForm = {
  imageUrl: '',
  title: '',
  instructor: '',
  date: '',
  time: '',
  description: '',
  status: 'Upcoming',
};

export default function CohortsManagerPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Custom Delete Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real-time tracker for dynamic statuses
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Tick every minute to check if a session needs to switch to Live or Completed
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/cohorts');
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const triggerEdit = (session: any) => {
    setEditingId(session.id);
    setFormData({
      imageUrl: session.imageUrl || '',
      title: session.title || '',
      instructor: session.instructor || '',
      date: session.date || '',
      time: session.time || '',
      description: session.description || '',
      status: session.status || 'Upcoming',
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setImageFile(null);
  };

  // --- Deletion Logic ---
  const confirmDeleteSession = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    
    try {
      await fetch('/api/cohorts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmId })
      });
      
      if (editingId === deleteConfirmId) cancelEdit();
      await fetchSessions(); 
    } catch (error) {
      console.error("Failed to delete cohort:", error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let currentImageUrl = formData.imageUrl;

      if (imageFile) {
        const fileRef = ref(storage, `cohorts/covers/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        currentImageUrl = await getDownloadURL(fileRef);
      }

      const method = editingId ? 'PUT' : 'POST';
      const payload = { 
        ...formData, 
        imageUrl: currentImageUrl,
        id: editingId ? editingId : undefined 
      };

      await fetch('/api/cohorts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchSessions(); 
      cancelEdit(); 
      
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error(error);
      alert("Failed to publish schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Dynamic Status Engine ---
  const evaluateStatus = (session: any) => {
    // If manually overridden in DB, respect it
    if (session.status === 'Completed') return 'Completed';
    if (!session.date || !session.time) return session.status;

    const sessionDateTime = new Date(`${session.date}T${session.time}`).getTime();
    
    // Assume cohort runs for 2 hours (7200000 milliseconds)
    const sessionEndTime = sessionDateTime + 7200000;

    if (currentTime > sessionEndTime) {
      return 'Completed';
    }
    
    if (currentTime >= sessionDateTime && currentTime <= sessionEndTime) {
      return 'Live Now';
    }

    return session.status; // Defaults to Upcoming
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 relative">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Upcoming Sessions</h2>
           <p className="text-slate-500 font-medium mt-1">Plan and publish upcoming live sessions to the Home Screen.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN: Scheduler Form */}
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 h-fit">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Session' : 'Schedule New Session'}
             </h3>
             {editingId && (
               <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             
             <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Session Banner</label>
                 <input 
                   id="image-upload" type="file" accept="image/*"
                   onChange={(e) => { if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]); }}
                   className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                 />
                 {formData.imageUrl && !imageFile && editingId && (
                   <div className="mt-2 text-xs font-bold text-blue-600">Existing banner attached.</div>
                 )}
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Session Title</label>
                 <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="e.g. Intro to Gen AI" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructor Name</label>
                 <input type="text" required value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="e.g. John Doe" />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                 <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time (IST)</label>
                 <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" />
               </div>
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Session Description</label>
               <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm resize-none" placeholder="What will this session cover?"></textarea>
             </div>

             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Manual Status Override</label>
               <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white">
                 <option value="Upcoming">Auto (Upcoming / Live Now)</option>
                 <option value="Completed">Force Completed</option>
               </select>
             </div>

             <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-white font-black rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}`}>
               {isSubmitting ? 'Processing...' : editingId ? 'Update Session' : 'Schedule Session'}
             </button>
           </form>
         </div>

         {/* RIGHT COLUMN: Active Schedule */}
         <div className="xl:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
           <h3 className="text-xl font-bold text-slate-900 mb-6">Upcoming Master Calendar</h3>
           
           <div className="space-y-4">
             {sessions.map((session) => {
               const dynamicStatus = evaluateStatus(session);
               
               return (
                 <div key={session.id} className="flex flex-col sm:flex-row gap-5 p-5 border border-slate-200 bg-white rounded-2xl hover:border-indigo-300 transition-all">
                   
                   {session.imageUrl ? (
                     <img src={session.imageUrl} alt={session.title} className="w-full sm:w-40 h-32 object-cover rounded-xl border border-slate-100 shrink-0" />
                   ) : (
                     <div className="w-full sm:w-40 h-32 bg-slate-50 rounded-xl border border-slate-100 shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">
                       No Banner
                     </div>
                   )}
                   
                   <div className="flex-1 flex flex-col">
                     <div className="flex items-start justify-between mb-2">
                       <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                         dynamicStatus === 'Live Now' ? 'bg-red-100 text-red-600 animate-pulse' : 
                         dynamicStatus === 'Completed' ? 'bg-slate-100 text-slate-600' : 
                         'bg-indigo-100 text-indigo-700'
                       }`}>
                         {dynamicStatus}
                       </span>
                       
                       {/* SVG Edit & Delete Actions */}
                       <div className="flex items-center gap-1">
                         <button onClick={() => triggerEdit(session)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit Cohort">
                           <EditIcon />
                         </button>
                         <button onClick={() => setDeleteConfirmId(session.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Cohort">
                           <TrashIcon />
                         </button>
                       </div>
                     </div>
                     
                     <h4 className="font-bold text-slate-900 text-lg leading-tight">{session.title}</h4>
                     <p className="text-xs font-bold text-slate-500 mb-2">By {session.instructor}</p>
                     <p className="text-sm font-medium text-slate-600 line-clamp-2 mb-4">{session.description}</p>
                     
                     {/* Clean SVG UI for Date and Time */}
                     <div className="mt-auto flex items-center gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-lg w-fit border border-slate-100">
                       <span className="flex items-center gap-1.5"><CalendarIcon /> {session.date}</span>
                       <span className="flex items-center gap-1.5"><ClockIcon /> {session.time} IST</span>
                     </div>
                   </div>
                 </div>
               );
             })}

             {sessions.length === 0 && (
               <div className="text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                 No cohorts scheduled yet.
               </div>
             )}
           </div>
         </div>

       </div>

       {/* --- PREMIUM CUSTOM DELETE MODAL --- */}
       {deleteConfirmId && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5">
               <DangerIcon />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Cancel Cohort Session?</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               This will permanently remove the live session schedule and its associated banner from the student dashboard.
             </p>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setDeleteConfirmId(null)} 
                 disabled={isDeleting}
                 className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-colors disabled:opacity-50"
               >
                 Go Back
               </button>
               <button 
                 onClick={confirmDeleteSession} 
                 disabled={isDeleting}
                 className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
               >
                 {isDeleting ? 'Deleting...' : 'Yes, Delete'}
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}