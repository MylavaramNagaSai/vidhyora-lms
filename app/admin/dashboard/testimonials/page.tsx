"use client";
import { useState, useEffect, useRef } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Premium SVG Icons ---
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={filled ? "text-amber-400" : "text-slate-300"}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const QuoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
  </svg>
);

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
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

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const Volume2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const VolumeXIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

// --- Custom Video Player Component ---
const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="mt-4 bg-black rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col max-w-sm">
      {/* Video element - increased max-height, using object-contain to ensure no cropping */}
      <video 
        ref={videoRef}
        src={src} 
        className="w-full max-h-[280px] object-contain bg-black" 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />
      
      {/* Custom Controls Bar directly below the video */}
      <div className="w-full bg-white p-3 flex items-center justify-center gap-6 border-t border-slate-200">
        <button 
          type="button"
          onClick={togglePlay} 
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-bold text-sm transition-colors shadow-sm"
        >
          {isPlaying ? <><PauseIcon /> Pause</> : <><PlayIcon /> Play</>}
        </button>
        <button 
          type="button"
          onClick={toggleMute} 
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-bold text-sm transition-colors shadow-sm"
        >
          {isMuted ? <><VolumeXIcon /> Unmute</> : <><Volume2Icon /> Mute</>}
        </button>
      </div>
    </div>
  );
};


