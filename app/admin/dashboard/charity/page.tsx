"use client";
import { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Premium SVG Icons ---
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const CoinsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <circle cx="8" cy="8" r="6"></circle>
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
    <path d="M7 6h1v4"></path>
    <path d="m16.71 13.88.7.71-2.82 2.82"></path>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
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

// --- Interfaces & Defaults ---
interface MediaItem {
  type: 'image' | 'video';
  url: string;
  isCover: boolean;
}

interface ReceiptItem {
  fileName: string;
  url: string;
}

const defaultForm = {
  title: '',
  date: '',
  amountSpent: '',
  category: 'Education Support',
  description: '',
  status: 'Draft',
  media: [] as MediaItem[],
  internalReceipts: [] as ReceiptItem[],
};

export default function CharityTrackerPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/charity');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch charity events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- Calculations ---
  const totalSpent = events.reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);
  const publishedCount = events.filter(e => e.status === 'Published').length;

  // --- Handlers ---
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    try {
      const newMedia = [...formData.media];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const isVideo = file.type.startsWith('video');
        const fileRef = ref(storage, `charity/media/${Date.now()}_${file.name}`);
        
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        
        // Auto-set the first uploaded image as cover
        const hasCover = newMedia.some(m => m.isCover);
        newMedia.push({
          type: isVideo ? 'video' : 'image',
          url,
          isCover: !isVideo && !hasCover
        });
      }
      setFormData({ ...formData, media: newMedia });
    } catch (error) {
      alert("Failed to upload media.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    try {
      const newReceipts = [...formData.internalReceipts];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const fileRef = ref(storage, `charity/vault/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        newReceipts.push({ fileName: file.name, url });
      }
      setFormData({ ...formData, internalReceipts: newReceipts });
    } catch (error) {
      alert("Failed to upload receipt.");
    } finally {
      setIsUploading(false);
    }
  };

  const setCoverPhoto = (index: number) => {
    const newMedia = formData.media.map((m, i) => ({
      ...m,
      isCover: i === index && m.type === 'image'
    }));
    setFormData({ ...formData, media: newMedia });
  };

  const removeMedia = (index: number) => {
    const newMedia = formData.media.filter((_, i) => i !== index);
    if (newMedia.length > 0 && formData.media[index].isCover) {
      const firstImage = newMedia.find(m => m.type === 'image');
      if (firstImage) firstImage.isCover = true;
    }
    setFormData({ ...formData, media: newMedia });
  };

  const removeReceipt = (index: number) => {
    const newReceipts = formData.internalReceipts.filter((_, i) => i !== index);
    setFormData({ ...formData, internalReceipts: newReceipts });
  };

  const triggerEdit = (eventRecord: any) => {
    setEditingId(eventRecord.id);
    setFormData({
      title: eventRecord.title || '',
      date: eventRecord.date || '',
      amountSpent: eventRecord.amountSpent || '',
      category: eventRecord.category || 'Education Support',
      description: eventRecord.description || '',
      status: eventRecord.status || 'Draft',
      media: eventRecord.media || [],
      internalReceipts: eventRecord.internalReceipts || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this charity event and all associated records?")) return;
    try {
      await fetch('/api/charity', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (editingId === id) cancelEdit();
      await fetchEvents();
    } catch (error) {
      alert("Failed to delete event.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...formData, id: editingId ? editingId : undefined };

      await fetch('/api/charity', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchEvents(); 
      cancelEdit(); 
    } catch (error) {
      alert("Failed to save charity event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
       
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Charity & Impact Tracker</h2>
           <p className="text-slate-500 font-medium mt-1">Log philanthropic events, manage media galleries, and securely store financial audits.</p>
         </div>
       </div>

       {/* GLOBAL IMPACT METRICS */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Total Events Executed</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{events.length}</h3>
            </div>
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center relative z-10">
              <HeartIcon />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Total Lifetime Donations</p>
              <h3 className="text-3xl font-black text-emerald-600 tracking-tight flex items-center">
                <span className="text-xl mr-1 font-bold text-emerald-400">₹</span>{totalSpent.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center relative z-10">
              <CoinsIcon />
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-center">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:12px_12px]"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Public Visibility</p>
                <h3 className="text-2xl font-black text-white tracking-tight">{publishedCount} Published</h3>
                <p className="text-xs font-medium text-slate-300 mt-1">{events.length - publishedCount} stored in drafts</p>
              </div>
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN: Event Builder Form */}
         <div className="xl:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 h-fit">
           <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Charity Event' : 'Log New Impact Event'}
             </h3>
             {editingId && (
               <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
             
             {/* Core Details */}
             <div className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="sm:col-span-2">
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
                   <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none font-bold text-slate-900 text-sm" placeholder="e.g. Rural School Tech Setup" />
                 </div>
                 
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Execution Date</label>
                   <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none font-bold text-slate-900 text-sm bg-white" />
                 </div>

                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Amount Spent (₹)</label>
                   <input type="number" required value={formData.amountSpent} onChange={e => setFormData({...formData, amountSpent: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-black text-emerald-700 text-sm bg-emerald-50/30" placeholder="e.g. 50000" />
                 </div>

                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Categorization</label>
                   <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none font-bold text-slate-900 text-sm bg-white">
                     <option value="Education Support">Education Support</option>
                     <option value="Tech Accessibility">Tech Accessibility</option>
                     <option value="Food & Shelter">Food & Shelter</option>
                     <option value="Disaster Relief">Disaster Relief</option>
                     <option value="Health & Wellness">Health & Wellness</option>
                     <option value="Other Impact">Other Impact</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Visibility Status</label>
                   <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none font-bold text-slate-900 text-sm bg-white">
                     <option value="Draft">Draft (Hidden from Public)</option>
                     <option value="Published">Published (Live on Website)</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Event Narrative & Description</label>
                 <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none font-medium text-slate-700 text-sm resize-none" placeholder="Detail the impact made, people helped, and resources deployed..."></textarea>
               </div>
             </div>

             {/* Advanced Media Gallery */}
             <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
               <div className="flex items-center justify-between">
                 <h4 className="text-sm font-black text-slate-900 flex items-center gap-2"><ImageIcon /> Public Media Gallery</h4>
                 <label className="cursor-pointer bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                   {isUploading ? 'Uploading...' : '+ Upload Photos/Videos'}
                   <input type="file" multiple accept="image/*, video/*" className="hidden" onChange={handleMediaUpload} disabled={isUploading} />
                 </label>
               </div>

               {formData.media.length > 0 && (
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {formData.media.map((m, idx) => (
                     <div key={idx} className={`relative group rounded-xl overflow-hidden border-2 transition-all h-24 bg-black ${m.isCover ? 'border-blue-500 shadow-md' : 'border-transparent'}`}>
                       {m.type === 'video' ? (
                         <video src={m.url} className="w-full h-full object-cover opacity-80" />
                       ) : (
                         <img src={m.url} className="w-full h-full object-cover" />
                       )}
                       
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                         {m.type === 'image' && !m.isCover && (
                           <button type="button" onClick={() => setCoverPhoto(idx)} className="text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-1 rounded">Set Cover</button>
                         )}
                         <button type="button" onClick={() => removeMedia(idx)} className="text-[9px] font-black uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">Remove</button>
                       </div>
                       
                       {m.isCover && (
                         <div className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">Cover</div>
                       )}
                     </div>
                   ))}
                 </div>
               )}
               {formData.media.length === 0 && <p className="text-xs font-medium text-slate-500">No media uploaded yet. Images will appear on the public charity page.</p>}
             </div>

             {/* Internal Audit Vault */}
             <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-4">
               <div className="flex items-center justify-between">
                 <div>
                   <h4 className="text-sm font-black text-amber-900 flex items-center gap-2"><FileIcon /> Internal Audit Vault</h4>
                   <p className="text-[10px] font-bold text-amber-700/70 mt-1">Upload private invoices/receipts here. Never visible to the public.</p>
                 </div>
                 <label className="cursor-pointer bg-white border border-amber-200 hover:border-amber-300 text-amber-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shrink-0">
                   {isUploading ? 'Uploading...' : 'Secure Upload'}
                   <input type="file" multiple accept=".pdf, image/*" className="hidden" onChange={handleReceiptUpload} disabled={isUploading} />
                 </label>
               </div>

               {formData.internalReceipts.length > 0 && (
                 <div className="space-y-2">
                   {formData.internalReceipts.map((receipt, idx) => (
                     <div key={idx} className="flex items-center justify-between bg-white border border-amber-100 p-2.5 rounded-lg">
                       <span className="text-xs font-bold text-slate-700 truncate mr-4 flex items-center gap-2">
                         <FileIcon /> {receipt.fileName}
                       </span>
                       <button type="button" onClick={() => removeReceipt(idx)} className="text-red-500 hover:text-red-700 p-1">
                         <TrashIcon />
                       </button>
                     </div>
                   ))}
                 </div>
               )}
             </div>

             <button type="submit" disabled={isSubmitting || isUploading} className={`w-full py-4 text-white font-black rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-slate-900 hover:bg-rose-500 shadow-slate-900/20 hover:shadow-rose-500/30'}`}>
               {isSubmitting ? 'Saving to Database...' : editingId ? 'Update Charity Record' : 'Publish Impact Event'}
             </button>
           </form>
         </div>

         {/* RIGHT COLUMN: Event Directory */}
         <div className="xl:col-span-5 space-y-6">
           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-slate-900 mb-6">Event Directory</h3>
             
             <div className="space-y-4">
               {events.map((eventRecord) => {
                 const coverImage = eventRecord.media?.find((m: MediaItem) => m.isCover)?.url || eventRecord.media?.[0]?.url;
                 
                 return (
                   <div key={eventRecord.id} className="group p-4 border border-slate-200 bg-white rounded-2xl hover:border-rose-300 hover:shadow-md transition-all flex gap-4">
                     
                     {/* Mini Cover Thumbnail */}
                     <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                       {coverImage ? (
                         <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon /></div>
                       )}
                     </div>

                     <div className="flex-1 flex flex-col justify-between min-w-0">
                       <div>
                         <div className="flex items-start justify-between gap-2">
                           <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">{eventRecord.title}</h4>
                           <span className={`shrink-0 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${eventRecord.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                             {eventRecord.status}
                           </span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(eventRecord.date).toLocaleDateString()} • {eventRecord.category}</p>
                       </div>
                       
                       <div className="flex items-center justify-between mt-2">
                         <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                           ₹{Number(eventRecord.amountSpent).toLocaleString('en-IN')}
                         </span>
                         
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => triggerEdit(eventRecord)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Record">
                             <EditIcon />
                           </button>
                           <button onClick={() => handleDelete(eventRecord.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Record">
                             <TrashIcon />
                           </button>
                         </div>
                       </div>
                     </div>
                     
                   </div>
                 );
               })}

               {events.length === 0 && (
                 <div className="text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                   No charity events logged yet. Start tracking your impact!
                 </div>
               )}
             </div>
           </div>
         </div>

       </div>
    </div>
  );
}