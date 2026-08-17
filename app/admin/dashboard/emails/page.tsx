"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase"; 
import { 
  collection, getDocs, addDoc, deleteDoc, doc, 
  serverTimestamp, query, orderBy 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, Mail, Users, Image as ImageIcon, Send } from "lucide-react";
import Image from "next/image";

// --- Premium SVG Icons ---
const CheckSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0">
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);

const SquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-blue-400 transition-colors shrink-0">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
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

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const DangerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

interface AppUser {
  id: string;
  email: string;
  name?: string;
}

interface Campaign {
  id: string;
  subject: string;
  message: string;
  imageUrl: string | null;
  recipients: string[];
  createdAt: any;
}

export default function EmailCampaignsPage() {
  // --- STATE: Users & Selection ---
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // --- STATE: Campaign Form ---
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
  // --- STATE: History & UI ---
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE: Premium Modals ---
  const [notification, setNotification] = useState<{type: 'success' | 'error', title: string, message: string} | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      // 1. Fetch Registered Users directly from your LMS API
      const lmsRes = await fetch('/api/lms-access');
      if (lmsRes.ok) {
        const lmsData = await lmsRes.json();
        // Map LMS records to AppUser format, filtering out any without emails
        const formattedUsers = lmsData
          .filter((record: any) => record.email) 
          .map((record: any) => ({
            id: record.id,
            email: record.email,
            name: record.studentName || 'Unnamed Student'
          }));
        setUsers(formattedUsers);
      }

      // 2. Fetch Campaign History from Firebase
      const campQuery = query(collection(db, "email_campaigns"), orderBy("createdAt", "desc"));
      const campSnap = await getDocs(campQuery);
      setCampaigns(campSnap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign)));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // --- HANDLERS: User Selection ---
  const toggleUser = (email: string) => {
    setSelectedUsers(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(users.map(u => u.email)); // Select all
    }
  };

  // --- HANDLERS: Media Upload ---
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  // --- SUBMIT: Save & Dispatch Campaign ---
  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Premium Validation UI
    if (selectedUsers.length === 0) {
      setNotification({ type: 'error', title: 'Missing Recipients', message: 'Please select at least one student to receive this campaign.' });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setNotification({ type: 'error', title: 'Missing Fields', message: 'Both the Subject Line and Message Content are required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageUrl = null;

      // 1. Upload Media to Firebase Storage if exists
      if (mediaFile) {
        const storageRef = ref(storage, `campaign_media/${Date.now()}_${mediaFile.name}`);
        const snapshot = await uploadBytes(storageRef, mediaFile);
        uploadedImageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Save Campaign details to Firestore
      const newCampaign = {
        subject,
        message,
        imageUrl: uploadedImageUrl,
        recipients: selectedUsers,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "email_campaigns"), newCampaign);
      
      // 3. Update UI instantly
      setCampaigns([{ id: docRef.id, ...newCampaign, createdAt: new Date() } as any, ...campaigns]);
      
      // 4. TRIGGER THE BACKEND API TO DISPATCH EMAILS
      const response = await fetch('/api/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign)
      });

      if (!response.ok) {
        throw new Error("Backend API failed to dispatch emails.");
      }

      // 5. Reset Form on Success
      setSubject("");
      setMessage("");
      setMediaFile(null);
      setMediaPreview(null);
      setSelectedUsers([]);
      
      // Trigger Premium Success UI
      setNotification({ 
        type: 'success', 
        title: 'Broadcast Dispatched!', 
        message: 'Your campaign has been saved and the emails are currently being delivered to your students.' 
      });

    } catch (error) {
      console.error("Error saving campaign:", error);
      setNotification({ 
        type: 'error', 
        title: 'Dispatch Failed', 
        message: 'There was a critical error communicating with the mail server. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE: Remove Campaign ---
  const confirmDeleteRecord = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "email_campaigns", deleteConfirmId));
      setCampaigns(campaigns.filter(c => c.id !== deleteConfirmId));
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setNotification({ type: 'error', title: 'Deletion Failed', message: 'Could not delete the campaign record.' });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  if (isFetching) {
    return <div className="flex items-center justify-center h-full w-full py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 relative">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Mail className="w-8 h-8 text-blue-600" strokeWidth={2.5} /> 
            Email Campaigns
          </h2>
          <p className="text-slate-500 font-medium mt-1">Draft promotional emails and broadcast them to your LMS students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: DRAFT CAMPAIGN */}
        <div className="xl:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm p-8 h-fit relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">Draft New Campaign</h3>
          
          <form onSubmit={handleSendCampaign} className="space-y-6 relative z-10">
            
            {/* User Selection Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" /> Select Recipients ({selectedUsers.length}/{users.length})
                </label>
                <button type="button" onClick={toggleAllUsers} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors">
                  {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="h-48 overflow-y-auto bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-2 custom-scrollbar">
                {users.length === 0 ? (
                  <p className="text-xs font-bold text-slate-400 p-2">No registered students found in LMS.</p>
                ) : (
                  users.map(user => (
                    <div 
                      key={user.id}
                      onClick={() => toggleUser(user.email)}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl cursor-pointer group hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      {selectedUsers.includes(user.email) ? <CheckSquareIcon /> : <SquareIcon />}
                      <div className="flex flex-col select-none">
                        <span className="text-sm font-bold text-slate-700">{user.name}</span>
                        <span className="text-xs font-medium text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Subject Line</label>
              <input 
                required type="text" placeholder="e.g. Huge Summer Sale on Courses!" 
                value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm"
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Image (Optional)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-colors shrink-0 w-32 h-32">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
                    <span className="text-xs font-bold">Upload</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleMediaChange} className="hidden" />
                </label>
                {mediaPreview && (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <Image src={mediaPreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Message Content</label>
              <textarea 
                required rows={6} placeholder="Type your email message here. This will be injected into your master email template..." 
                value={message} onChange={e => setMessage(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm resize-none custom-scrollbar"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Dispatch Broadcast</>}
            </button>
          </form>
        </div>


        {/* RIGHT COLUMN: CAMPAIGN HISTORY */}
        <div className="xl:col-span-5 flex flex-col h-[calc(100vh-8rem)] sticky top-24">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-slate-100 shrink-0 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Campaign History</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Previously saved broadcasts.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
              {campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                  <Mail className="w-12 h-12 mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-bold">No campaigns sent yet.</p>
                </div>
              ) : (
                campaigns.map(camp => (
                  <div key={camp.id} className="group relative border border-slate-200 bg-white rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                    
                    <button 
                      onClick={() => setDeleteConfirmId(camp.id)} 
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Campaign"
                    >
                      <TrashIcon />
                    </button>
                    
                    <div className="flex items-start gap-4 pr-8">
                      {camp.imageUrl ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                          <Image src={camp.imageUrl} alt="Campaign Thumbnail" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                          <ImageIcon className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
                        </div>
                      )}
                      
                      <div className="flex flex-col overflow-hidden">
                        <h4 className="text-base font-bold text-slate-900 truncate">{camp.subject}</h4>
                        <span className="inline-block w-fit px-2 py-0.5 mt-1 text-[9px] font-black uppercase tracking-wider rounded-md bg-blue-100 text-blue-700">
                          Sent to {camp.recipients?.length || 0} users
                        </span>
                        <p className="text-xs font-medium text-slate-500 mt-3 line-clamp-2 leading-relaxed">{camp.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* --- PREMIUM UI NOTIFICATION MODAL --- */}
      {notification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-5 ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {notification.type === 'success' ? <SuccessIcon /> : <DangerIcon />}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{notification.title}</h3>
            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className={`w-full py-3.5 text-white font-black text-sm rounded-xl transition-colors shadow-lg ${notification.type === 'success' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* --- PREMIUM UI DELETE CONFIRMATION MODAL --- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <DangerIcon />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Delete Campaign?</h3>
            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
              This will permanently erase this campaign record from your history. This action cannot be undone.
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