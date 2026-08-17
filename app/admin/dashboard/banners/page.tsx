"use client";
import { useState, useEffect } from 'react';

// --- SVG Icons ---
const MegaphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <path d="m3 11 18-5v12L3 14v-3z"></path>
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
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
  text: '',
  isActive: true,
};

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const triggerEdit = (banner: any) => {
    setEditingId(banner.id);
    setFormData({ text: banner.text, isActive: banner.isActive });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this banner message?")) return;
    try {
      await fetch('/api/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (editingId === id) cancelEdit();
      await fetchBanners();
    } catch (error) {
      alert("Failed to delete banner.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...formData, id: editingId ? editingId : undefined };

      await fetch('/api/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchBanners(); 
      cancelEdit(); 
    } catch (error) {
      alert("Failed to save banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = banners.filter(b => b.isActive).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12">
       
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Global Banners</h2>
           <p className="text-slate-500 font-medium mt-1">Manage scrolling announcement texts that appear across the public platform.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Total Announcements</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{banners.length}</h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center relative z-10">
              <MegaphoneIcon />
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-center">
             <div className="relative z-10">
               <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Live on Website</p>
               <h3 className="text-3xl font-black text-white tracking-tight">{activeCount} Currently Scrolling</h3>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* LEFT COLUMN: Builder Form */}
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sticky top-6">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Announcement' : 'Create New Banner'}
             </h3>
             {editingId && (
               <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
             <div>
               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Announcement Text</label>
               <textarea 
                 required 
                 rows={3} 
                 value={formData.text} 
                 onChange={e => setFormData({...formData, text: e.target.value})} 
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-900 text-sm resize-none" 
                 placeholder="e.g. 🚀 Gen AI Cohort starts this Monday! Limited seats available." 
               />
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
               <div>
                 <h4 className="text-sm font-bold text-slate-900">Visibility Status</h4>
                 <p className="text-xs font-medium text-slate-500">Toggle to hide without deleting.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="sr-only peer" />
                 <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
               </label>
             </div>

             <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-white font-black rounded-xl transition-all shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}>
               {isSubmitting ? 'Saving...' : editingId ? 'Update Banner' : 'Publish Banner'}
             </button>
           </form>
         </div>

         {/* RIGHT COLUMN: Directory */}
         <div className="xl:col-span-7 space-y-4">
           {banners.map((banner) => (
             <div key={banner.id} className={`group p-5 border bg-white rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${banner.isActive ? 'border-slate-200 hover:border-blue-300 shadow-sm' : 'border-slate-200 opacity-60'}`}>
               
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                   <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                     {banner.isActive ? 'Active' : 'Hidden'}
                   </span>
                 </div>
                 <p className="font-bold text-slate-900 text-sm leading-relaxed">{banner.text}</p>
               </div>
               
               <div className="flex items-center gap-1 shrink-0">
                 <button onClick={() => triggerEdit(banner)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                   <EditIcon />
                 </button>
                 <button onClick={() => handleDelete(banner.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                   <TrashIcon />
                 </button>
               </div>
               
             </div>
           ))}

           {banners.length === 0 && (
             <div className="text-center py-16 text-slate-500 font-medium bg-slate-50 rounded-3xl border border-dashed border-slate-300">
               No banners configured. Add your first announcement!
             </div>
           )}
         </div>

       </div>
    </div>
  );
}