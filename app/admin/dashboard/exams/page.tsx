"use client";
import { useState, useEffect } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Premium SVG Icons ---
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

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

// --- Data Structures ---
const generateId = () => Math.random().toString(36).substring(2, 9);

const createEmptyQuestion = () => ({
  id: generateId(),
  type: 'MCQ', // 'MCQ' | 'FillBlank'
  text: '',
  mediaUrl: '',
  mediaType: 'none', // 'none' | 'image' | 'audio'
  optA: '', optB: '', optC: '', optD: '',
  correct: 'A' // For MCQ: A,B,C,D. For FillBlank: Exact text.
});

const createEmptyChapter = () => ({
  id: generateId(),
  title: '',
  questions: [createEmptyQuestion()]
});

const defaultForm = {
  title: '',
  courseId: '',
  courseName: '',
  duration: 60,
  passingMarks: 40,
  status: 'Draft',
  chapters: [createEmptyChapter()]
};

export default function ExamBuilderPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingMediaId, setUploadingMediaId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [examRes, courseRes] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/courses')
      ]);
      setExams(await examRes.json());
      setAvailableCourses(await courseRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Dynamic Chapter Handlers ---
  const addChapter = () => {
    setFormData(prev => ({ ...prev, chapters: [...prev.chapters, createEmptyChapter()] }));
  };

  const updateChapterTitle = (cIdx: number, title: string) => {
    const newChapters = [...formData.chapters];
    newChapters[cIdx].title = title;
    setFormData({ ...formData, chapters: newChapters });
  };

  const removeChapter = (cIdx: number) => {
    if (!window.confirm("Delete entire chapter and its questions?")) return;
    const newChapters = formData.chapters.filter((_, i) => i !== cIdx);
    setFormData({ ...formData, chapters: newChapters });
  };

  // --- Dynamic Question Handlers ---
  const addQuestion = (cIdx: number) => {
    const newChapters = [...formData.chapters];
    newChapters[cIdx].questions.push(createEmptyQuestion());
    setFormData({ ...formData, chapters: newChapters });
  };

  const updateQuestion = (cIdx: number, qIdx: number, field: string, value: string) => {
    const newChapters = [...formData.chapters];
    newChapters[cIdx].questions[qIdx] = { ...newChapters[cIdx].questions[qIdx], [field]: value };
    setFormData({ ...formData, chapters: newChapters });
  };

  const removeQuestion = (cIdx: number, qIdx: number) => {
    const newChapters = [...formData.chapters];
    newChapters[cIdx].questions = newChapters[cIdx].questions.filter((_, i) => i !== qIdx);
    setFormData({ ...formData, chapters: newChapters });
  };

  // --- Instant Media Upload Handler ---
  const handleMediaUpload = async (cIdx: number, qIdx: number, file: File) => {
    if (!file) return;
    const qId = formData.chapters[cIdx].questions[qIdx].id;
    setUploadingMediaId(qId);

    try {
      const isAudio = file.type.startsWith('audio');
      const mediaType = isAudio ? 'audio' : 'image';
      const fileRef = ref(storage, `exams/media/${Date.now()}_${file.name}`);
      
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      const newChapters = [...formData.chapters];
      newChapters[cIdx].questions[qIdx].mediaUrl = url;
      newChapters[cIdx].questions[qIdx].mediaType = mediaType;
      setFormData({ ...formData, chapters: newChapters });

    } catch (error) {
      alert("Failed to upload media.");
      console.error(error);
    } finally {
      setUploadingMediaId(null);
    }
  };

  const removeMedia = (cIdx: number, qIdx: number) => {
    const newChapters = [...formData.chapters];
    newChapters[cIdx].questions[qIdx].mediaUrl = '';
    newChapters[cIdx].questions[qIdx].mediaType = 'none';
    setFormData({ ...formData, chapters: newChapters });
  };

  // --- Core CRUD ---
  const triggerEdit = (exam: any) => {
    setEditingId(exam.id);
    setFormData({
      title: exam.title || '',
      courseId: exam.courseId || '',
      courseName: exam.courseName || '',
      duration: exam.duration || 60,
      passingMarks: exam.passingMarks || 40,
      status: exam.status || 'Draft',
      chapters: exam.chapters?.length ? exam.chapters : [createEmptyChapter()]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const confirmDeleteExam = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await fetch('/api/exams', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmId })
      });
      if (editingId === deleteConfirmId) cancelEdit();
      await fetchData(); 
    } catch (error) {
      console.error("Failed to delete exam:", error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId) return alert("Please select a target course.");
    setIsSubmitting(true);
    
    try {
      // Find course name for easy rendering later
      const selectedCourse = availableCourses.find(c => c.id === formData.courseId);
      const payload = { 
        ...formData, 
        courseName: selectedCourse?.title || '',
        id: editingId ? editingId : undefined 
      };

      await fetch('/api/exams', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await fetchData(); 
      cancelEdit(); 
    } catch (error) {
      alert("Failed to publish exam.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-12 relative">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Exam & Assessment Builder</h2>
           <p className="text-slate-500 font-medium mt-1">Design complex, multimedia assessments linked directly to your active courses.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN: Advanced Builder Form */}
         <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 h-fit">
           <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
             <h3 className="text-xl font-bold text-slate-900">
               {editingId ? 'Edit Exam Architecture' : 'Build New Exam Architecture'}
             </h3>
             {editingId && (
               <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                 Cancel Edit
               </button>
             )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-10">
             
             {/* --- CONFIGURATION --- */}
             <div className="space-y-4">
               <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider">Exam Configuration</h4>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Exam Title</label>
                   <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" placeholder="e.g. Final React Assessment" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Target Course Dropdown</label>
                   <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white">
                     <option value="" disabled>Select deployed course...</option>
                     {availableCourses.map((course) => (
                       <option key={course.id} value={course.id}>{course.title}</option>
                     ))}
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Time (Mins)</label>
                   <input type="number" required value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pass Mark (%)</label>
                   <input type="number" required value={formData.passingMarks} onChange={e => setFormData({...formData, passingMarks: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                   <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white">
                     <option value="Draft">Draft</option>
                     <option value="Published">Published</option>
                   </select>
                 </div>
               </div>
             </div>

             {/* --- CHAPTER & QUESTION ENGINE --- */}
             <div className="space-y-6">
               <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Chapter & Question Bank</h4>
                 <button type="button" onClick={addChapter} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                   <PlusIcon /> Add Chapter
                 </button>
               </div>
               
               {formData.chapters.map((chapter, cIdx) => (
                 <div key={chapter.id} className="p-5 bg-slate-50 border border-slate-200 rounded-3xl relative">
                   
                   {/* Chapter Header */}
                   <div className="flex items-center gap-4 mb-6">
                     <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                       C{cIdx + 1}
                     </div>
                     <input type="text" required value={chapter.title} onChange={e => updateChapterTitle(cIdx, e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-900 text-sm" placeholder="Chapter Name (e.g. Fundamental Concepts)" />
                     
                     <button type="button" onClick={() => removeChapter(cIdx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0" title="Delete Chapter">
                       <TrashIcon />
                     </button>
                   </div>

                   {/* Questions Loop */}
                   <div className="space-y-5 pl-4 sm:pl-12">
                     {chapter.questions.map((q, qIdx) => (
                       <div key={q.id} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm relative">
                         
                         <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                           <div className="flex items-center gap-3">
                             <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">Q {qIdx + 1}</span>
                             <select value={q.type} onChange={e => updateQuestion(cIdx, qIdx, 'type', e.target.value)} className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer">
                               <option value="MCQ">Multiple Choice (MCQ)</option>
                               <option value="FillBlank">Fill in the Blanks</option>
                             </select>
                           </div>
                           
                           {/* Action Bar: Media Upload & Delete */}
                           <div className="flex items-center gap-2">
                             <label className="cursor-pointer p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Attach Media (Image/Audio)">
                               {uploadingMediaId === q.id ? (
                                 <div className="w-3 h-3 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                               ) : (
                                 <>
                                   <input type="file" accept="image/*, audio/*" className="hidden" onChange={(e) => { if(e.target.files && e.target.files[0]) handleMediaUpload(cIdx, qIdx, e.target.files[0]) }} />
                                   <ImageIcon />
                                 </>
                               )}
                             </label>
                             
                             <button type="button" onClick={() => removeQuestion(cIdx, qIdx)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete Question">
                               <TrashIcon />
                             </button>
                           </div>
                         </div>

                         {/* Active Media Preview */}
                         {q.mediaUrl && (
                           <div className="mb-4 relative w-fit group">
                             {q.mediaType === 'image' ? (
                               <img src={q.mediaUrl} alt="Question Media" className="h-32 rounded-lg border border-slate-200 object-cover" />
                             ) : (
                               <audio controls src={q.mediaUrl} className="h-10"></audio>
                             )}
                             <button type="button" onClick={() => removeMedia(cIdx, qIdx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md">✕</button>
                           </div>
                         )}

                         <div className="mb-4">
                           <textarea required rows={2} value={q.text} onChange={e => updateQuestion(cIdx, qIdx, 'text', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm resize-none" placeholder={q.type === 'FillBlank' ? "Enter statement with ______ for the blank..." : "Enter your question here..."}></textarea>
                         </div>

                         {/* Dynamic Answer Fields */}
                         {q.type === 'MCQ' ? (
                           <>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                               <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                 <span className="text-xs font-black text-slate-400 w-4 text-center">A</span>
                                 <input type="text" required value={q.optA} onChange={e => updateQuestion(cIdx, qIdx, 'optA', e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium text-slate-900" placeholder="Option A" />
                               </div>
                               <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                 <span className="text-xs font-black text-slate-400 w-4 text-center">B</span>
                                 <input type="text" required value={q.optB} onChange={e => updateQuestion(cIdx, qIdx, 'optB', e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium text-slate-900" placeholder="Option B" />
                               </div>
                               <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                 <span className="text-xs font-black text-slate-400 w-4 text-center">C</span>
                                 <input type="text" required value={q.optC} onChange={e => updateQuestion(cIdx, qIdx, 'optC', e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium text-slate-900" placeholder="Option C" />
                               </div>
                               <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                 <span className="text-xs font-black text-slate-400 w-4 text-center">D</span>
                                 <input type="text" required value={q.optD} onChange={e => updateQuestion(cIdx, qIdx, 'optD', e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium text-slate-900" placeholder="Option D" />
                               </div>
                             </div>
                             <div className="flex items-center gap-4 bg-green-50 p-3 rounded-xl border border-green-100">
                               <label className="text-xs font-bold text-green-800 uppercase tracking-wider shrink-0">Correct Answer:</label>
                               <select value={q.correct} onChange={e => updateQuestion(cIdx, qIdx, 'correct', e.target.value)} className="w-full bg-transparent outline-none font-black text-green-700 text-sm cursor-pointer">
                                 <option value="A">Option A</option>
                                 <option value="B">Option B</option>
                                 <option value="C">Option C</option>
                                 <option value="D">Option D</option>
                               </select>
                             </div>
                           </>
                         ) : (
                           <div className="flex items-center gap-4 bg-green-50 p-3 rounded-xl border border-green-100">
                             <label className="text-xs font-bold text-green-800 uppercase tracking-wider shrink-0">Exact Answer:</label>
                             <input type="text" required value={q.correct} onChange={e => updateQuestion(cIdx, qIdx, 'correct', e.target.value)} className="w-full bg-transparent outline-none font-black text-green-700 text-sm" placeholder="Type the exact word for the blank..." />
                           </div>
                         )}

                       </div>
                     ))}
                     
                     {/* Add Question Button */}
                     <button type="button" onClick={() => addQuestion(cIdx)} className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors border border-indigo-100 border-dashed">
                       <PlusIcon /> Add Question to Chapter {cIdx + 1}
                     </button>
                   </div>

                 </div>
               ))}
             </div>

             <button type="submit" disabled={isSubmitting} className={`w-full py-5 text-white font-black rounded-xl transition-all disabled:opacity-50 mt-4 shadow-xl ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-slate-900 hover:bg-blue-600 shadow-slate-900/20 hover:shadow-blue-600/30'}`}>
               {isSubmitting ? 'Processing Assessment...' : editingId ? 'Update Exam Architecture' : 'Deploy Exam Assessment'}
             </button>
           </form>
         </div>

         {/* RIGHT COLUMN: Exam Directory */}
         <div className="lg:col-span-4 space-y-6">
           <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">
             <h3 className="text-xl font-bold text-slate-900 mb-6">Deployed Exams</h3>
             
             <div className="space-y-4">
               {exams.map((exam) => {
                 // Calculate total questions across all chapters
                 const totalQs = exam.chapters ? exam.chapters.reduce((acc: number, chap: any) => acc + (chap.questions?.length || 0), 0) : 0;
                 const totalChaps = exam.chapters?.length || 0;

                 return (
                   <div key={exam.id} className="p-5 border border-slate-200 bg-white rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all flex flex-col group">
                     
                     <div className="flex items-start justify-between mb-3">
                       <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md ${
                         exam.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                       }`}>
                         {exam.status}
                       </span>
                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => triggerEdit(exam)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit Exam">
                           <EditIcon />
                         </button>
                         <button onClick={() => setDeleteConfirmId(exam.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Exam">
                           <TrashIcon />
                         </button>
                       </div>
                     </div>
                     
                     <h4 className="font-bold text-slate-900 text-lg mb-1 leading-tight">{exam.title}</h4>
                     <p className="text-[11px] font-bold text-blue-600 mb-5 bg-blue-50 w-fit px-2 py-0.5 rounded border border-blue-100 line-clamp-1">{exam.courseName || exam.courseId}</p>
                     
                     <div className="grid grid-cols-3 gap-2 mt-auto">
                       <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                         <div className="text-[9px] font-black text-slate-400 uppercase">Chapters</div>
                         <div className="text-xs font-bold text-slate-700">{totalChaps}</div>
                       </div>
                       <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                         <div className="text-[9px] font-black text-slate-400 uppercase">Questions</div>
                         <div className="text-xs font-bold text-slate-700">{totalQs}</div>
                       </div>
                       <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                         <div className="text-[9px] font-black text-slate-400 uppercase">Duration</div>
                         <div className="text-xs font-bold text-slate-700">{exam.duration}m</div>
                       </div>
                     </div>

                   </div>
                 );
               })}

               {exams.length === 0 && (
                 <div className="text-center py-12 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                   No exams built yet. Create your first assessment!
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
             <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Delete Assessment?</h3>
             <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
               This will permanently erase the entire exam architecture, including all chapters, nested questions, and associated media links.
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
                 onClick={confirmDeleteExam} 
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