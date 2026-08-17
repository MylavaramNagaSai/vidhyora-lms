"use client";
import { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Premium SVG Icons ---
const ImagePlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <circle cx="9" cy="9" r="2"></circle>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

const defaultForm = {
  name: '',
  imageUrl: '',
  linkUrl: '',
  startDate: '', // Format: YYYY-MM-DDThh:mm
  endDate: '',   // Format: YYYY-MM-DDThh:mm
  isActive: true,
};

export default function PopupsPage() {
  const [popups, setPopups] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPopups = async () => {
    try {
      const res = await fetch('/api/popups');
      const data = await res.json();
      setPopups(data);
    } catch (error) {
      console.error("Failed to fetch popups:", error);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const fileRef = ref(storage, `popups/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setFormData({ ...formData, imageUrl: url });
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerEdit = (popup: any) => {
    setEditingId(popup.id);
    setFormData({
      name: popup.name || '',
      imageUrl: popup.imageUrl || '',
      linkUrl: popup.linkUrl || '',
      startDate: popup.startDate || '',
      endDate: popup.endDate || '',
      isActive: popup.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this popup?")) return;
    try {
      await fetch('/api/popups', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (editingId === id) cancelEdit();
      await fetchPopups();
    } catch (error) {
      alert("Failed to delete popup.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Please upload a popup image.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...formData, id: editingId ? editingId : undefined };

      await fetch('/api/popups', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchPopups(); 
      cancelEdit(); 
    } catch (error) {
      alert("Failed to save popup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to determine status
  const getStatus = (popup: any) => {
    if (!popup.isActive) return { label: 'Disabled', color: 'bg-slate-100 text-slate-600' };
    const now = new Date().getTime();
    const start = new Date(popup.startDate).getTime();
    const end = new Date(popup.endDate).getTime();
    
    if (now < start) return { label: 'Scheduled', color: 'bg-amber-100 text-amber-700' };
    if (now > end) return { label: 'Expired', color: 'bg-red-100 text-red-700' };
    return { label: 'Active Now', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
       
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Home Screen Popups</h2>
           <p className="text-slate-500 font-medium mt-1">Schedule and manage promotional images that appear when users visit the website.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* LEFT COLUMN: Builder Form */}
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sticky top-6">
           <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Popup Schedule' : 'Create New Popup'}
             </h3>
             {editingId && (
               <button type="button" onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
             
             {/* Image Upload Area */}
             <div>
               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Popup Artwork (Image)</label>
               <div className="relative w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden group hover:border-violet-400 transition-colors cursor-pointer">
                 {formData.imageUrl ? (
                   <>
                     <img src={formData.imageUrl} alt="Popup Preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-white text-xs font-bold px-4 py-2 bg-black/60 rounded-lg backdrop-blur-md">Change Image</span>
                     </div>
                   </>
                 ) : (
                   <div className="text-center flex flex-col items-center">
                     <ImagePlusIcon />
                     <p className="text-xs font-bold text-slate-400 mt-2">{isUploading ? 'Uploading...' : 'Click to upload flyer/banner'}</p>
                   </div>
                 )}
                 <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={isUploading} />
               </div>
             </div>

             <div>
               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Reference Name</label>
               <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 outline-none font-bold text-slate-900 text-sm" placeholder="e.g. New Course Launch" />
             </div>

             <div>
               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Redirect Link (Optional)</label>
               <input type="url" value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 outline-none font-medium text-slate-700 text-sm" placeholder="https://vidhyora.com/courses/..." />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date & Time</label>
                 <input type="datetime-local" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:border-violet-500 outline-none font-bold text-slate-700 text-xs bg-white" />
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">End Date & Time</label>
                 <input type="datetime-local" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:border-violet-500 outline-none font-bold text-slate-700 text-xs bg-white" />
               </div>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
               <div>
                 <h4 className="text-sm font-bold text-slate-900">Enable Popup</h4>
                 <p className="text-xs font-medium text-slate-500">Toggle off to instantly pause this campaign.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="sr-only peer" />
                 <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
               </label>
             </div>

             <button type="submit" disabled={isSubmitting || isUploading} className={`w-full py-4 text-white font-black rounded-xl transition-all shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20'}`}>
               {isSubmitting ? 'Saving...' : editingId ? 'Update Schedule' : 'Schedule Popup'}
             </button>
           </form>
         </div>

         {/* RIGHT COLUMN: Directory */}
         <div className="xl:col-span-7">
           <h3 className="text-xl font-bold text-slate-900 mb-6 px-1">Campaign History</h3>
           
           {popups.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
               <ImagePlusIcon />
               <p className="text-slate-500 font-medium mt-4">No popups scheduled yet.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {popups.map((popup) => {
                 const status = getStatus(popup);
                 
                 return (
                   <div key={popup.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-300 hover:shadow-md transition-all relative flex flex-col h-full">
                     
                     <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm border border-slate-100 z-10">
                       <button onClick={() => triggerEdit(popup)} className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors">
                         <EditIcon />
                       </button>
                       <button onClick={() => handleDelete(popup.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                         <TrashIcon />
                       </button>
                     </div>

                     <div className="h-32 w-full bg-slate-100 relative">
                       <img src={popup.imageUrl} alt={popup.name} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <span className={`absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border border-white/20 shadow-sm ${status.color}`}>
                         {status.label}
                       </span>
                     </div>

                     <div className="p-4 flex-1 flex flex-col">
                       <h4 className="font-black text-slate-900 text-[15px] mb-3">{popup.name}</h4>
                       
                       <div className="mt-auto space-y-1.5">
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                           <ClockIcon /> 
                           <span>Starts: {new Date(popup.startDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                           <ClockIcon /> 
                           <span>Ends: {new Date(popup.endDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
         </div>

       </div>
    </div>
  );
}