const defaultForm = {
  name: '',
  designation: '',
  avatarUrl: '',
  type: 'text', // 'text', 'audio', 'video'
  content: '', // Holds text string OR media URL
  rating: 5,
  submissionDate: new Date().toISOString().split('T')[0],
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsAvatarUploading(true);
    try {
      const fileRef = ref(storage, `testimonials/avatars/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setFormData({ ...formData, avatarUrl: url });
    } catch (error) {
      alert("Failed to upload profile picture.");
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsMediaUploading(true);
    try {
      const fileRef = ref(storage, `testimonials/media/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setFormData({ ...formData, content: url });
    } catch (error) {
      alert("Failed to upload media file.");
    } finally {
      setIsMediaUploading(false);
    }
  };

  const triggerEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      designation: item.designation || '',
      avatarUrl: item.avatarUrl || '',
      type: item.type || 'text',
      content: item.content || '',
      rating: item.rating || 5,
      submissionDate: item.submissionDate || new Date().toISOString().split('T')[0],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this testimonial?")) return;
    try {
      await fetch('/api/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (editingId === id) cancelEdit();
      await fetchTestimonials();
    } catch (error) {
      alert("Failed to delete testimonial.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.avatarUrl) {
      alert("Please upload a profile picture for the student/client.");
      return;
    }
    if (!formData.content) {
      alert(`Please provide the ${formData.type} content.`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...formData, id: editingId ? editingId : undefined };

      await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchTestimonials(); 
      cancelEdit(); 
    } catch (error) {
      alert("Failed to save testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
       
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Testimonials</h2>
           <p className="text-slate-500 font-medium mt-1">Manage textual, audio, and video success stories from your graduates.</p>
         </div>
       </div>

       {/* Top Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Total Verified Reviews</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{testimonials.length}</h3>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center relative z-10">
              <QuoteIcon />
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-3xl p-6 shadow-lg relative overflow-hidden flex items-center justify-between">
             <div className="relative z-10">
               <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Average Platform Rating</p>
               <h3 className="text-3xl font-black text-amber-400 tracking-tight flex items-center gap-2">
                 {avgRating} <StarIcon filled={true} />
               </h3>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* LEFT COLUMN: Builder Form */}
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sticky top-6">
           <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Testimonial' : 'Log New Testimonial'}
             </h3>
             {editingId && (
               <button type="button" onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
             
             {/* Profile Avatar Upload */}
             <div className="flex items-center gap-6">
               <div className="relative w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center overflow-hidden group hover:border-amber-400 transition-colors cursor-pointer shrink-0">
                 {formData.avatarUrl ? (
                   <>
                     <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <UploadIcon />
                     </div>
                   </>
                 ) : (
                   <UserPlusIcon />
                 )}
                 <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleAvatarUpload} disabled={isAvatarUploading} />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-slate-900">Student Picture</h4>
                 <p className="text-xs font-medium text-slate-500 mt-1">{isAvatarUploading ? 'Uploading...' : 'Required for authenticity.'}</p>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 md:col-span-1">
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Student Name</label>
                 <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-bold text-slate-900 text-sm" placeholder="e.g. Rahul Sharma" />
               </div>
               <div className="col-span-2 md:col-span-1">
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Designation / Role</label>
                 <input type="text" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-bold text-slate-900 text-sm" placeholder="e.g. SDE at Google" />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Submission Date</label>
                 <input type="date" required value={formData.submissionDate} onChange={e => setFormData({...formData, submissionDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-bold text-slate-900 text-sm bg-white" />
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Star Rating</label>
                 <div className="flex items-center gap-1 mt-3">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className="focus:outline-none hover:scale-110 transition-transform">
                       <StarIcon filled={star <= formData.rating} />
                     </button>
                   ))}
                 </div>
               </div>
             </div>

             {/* Feedback Type Selector */}
             <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Feedback Format</label>
               <div className="flex gap-2 bg-slate-200 p-1 rounded-lg">
                 {['text', 'audio', 'video'].map((type) => (
                   <button 
                     key={type}
                     type="button" 
                     onClick={() => {
                       if ((formData.type === 'text' && type !== 'text') || (formData.type !== 'text' && type === 'text')) {
                         setFormData({...formData, type: type, content: ''});
                       } else {
                         setFormData({...formData, type: type});
                       }
                     }}
                     className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${formData.type === type ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     {type}
                   </button>
                 ))}
               </div>

               {/* Dynamic Content Input based on Type */}
               <div className="mt-4">
                 {formData.type === 'text' ? (
                   <textarea 
                     required 
                     rows={4} 
                     value={formData.content} 
                     onChange={e => setFormData({...formData, content: e.target.value})} 
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-700 text-sm resize-none" 
                     placeholder="Type their testimonial here..." 
                   />
                 ) : (
                   <div className="relative w-full h-32 bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center overflow-hidden hover:border-amber-400 transition-colors cursor-pointer">
                     {formData.content ? (
                       <div className="text-center">
                         <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">✓</div>
                         <p className="text-xs font-bold text-slate-700">Media uploaded successfully</p>
                         <p className="text-[10px] text-slate-500 mt-1">Click to replace</p>
                       </div>
                     ) : (
                       <div className="text-center">
                         <UploadIcon />
                         <p className="text-xs font-bold text-slate-400 mt-2">{isMediaUploading ? 'Uploading...' : `Upload ${formData.type} file`}</p>
                       </div>
                     )}
                     <input type="file" accept={`${formData.type}/*`} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleMediaUpload} disabled={isMediaUploading} />
                   </div>
                 )}
               </div>
             </div>

             <button type="submit" disabled={isSubmitting || isAvatarUploading || isMediaUploading} className={`w-full py-4 text-white font-black rounded-xl transition-all shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-slate-900 hover:bg-amber-500 hover:text-slate-900 shadow-slate-900/20'}`}>
               {isSubmitting ? 'Saving...' : editingId ? 'Update Testimonial' : 'Publish Testimonial'}
             </button>
           </form>
         </div>

         {/* RIGHT COLUMN: Directory */}
         <div className="xl:col-span-7">
           <h3 className="text-xl font-bold text-slate-900 mb-6 px-1">Testimonials Directory</h3>
           
           {testimonials.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
               <QuoteIcon />
               <p className="text-slate-500 font-medium mt-4">No testimonials logged yet.</p>
             </div>
           ) : (
             <div className="space-y-6">
               {testimonials.map((item) => (
                 <div key={item.id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-md transition-all relative flex flex-col sm:flex-row gap-5">
                   
                   {/* Action Buttons */}
                   <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm border border-slate-100 z-10">
                     <button onClick={() => triggerEdit(item)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                       <EditIcon />
                     </button>
                     <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                       <TrashIcon />
                     </button>
                   </div>

                   {/* Avatar */}
                   <div className="w-16 h-16 shrink-0 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-100">
                     <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                   </div>

                   {/* Info & Content */}
                   <div className="flex-1">
                     <div className="flex items-start justify-between pr-16">
                       <div>
                         <h4 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h4>
                         <p className="text-xs font-bold text-slate-400 mt-0.5">{item.designation}</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-3 mt-2 mb-3">
                       <div className="flex items-center gap-0.5">
                         {[1, 2, 3, 4, 5].map((star) => (
                           <StarIcon key={star} filled={star <= item.rating} />
                         ))}
                       </div>
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       <span className="text-[10px] font-bold text-slate-400">{item.submissionDate}</span>
                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                       <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${item.type === 'video' ? 'bg-rose-100 text-rose-700' : item.type === 'audio' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                         {item.type}
                       </span>
                     </div>

                     {/* Media Rendering */}
                     {item.type === 'text' && (
                       <p className="text-sm font-medium text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                         "{item.content}"
                       </p>
                     )}
                     
                     {item.type === 'audio' && (
                       <audio controls src={item.content} className="w-full h-10 mt-2" />
                     )}
                     
                     {/* 
                        CUSTOM VIDEO PLAYER INJECTED HERE
                     */}
                     {item.type === 'video' && (
                       <CustomVideoPlayer src={item.content} />
                     )}
                   </div>

                 </div>
               ))}
             </div>
           )}
         </div>

       </div>
    </div>
  );
}