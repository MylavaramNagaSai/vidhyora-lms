"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

// --- Premium SVG Icons ---
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
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

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UnlockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
  </svg>
);

const DangerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const LibraryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CheckSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 shrink-0">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const SquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);

const defaultForm = {
  studentName: '',
  email: '',
  mobile: '',
  age: '',
  gender: 'Male',
  language: 'English',
  accessType: 'Full Platform Bundle',
  specificCourses: [] as string[],
  duration: 'Lifetime',
  customExpiryDate: '',
  status: 'Active',
  communityAccess: false,
};

export default function LMSAccessManager() {
  const [accessRecords, setAccessRecords] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]); 
  const [totalCourses, setTotalCourses] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000); 
    return () => clearInterval(timer);
  }, []);

  // FIXED: Fetching directly from Firebase Collections
  const fetchData = async () => {
    try {
      // 1. Fetch Students
      const studentsQuery = query(collection(db, 'lms_students'), orderBy('provisionedAt', 'desc'));
      const studentSnap = await getDocs(studentsQuery);
      const fetchedStudents = studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccessRecords(fetchedStudents);

      // 2. Fetch Courses from mediaVaults
      const vaultsQuery = query(collection(db, 'mediaVaults'), orderBy('createdAt', 'desc'));
      const vaultSnap = await getDocs(vaultsQuery);
      const fetchedCourses = vaultSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter out Drafts, only show Published courses as options
      const publishedCourses = fetchedCourses.filter((course: any) => course.status === 'Published');
      setAvailableCourses(publishedCourses);
      setTotalCourses(publishedCourses.length);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerEdit = (record: any) => {
    setEditingId(record.id);
    setFormData({
      studentName: record.studentName || '',
      email: record.email || '',
      mobile: record.mobile || '',
      age: record.age || '',
      gender: record.gender || 'Male',
      language: record.language || 'English',
      accessType: record.accessType || 'Full Platform Bundle',
      specificCourses: record.specificCourses || (record.specificCourse ? [record.specificCourse] : []),
      duration: record.duration || 'Lifetime',
      customExpiryDate: record.customExpiryDate || '',
      status: record.status || 'Active',
      communityAccess: record.communityAccess || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  // FIXED: Real Firebase Delete
  const confirmDeleteRecord = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'lms_students', deleteConfirmId));
      if (editingId === deleteConfirmId) cancelEdit();
      await fetchData(); 
    } catch (error) {
      console.error("Failed to delete student record:", error);
      alert("Error deleting student. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  // FIXED: Real Firebase Status Toggle
  const handleToggleRevoke = async (record: any) => {
    setIsTogglingId(record.id);
    const newStatus = record.status === 'Revoked' ? 'Active' : 'Revoked';
    try {
      const studentRef = doc(db, 'lms_students', record.id);
      await updateDoc(studentRef, { status: newStatus });
      await fetchData();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Error updating status.");
    } finally {
      setIsTogglingId(null);
    }
  };

  const handleCourseToggle = (courseName: string) => {
    setFormData(prev => {
      const courses = prev.specificCourses;
      if (courses.includes(courseName)) {
        return { ...prev, specificCourses: courses.filter(c => c !== courseName) };
      } else {
        return { ...prev, specificCourses: [...courses, courseName] };
      }
    });
  };

  // FIXED: Real Firebase Create / Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.accessType === 'Specific Course' && formData.specificCourses.length === 0) {
      return alert("Please select at least one course.");
    }
    if (formData.duration === 'Manual Date' && !formData.customExpiryDate) {
      return alert("Please select an expiry date.");
    }

    setIsSubmitting(true);
    
    try {
      if (editingId) {
        // Update Existing Student
        const studentRef = doc(db, 'lms_students', editingId);
        await updateDoc(studentRef, { ...formData });
      } else {
        // Create New Student
        await addDoc(collection(db, 'lms_students'), {
          ...formData,
          provisionedAt: serverTimestamp()
        });
      }
      
      await fetchData(); 
      cancelEdit(); 
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const evaluateAccessStatus = (record: any) => {
    if (record.status === 'Revoked') return 'Revoked';
    if (record.duration === 'Lifetime') return 'Active';

    if (record.duration === 'Manual Date' && record.customExpiryDate) {
      const expiryTime = new Date(record.customExpiryDate).getTime() + (24 * 60 * 60 * 1000);
      if (currentTime > expiryTime) return 'Expired';
    }

    return 'Active';
  };

  let daysRemaining = null;
  if (formData.duration === 'Manual Date' && formData.customExpiryDate) {
    const targetDate = new Date(formData.customExpiryDate).getTime() + (24 * 60 * 60 * 1000);
    const diff = targetDate - Date.now();
    daysRemaining = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  const evaluatedRecords = accessRecords.map(r => ({ ...r, currentStatus: evaluateAccessStatus(r) }));
  const activeRecords = evaluatedRecords.filter(r => r.currentStatus === 'Active');
  const revokedRecords = evaluatedRecords.filter(r => r.currentStatus === 'Expired' || r.currentStatus === 'Revoked');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 relative">
       
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">LMS Identity & Access</h2>
           <p className="text-slate-500 font-medium mt-1">Manage student identities, course enrollments, and access control limits.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Registered Students</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{accessRecords.length}</h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center relative z-10">
              <UsersIcon />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex items-center justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Active Course Deployments</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{totalCourses}</h3>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center relative z-10">
              <BookIcon />
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* FORM SECTION */}
         <div className="xl:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 h-fit">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Identity & Access' : 'Register New Student'}
             </h3>
             {editingId && (
               <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-5">
             
             <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Student Identity Data</h4>
               
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                 <input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="e.g. Rahul Sharma" />
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                   <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="student@example.com" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                   <input type="tel" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="+91 9876543210" />
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Age</label>
                   <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="e.g. 24" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                   <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white">
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Language</label>
                   <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white">
                     <option value="English">English</option>
                     <option value="Telugu">Telugu</option>
                   </select>
                 </div>
               </div>
             </div>

             <div className="space-y-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
               <h4 className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-1">Access Configuration</h4>
               
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Access Level</label>
                 <select value={formData.accessType} onChange={e => setFormData({...formData, accessType: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-900 text-sm bg-white">
                   <option value="Full Platform Bundle">Full Platform Bundle</option>
                   <option value="Specific Course">Specific Course (Multi-Select)</option>
                 </select>
               </div>

               {formData.accessType === 'Specific Course' && (
                 <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Target Courses</label>
                   <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                     {availableCourses.length === 0 && (
                       <p className="text-xs font-bold text-slate-400">No active courses deployed yet.</p>
                     )}
                     {availableCourses.map((course) => (
                       <div 
                         key={course.id} 
                         onClick={() => handleCourseToggle(course.name)} // FIXED: course.title to course.name based on LMS Media schema
                         className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer group hover:border-indigo-300 transition-colors"
                       >
                         {formData.specificCourses.includes(course.name) ? <CheckSquareIcon /> : <SquareIcon />}
                         <span className="text-sm font-bold text-slate-700 select-none">{course.name}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Duration & Auto-Expiry</label>
                 <select value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-900 text-sm bg-white">
                   <option value="Lifetime">Lifetime Access</option>
                   <option value="Manual Date">Manual Date (Calendar)</option>
                 </select>
               </div>

               {formData.duration === 'Manual Date' && (
                 <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-3 bg-white border border-indigo-200 rounded-xl">
                   <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-2">Select Expiry Date</label>
                   <input 
                     type="date" 
                     min={new Date().toISOString().split('T')[0]} 
                     value={formData.customExpiryDate} 
                     onChange={e => setFormData({...formData, customExpiryDate: e.target.value})} 
                     className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-900 text-sm" 
                   />
                   {daysRemaining !== null && (
                     <p className={`text-xs font-bold mt-2 text-right ${daysRemaining > 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                       {daysRemaining > 0 ? `Access valid for ${daysRemaining} days` : 'This date has already passed.'}
                     </p>
                   )}
                 </div>
               )}
               
               <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                 <div>
                   <label className="block text-sm font-bold text-emerald-800">Community Access</label>
                   <p className="text-[10px] font-medium text-emerald-600 mt-0.5">Allow student to join and post in the Community Hub.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input 
                     type="checkbox" 
                     checked={formData.communityAccess} 
                     onChange={e => setFormData({...formData, communityAccess: e.target.checked})} 
                     className="sr-only peer" 
                   />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                 </label>
               </div>

             </div>

             <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-white font-black rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}>
               {isSubmitting ? 'Processing...' : editingId ? 'Update Identity & Access' : 'Register Student'}
             </button>
           </form>
         </div>

         <div className="xl:col-span-7 space-y-8">
           
           {/* ACTIVE USERS SECTION */}
           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-slate-900 mb-6">Active Provisioned Users</h3>
             
             <div className="space-y-4">
               {activeRecords.map((record) => (
                 <div key={record.id} className={`flex flex-col p-5 border border-slate-200 bg-white rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all gap-4 ${isTogglingId === record.id ? 'opacity-50 pointer-events-none' : ''}`}>
                   
                   <div className="flex items-start justify-between">
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-2">
                         {record.studentName || 'Unnamed Student'}
                         <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-green-100 text-green-700">
                           {record.currentStatus}
                         </span>
                       </h4>
                       <p className="text-xs font-medium text-slate-500 mt-1">{record.email} • {record.mobile}</p>
                     </div>
                     
                     <div className="flex items-center gap-1">
                       <button onClick={() => triggerEdit(record)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Student">
                         <EditIcon />
                       </button>
                       <button onClick={() => handleToggleRevoke(record)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors" title="Force Revoke Access">
                         <LockIcon />
                       </button>
                       <button onClick={() => setDeleteConfirmId(record.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Student">
                         <TrashIcon />
                       </button>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                     <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">Age: {record.age || '--'}</span>
                     <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">{record.gender || '--'}</span>
                     <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">{record.language || 'English'}</span>
                     
                     {record.communityAccess && (
                       <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg flex items-center gap-1">
                         Community Granted
                       </span>
                     )}
                   </div>

                   <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-bold text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                     <span className="flex items-start sm:items-center gap-1.5 flex-1">
                       <LibraryIcon />
                       <span className="line-clamp-2 leading-relaxed">
                         {record.accessType === 'Full Platform Bundle' 
                           ? 'Full Platform Bundle' 
                           : (record.specificCourses && record.specificCourses.length > 0 ? record.specificCourses.join(', ') : 'No courses selected')}
                       </span>
                     </span>
                     <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 bg-white border border-blue-200 rounded-lg">
                       <ClockIcon /> 
                       {record.duration === 'Manual Date' ? `Until ${record.customExpiryDate}` : record.duration}
                     </span>
                   </div>
                   
                 </div>
               ))}

               {activeRecords.length === 0 && (
                 <div className="text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                   No active student provisions found.
                 </div>
               )}
             </div>
           </div>

           {/* REVOKED & EXPIRED USERS SECTION */}
           <div className="bg-slate-50 border border-slate-200 rounded-3xl shadow-sm p-8">
             <h3 className="text-xl font-bold text-slate-900 mb-6 text-slate-400">Revoked & Expired Access</h3>
             
             <div className="space-y-4">
               {revokedRecords.map((record) => (
                 <div key={record.id} className={`flex flex-col p-5 border border-slate-200 bg-white rounded-2xl opacity-75 hover:opacity-100 transition-all gap-4 ${isTogglingId === record.id ? 'opacity-40 pointer-events-none' : ''}`}>
                   
                   <div className="flex items-start justify-between">
                     <div>
                       <h4 className="font-bold text-slate-500 text-lg leading-tight flex items-center gap-2 line-through decoration-slate-300">
                         {record.studentName || 'Unnamed Student'}
                         <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-red-100 text-red-600 no-underline">
                           {record.currentStatus}
                         </span>
                       </h4>
                       <p className="text-xs font-medium text-slate-400 mt-1">{record.email} • {record.mobile}</p>
                     </div>
                     
                     <div className="flex items-center gap-1">
                       <button onClick={() => triggerEdit(record)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Student">
                         <EditIcon />
                       </button>
                       <button onClick={() => handleToggleRevoke(record)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Restore Access">
                         <UnlockIcon />
                       </button>
                       <button onClick={() => setDeleteConfirmId(record.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Student">
                         <TrashIcon />
                       </button>
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-bold text-slate-500 bg-slate-100 p-3 rounded-xl border border-slate-200">
                     <span className="flex items-start sm:items-center gap-1.5 flex-1">
                       <LibraryIcon />
                       <span className="line-clamp-1">
                         {record.accessType === 'Full Platform Bundle' ? 'Full Platform Bundle' : (record.specificCourses?.join(', ') || 'None')}
                       </span>
                     </span>
                     <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 bg-white border border-slate-200 rounded-lg">
                       <ClockIcon /> 
                       {record.duration === 'Manual Date' ? `Expired: ${record.customExpiryDate}` : record.duration}
                     </span>
                   </div>
                   
                 </div>
               ))}

               {revokedRecords.length === 0 && (
                 <div className="text-center py-6 text-slate-400 font-bold text-sm">
                   No revoked records in the system.
                 </div>
               )}
             </div>
           </div>

         </div>

       </div>

       {/* DELETE CONFIRMATION MODAL */}
       {deleteConfirmId && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5">
               <DangerIcon />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Delete Student Record?</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               This will permanently wipe this student's identity and revoke all active course access across the LMS platform immediately.
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
                 onClick={confirmDeleteRecord} 
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