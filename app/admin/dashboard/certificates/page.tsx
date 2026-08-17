"use client";
import { useState, useEffect } from 'react';

// --- Premium SVG Icons ---
const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const ArchiveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
    <polyline points="21 8 21 21 3 21 3 8"></polyline>
    <rect x="1" y="3" width="22" height="5"></rect>
    <line x1="10" y1="12" x2="14" y2="12"></line>
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

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 shrink-0">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const HashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 shrink-0">
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const defaultForm = {
  studentName: '',
  email: '',
  course: '',
  percentage: '',
  issueType: 'Manual Offline', 
  expiryDate: '',
  certificateCode: '', 
};

// --- Unique Credential ID Generator ---
const generateCertificateCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'CERT-';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000); 
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [certRes, courseRes] = await Promise.all([
        fetch('/api/certificates'),
        fetch('/api/courses')
      ]);
      
      setCertificates(await certRes.json());
      setAvailableCourses(await courseRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerEdit = (cert: any) => {
    setEditingId(cert.id);
    setFormData({
      studentName: cert.studentName || '',
      email: cert.email || '',
      course: cert.course || '',
      percentage: cert.percentage || '',
      issueType: cert.issueType || 'Manual Offline',
      expiryDate: cert.expiryDate || '',
      certificateCode: cert.certificateCode || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const confirmDeleteCert = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    
    try {
      await fetch('/api/certificates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmId })
      });
      
      if (editingId === deleteConfirmId) cancelEdit();
      await fetchData(); 
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course) return alert("Please select a target course.");
    setIsSubmitting(true);
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = { 
        ...formData, 
        id: editingId ? editingId : undefined,
        issuedAt: editingId ? undefined : new Date().toISOString(),
        // Only generate a new code if this is a brand new certificate
        certificateCode: editingId ? formData.certificateCode : generateCertificateCode()
      };

      await fetch('/api/certificates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchData(); 
      cancelEdit(); 
    } catch (error) {
      alert("Failed to issue certificate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const evaluateCertStatus = (cert: any) => {
    if (!cert.expiryDate) return 'Active';

    const expiryTime = new Date(cert.expiryDate).getTime() + (24 * 60 * 60 * 1000);
    
    if (currentTime > expiryTime) {
      return 'Expired';
    }
    return 'Active';
  };

  const evaluatedCerts = certificates.map(c => ({ ...c, currentStatus: evaluateCertStatus(c) }));
  const activeCerts = evaluatedCerts.filter(c => c.currentStatus === 'Active');
  const expiredCerts = evaluatedCerts.filter(c => c.currentStatus === 'Expired');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 relative">
       
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Certifications Engine</h2>
           <p className="text-slate-500 font-medium mt-1">Issue manual offline certificates and monitor automated LMS credentials.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-amber-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Total Active Issued</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{activeCerts.length}</h3>
            </div>
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center relative z-10">
              <AwardIcon />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group hover:border-slate-300 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Expired Certificates</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{expiredCerts.length}</h3>
            </div>
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center relative z-10">
              <ArchiveIcon />
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN: Issuance Form */}
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 h-fit">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Credential' : 'Issue New Credential'}
             </h3>
             {editingId && (
               <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             
             <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Student Details</h4>
               
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name (On Certificate)</label>
                 <input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900 text-sm" placeholder="e.g. Rahul Sharma" />
               </div>
               
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                 <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900 text-sm" placeholder="student@example.com" />
               </div>
             </div>

             <div className="space-y-4 p-4 bg-amber-50/30 rounded-2xl border border-amber-100">
               <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-1">Academic Metrics</h4>
               
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Associated Course</label>
                 <select required value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900 text-sm bg-white">
                   <option value="" disabled>Select deployed course...</option>
                   {availableCourses.length === 0 && (
                     <option value="" disabled>No active courses available</option>
                   )}
                   {availableCourses.map((course) => (
                     <option key={course.id} value={course.title}>
                       {course.title}
                     </option>
                   ))}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Score / Percentage</label>
                   <div className="relative">
                     <input type="number" required value={formData.percentage} onChange={e => setFormData({...formData, percentage: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900 text-sm pr-8" placeholder="e.g. 95" />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                   </div>
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Issuance Source</label>
                   <select value={formData.issueType} onChange={e => setFormData({...formData, issueType: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900 text-sm bg-white">
                     <option value="Manual Offline">Manual Offline</option>
                     <option value="Auto LMS">Auto LMS</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Certificate Validity (Expiry Date)</label>
                 <input 
                   type="date" 
                   value={formData.expiryDate} 
                   onChange={e => setFormData({...formData, expiryDate: e.target.value})} 
                   className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-medium text-slate-900 text-sm bg-white" 
                 />
                 <p className="text-[10px] font-bold text-slate-400 mt-1.5">Leave blank for lifetime validity.</p>
               </div>
             </div>

             <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-white font-black rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-slate-900 hover:bg-amber-500 shadow-slate-900/20 hover:shadow-amber-500/30'}`}>
               {isSubmitting ? 'Processing...' : editingId ? 'Update Credential Data' : 'Issue Certificate'}
             </button>
           </form>
         </div>

         <div className="xl:col-span-7 space-y-8">
           
           {/* DASHBOARD 1: ACTIVE ISSUED */}
           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
               Active Valid Certificates
             </h3>
             
             <div className="space-y-4">
               {activeCerts.map((cert) => (
                 <div key={cert.id} className="flex flex-col p-5 border border-slate-200 bg-white rounded-2xl hover:border-amber-300 hover:shadow-sm transition-all gap-4">
                   
                   <div className="flex items-start justify-between">
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-2">
                         {cert.studentName}
                         <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-green-100 text-green-700">
                           VALID
                         </span>
                       </h4>
                       <p className="text-xs font-medium text-slate-500 mt-1">{cert.email}</p>
                       {/* Unique Certificate Code */}
                       {cert.certificateCode && (
                         <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md w-fit border border-indigo-100/50">
                           <HashIcon />
                           {cert.certificateCode}
                         </div>
                       )}
                     </div>
                     
                     <div className="flex items-center gap-1">
                       <button onClick={() => triggerEdit(cert)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit Certificate">
                         <EditIcon />
                       </button>
                       <button onClick={() => setDeleteConfirmId(cert.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Certificate">
                         <TrashIcon />
                       </button>
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-bold text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                     <span className="flex items-start sm:items-center gap-1.5 flex-1">
                       <CheckCircleIcon />
                       <span className="line-clamp-1">{cert.course}</span>
                     </span>
                     <span className="shrink-0 px-2.5 py-1 bg-white border border-amber-200 rounded-lg">
                       Score: {cert.percentage}%
                     </span>
                     <span className={`shrink-0 px-2.5 py-1 rounded-lg ${cert.issueType === 'Auto LMS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                       {cert.issueType}
                     </span>
                   </div>
                   
                 </div>
               ))}

               {activeCerts.length === 0 && (
                 <div className="text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                   No active certificates issued yet.
                 </div>
               )}
             </div>
           </div>

           {/* DASHBOARD 2: EXPIRED CERTS */}
           <div className="bg-slate-50 border border-slate-200 rounded-3xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-slate-300"></span>
               Expired Credentials
             </h3>
             
             <div className="space-y-4">
               {expiredCerts.map((cert) => (
                 <div key={cert.id} className="flex flex-col p-5 border border-slate-200 bg-white rounded-2xl opacity-75 hover:opacity-100 transition-all gap-4">
                   
                   <div className="flex items-start justify-between">
                     <div>
                       <h4 className="font-bold text-slate-500 text-lg leading-tight flex items-center gap-2 line-through decoration-slate-300">
                         {cert.studentName}
                         <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-red-100 text-red-600 no-underline">
                           EXPIRED
                         </span>
                       </h4>
                       <p className="text-xs font-medium text-slate-400 mt-1">{cert.email}</p>
                       {/* Unique Certificate Code */}
                       {cert.certificateCode && (
                         <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md w-fit border border-slate-200">
                           <HashIcon />
                           {cert.certificateCode}
                         </div>
                       )}
                     </div>
                     
                     <div className="flex items-center gap-1">
                       <button onClick={() => triggerEdit(cert)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit Certificate">
                         <EditIcon />
                       </button>
                       <button onClick={() => setDeleteConfirmId(cert.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Certificate">
                         <TrashIcon />
                       </button>
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-bold text-slate-500 bg-slate-100 p-3 rounded-xl border border-slate-200">
                     <span className="flex items-start sm:items-center gap-1.5 flex-1">
                       <ArchiveIcon />
                       <span className="line-clamp-1">{cert.course}</span>
                     </span>
                     <span className="shrink-0 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                       Expired On: {cert.expiryDate}
                     </span>
                   </div>
                   
                 </div>
               ))}

               {expiredCerts.length === 0 && (
                 <div className="text-center py-6 text-slate-400 font-bold text-sm">
                   No expired credentials in the system.
                 </div>
               )}
             </div>
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
             <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Revoke & Delete Certificate?</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               This will permanently erase this credential from the system. If this is an auto-generated LMS certificate, the student will lose their credential record.
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
                 onClick={confirmDeleteCert} 
                 disabled={isDeleting}
                 className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
               >
                 {isDeleting ? 'Erasing...' : 'Yes, Delete'}
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}