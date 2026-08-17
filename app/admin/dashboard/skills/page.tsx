"use client";
import { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Premium SVG Icons ---
const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
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
  description: '',
  imageUrl: '',
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      const fileRef = ref(storage, `skills/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setFormData({ ...formData, imageUrl: url });
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerEdit = (skill: any) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name || '',
      description: skill.description || '',
      imageUrl: skill.imageUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await fetch('/api/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (editingId === id) cancelEdit();
      await fetchSkills();
    } catch (error) {
      alert("Failed to delete skill.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Please upload a skill image before saving.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...formData, id: editingId ? editingId : undefined };

      await fetch('/api/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchSkills(); 
      cancelEdit(); 
    } catch (error) {
      alert("Failed to save skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
       
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Skills & Specs</h2>
           <p className="text-slate-500 font-medium mt-1">Manage the core competencies, tools, and technologies taught on your platform.</p>
         </div>
       </div>

       {/* STATS BANNER */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Total Skills Tracked</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{skills.length}</h3>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center relative z-10">
              <CpuIcon />
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         
         {/* LEFT COLUMN: Builder Form */}
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sticky top-6">
           <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Skill Definition' : 'Add New Skill'}
             </h3>
             {editingId && (
               <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-6">
             
             {/* Image Upload Area */}
             <div>
               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Skill Icon / Graphic</label>
               <div className="relative w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden group hover:border-indigo-400 transition-colors cursor-pointer">
                 {formData.imageUrl ? (
                   <>
                     <img src={formData.imageUrl} alt="Skill Preview" className="w-full h-full object-contain p-4" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/50 rounded-lg backdrop-blur-sm border border-white/20">Change Image</span>
                     </div>
                   </>
                 ) : (
                   <div className="text-center">
                     <ImageIcon />
                     <p className="text-xs font-bold text-slate-400 mt-2">{isUploading ? 'Uploading...' : 'Click to upload image'}</p>
                   </div>
                 )}
                 <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={isUploading} />
               </div>
             </div>

             <div>
               <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Skill Name</label>
               <input 
                 type="text" 
                 required 
                 value={formData.name} 
                 onChange={e => setFormData({...formData, name: e.target.value})} 
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-900 text-sm" 
                 placeholder="e.g. Generative AI Models" 
               />
             </div>

             <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Brief Description (2 Lines max)</label>
                 <span className={`text-[9px] font-bold ${formData.description.length > 120 ? 'text-red-500' : 'text-slate-400'}`}>
                   {formData.description.length}/120
                 </span>
               </div>
               <textarea 
                 required 
                 rows={2} 
                 maxLength={120}
                 value={formData.description} 
                 onChange={e => setFormData({...formData, description: e.target.value})} 
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-700 text-sm resize-none" 
                 placeholder="A concise, powerful summary of what this skill entails..." 
               />
             </div>

             <button type="submit" disabled={isSubmitting || isUploading} className={`w-full py-4 text-white font-black rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 hover:shadow-indigo-700/30'}`}>
               {isSubmitting ? 'Saving to Database...' : editingId ? 'Update Skill' : 'Publish Skill'}
             </button>
           </form>
         </div>

         {/* RIGHT COLUMN: Skills Grid */}
         <div className="xl:col-span-7">
           <h3 className="text-xl font-bold text-slate-900 mb-6 px-1">Active Skills Directory</h3>
           
           {skills.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
               <CpuIcon />
               <p className="text-slate-500 font-medium mt-4">No skills have been added yet.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {skills.map((skill) => (
                 <div key={skill.id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all relative flex flex-col h-full">
                   
                   {/* Action Buttons (Absolute top right) */}
                   <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm border border-slate-100">
                     <button onClick={() => triggerEdit(skill)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                       <EditIcon />
                     </button>
                     <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                       <TrashIcon />
                     </button>
                   </div>

                   {/* Skill Image */}
                   <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center p-2 mb-4 border border-slate-100">
                     {skill.imageUrl ? (
                       <img src={skill.imageUrl} alt={skill.name} className="w-full h-full object-contain" />
                     ) : (
                       <CpuIcon />
                     )}
                   </div>

                   {/* Skill Text */}
                   <div className="flex-1">
                     <h4 className="font-black text-slate-900 text-lg mb-1 leading-tight">{skill.name}</h4>
                     <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-2">
                       {skill.description}
                     </p>
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