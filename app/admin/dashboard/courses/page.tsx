"use client";
import { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Premium SVG Icons ---
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 mb-[1px]">
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
  brief: [''],
  badge: 'New',
  totalSeats: 0,
  seatsLeft: 0,
  batchStartDate: '',
  price: 0,
  originalPrice: 0,
  rightNowPrice: 0,
  rightNowValidUntil: '' 
};

export default function CourseManagerPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Custom Modal State (Replacing window.confirm)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleBriefChange = (index: number, value: string) => {
    const newBrief = [...formData.brief];
    newBrief[index] = value;
    setFormData({ ...formData, brief: newBrief });
  };

  const addBriefPoint = () => {
    setFormData({ ...formData, brief: [...formData.brief, ''] });
  };

  const removeBriefPoint = (index: number) => {
    const newBrief = formData.brief.filter((_, i) => i !== index);
    setFormData({ ...formData, brief: newBrief });
  };

  const triggerEdit = (course: any) => {
    setEditingId(course.id);
    setFormData({
      imageUrl: course.imageUrl || '',
      title: course.title || '',
      brief: course.brief?.length ? course.brief : [''],
      badge: course.badge || 'New',
      totalSeats: course.totalSeats || 0,
      seatsLeft: course.seatsLeft || 0,
      batchStartDate: course.batchStartDate || '',
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      rightNowPrice: course.rightNowPrice || 0,
      rightNowValidUntil: course.rightNowValidUntil || ''
    });
    setImageFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setImageFile(null);
  };

  // --- Premium Deletion Logic ---
  const confirmDeleteCourse = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    
    try {
      await fetch('/api/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmId })
      });
      
      if (editingId === deleteConfirmId) cancelEdit();
      await fetchCourses(); 
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null); // Close modal
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let currentImageUrl = formData.imageUrl;

      if (imageFile) {
        const fileRef = ref(storage, `courses/covers/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        currentImageUrl = await getDownloadURL(fileRef);
      }

      const method = editingId ? 'PUT' : 'POST';
      const payload = { 
        ...formData, 
        imageUrl: currentImageUrl,
        id: editingId ? editingId : undefined 
      };

      await fetch('/api/courses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchCourses(); 
      cancelEdit(); 
      
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 relative">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Course Manager</h2>
           <p className="text-slate-500 font-medium mt-1">Manage extensive course data, schedules, and dynamic pricing.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 h-fit">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Existing Track' : 'Deploy New Track'}
             </h3>
             {editingId && (
               <button type="button" onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             
             <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image Upload</label>
                 <input 
                   id="image-upload"
                   type="file" 
                   accept="image/*"
                   onChange={(e) => {
                     if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                   }}
                   className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                 />
                 {formData.imageUrl && !imageFile && editingId && (
                   <div className="mt-2 text-xs font-bold text-blue-600">
                     Existing image attached. Uploading a new one will replace it.
                   </div>
                 )}
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Title</label>
                 <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="e.g. 21-Day AI Mastery" />
               </div>
             </div>

             <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Brief & Highlights</label>
                 <button type="button" onClick={addBriefPoint} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                   + Add Point
                 </button>
               </div>
               <div className="space-y-2">
                 {formData.brief.map((point, idx) => (
                   <div key={idx} className="flex gap-2">
                     <input type="text" required value={point} onChange={e => handleBriefChange(idx, e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder={`Point ${idx + 1}`} />
                     {formData.brief.length > 1 && (
                       <button type="button" onClick={() => removeBriefPoint(idx)} className="px-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                         ✕
                       </button>
                     )}
                   </div>
                 ))}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Badge Type</label>
                 <select value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white">
                   <option value="New">New</option>
                   <option value="Most Popular">Most Popular</option>
                   <option value="Trending">Trending</option>
                   <option value="Discounted">Discounted</option>
                   <option value="Filling Fast">Filling Fast</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                 <input type="date" required value={formData.batchStartDate} onChange={e => setFormData({...formData, batchStartDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Seats</label>
                 <input type="number" required value={formData.totalSeats || ''} onChange={e => setFormData({...formData, totalSeats: Number(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Seats Left</label>
                 <input type="number" required value={formData.seatsLeft || ''} onChange={e => setFormData({...formData, seatsLeft: Number(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" />
               </div>
             </div>

             <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Cost (₹)</label>
                   <input type="number" required value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 outline-none font-black text-green-700 text-sm" placeholder="Standard Price" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Actual MRP (₹)</label>
                   <input type="number" required value={formData.originalPrice || ''} onChange={e => setFormData({...formData, originalPrice: Number(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-slate-500 outline-none font-medium text-slate-500 line-through text-sm" placeholder="Max Retail Price" />
                 </div>
               </div>
             </div>

             <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-4 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-2">
                 <ZapIcon/>
                 <h4 className="text-xs font-black text-orange-600 uppercase tracking-wider">Flash Sale Engine</h4>
               </div>
               
               <div className="grid grid-cols-2 gap-4 relative z-10">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Right Now Price (₹)</label>
                   <input type="number" value={formData.rightNowPrice || ''} onChange={e => setFormData({...formData, rightNowPrice: Number(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-orange-200 focus:border-orange-500 outline-none font-black text-orange-700 text-sm bg-white" placeholder="Discounted Price" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Timer Ends At</label>
                   <input type="datetime-local" value={formData.rightNowValidUntil} onChange={e => setFormData({...formData, rightNowValidUntil: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border border-orange-200 focus:border-orange-500 outline-none font-medium text-slate-900 text-sm bg-white" />
                 </div>
               </div>
             </div>

             <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-white font-black rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
               {isSubmitting ? 'Uploading & Processing...' : editingId ? 'Update Course Data' : 'Publish New Course'}
             </button>
           </form>
         </div>

         <div className="xl:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
           <h3 className="text-xl font-bold text-slate-900 mb-6">Active Platform Courses</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {courses.map((course) => {
               const countdown = getCountdown(course.rightNowValidUntil);
               const isFlashSaleActive = countdown !== null;
               const displayPrice = isFlashSaleActive ? course.rightNowPrice : course.price;
               
               return (
                 <div key={course.id} className="flex flex-col p-5 border border-slate-200 bg-white rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                   
                   {course.imageUrl && (
                     <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-4 border border-slate-100" />
                   )}
                   
                   <div className="flex items-center justify-between mb-3">
                     <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                       {course.badge}
                     </span>
                     
                     <div className="flex items-center gap-1">
                       <button onClick={() => triggerEdit(course)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit Course">
                         <EditIcon />
                       </button>
                       {/* Modified Delete Button opens Custom Modal instead of window.confirm */}
                       <button onClick={() => setDeleteConfirmId(course.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Course">
                         <TrashIcon />
                       </button>
                     </div>
                   </div>
                   
                   <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight">{course.title}</h4>
                   <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-2">
                     Starts {course.batchStartDate || 'TBA'} • {course.seatsLeft}/{course.totalSeats} Seats Left
                   </p>
                   
                   <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                     <div>
                       {isFlashSaleActive && (
                         <div className="flex items-center gap-1.5 mb-1 px-2 py-0.5 bg-orange-100 text-orange-700 w-fit rounded border border-orange-200">
                           <ClockIcon/>
                           <span className="text-[10px] font-black uppercase tracking-wider tabular-nums">{countdown}</span>
                         </div>
                       )}

                       <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
                         ₹{displayPrice}
                         {isFlashSaleActive && course.price > course.rightNowPrice && (
                            <span className="text-xs font-bold text-slate-400 line-through">₹{course.price}</span>
                         )}
                       </div>

                       {course.originalPrice > displayPrice && (
                         <div className="text-xs font-bold text-slate-400 line-through">MRP: ₹{course.originalPrice}</div>
                       )}
                     </div>
                     
                     {isFlashSaleActive && (
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                          <ZapIcon/>
                        </div>
                     )}
                   </div>

                 </div>
               );
             })}

             {courses.length === 0 && (
               <div className="col-span-full text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                 No courses deployed yet. Create your first one on the left!
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
             <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Delete Course?</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               This action cannot be undone. This will permanently remove the course data and all dynamic pricing logic from the platform.
             </p>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setDeleteConfirmId(null)} 
                 disabled={isDeleting}
                 className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl transition-colors disabled:opacity-50"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmDeleteCourse} 
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