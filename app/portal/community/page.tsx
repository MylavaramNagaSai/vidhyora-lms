"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, where, getDocs } from "firebase/firestore";
import Link from "next/link";

import StudentPostCard from "./components/StudentPostCard";
import CreatePostStudent from "./components/CreatePostStudent";
import RoomsSidebar from "./components/RoomsSidebar";
import { Post, CurrentUser } from "./types";

const LockIconLg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 mb-4 mx-auto"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default function StudentCommunityPage() {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>("global");
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'feed' | 'pending' | 'approved'>('feed');

  // Posts State
  const [globalFeedPosts, setGlobalFeedPosts] = useState<Post[]>([]);
  const [myPendingPosts, setMyPendingPosts] = useState<Post[]>([]);
  const [myApprovedPosts, setMyApprovedPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // 1. Auth and Room Fetch
  useEffect(() => {
    const authAndFetch = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) return router.push('/login');
        const { email } = await authRes.json();

        const studentQ = query(collection(db, 'lms_students'), where('email', '==', email));
        const studentSnap = await getDocs(studentQ);
        
        if (studentSnap.empty || studentSnap.docs[0].data().communityAccess !== true) {
          setIsLocked(true); setIsLoading(false); return; 
        }

        const studentData = studentSnap.docs[0].data();
        setCurrentUser({ id: studentSnap.docs[0].id, name: studentData.studentName || "Student", role: "student" });

        const vaultsQuery = query(collection(db, 'mediaVaults'), where('status', '==', 'Published'));
        const vaultsSnap = await getDocs(vaultsQuery);
        
        const allowedRooms: any[] = [];
        vaultsSnap.forEach(doc => {
          const roomData = doc.data();
          if (studentData.accessType === 'Full Platform Bundle' || (studentData.specificCourses && studentData.specificCourses.includes(roomData.name))) {
            allowedRooms.push({ id: doc.id, ...roomData });
          }
        });
        setAvailableRooms(allowedRooms);
      } catch (err) {
        console.error(err); router.push('/portal');
      } finally {
        setIsLoading(false);
      }
    };
    authAndFetch();
  }, [router]);

  // 2. Global Feed Subscription
  useEffect(() => {
    if (isLocked || !currentUser) return;
    let qApproved = activeRoomId === "global" 
      ? query(collection(db, "community_posts"), where("isApproved", "==", true), orderBy("createdAt", "desc"))
      : query(collection(db, "community_posts"), where("courseRoomId", "==", activeRoomId), where("isApproved", "==", true), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(qApproved, (snapshot) => {
      const feedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
      setGlobalFeedPosts(feedPosts.sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1)));
    });
    return () => unsubscribe();
  }, [activeRoomId, isLocked, currentUser]);

  // 3. User's Personal Posts Subscription (For Pending and Approved Tabs)
  useEffect(() => {
    if (isLocked || !currentUser) return;
    const qMyPosts = query(collection(db, "community_posts"), where("authorId", "==", currentUser.id));

    const unsubscribe = onSnapshot(qMyPosts, (snapshot) => {
      const allMy = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
      
      const myDrafts = allMy.filter(p => p.isDraft);
      if (myDrafts.length > 0 && !editingPost) setEditingPost(myDrafts[0]);

      // Populating the Tabs
      // FIX: Removed !p.isDraft so the posts NO LONGER disappear from the student's screen while editing!
      setMyPendingPosts(allMy.filter(p => !p.isApproved).sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
      setMyApprovedPosts(allMy.filter(p => p.isApproved).sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
    });
    return () => unsubscribe();
  }, [currentUser, isLocked]);

  // Action Logic
  const handleEditRequest = async (post: Post) => {
    await updateDoc(doc(db, "community_posts", post.id), { isDraft: true });
    setEditingPost(post);
    // FIX: Removed the code that forced you back to the "Feed" tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = async () => {
    if (editingPost) {
      await updateDoc(doc(db, "community_posts", editingPost.id), { isDraft: false });
      setEditingPost(null);
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (window.confirm("Delete this post permanently?")) await deleteDoc(doc(db, "community_posts", post.id));
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  if (isLocked) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-12 max-w-lg w-full text-center shadow-sm">
        <LockIconLg />
        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Community Hub Locked</h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">Your account does not currently have access to the Vidhyora Community Hub.</p>
        <Link href="/portal" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-blue-600/20">Return to Dashboard</Link>
      </div>
    </div>
  );

  if (!currentUser) return null;

  // Determine which list of posts to render based on the Active Tab
  const postsToRender = activeTab === 'feed' ? globalFeedPosts : activeTab === 'pending' ? myPendingPosts : myApprovedPosts;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 space-y-8 relative">
       
       <div className="flex items-center justify-between mb-8">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community Hub</h2>
           <p className="text-slate-500 font-medium mt-1">Connect, share progress, and ask questions with your peers.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         <div className="lg:col-span-3">
           <RoomsSidebar activeRoomId={activeRoomId} setActiveRoomId={setActiveRoomId} availableRooms={availableRooms} />
         </div>

         <div className="lg:col-span-9 space-y-6">
           
           {/* Composer only shows on the Global Feed or if they are actively editing */}
           {(activeTab === 'feed' || editingPost) && (
             <CreatePostStudent currentUser={currentUser} activeRoomId={activeRoomId} editingPost={editingPost} onCancelEdit={handleCancelEdit} />
           )}
           
           {/* Sleek Tab Navigation */}
           <div className="flex items-center gap-6 mt-8 mb-6 border-b border-slate-200">
             <button 
               onClick={() => setActiveTab('feed')} 
               className={`pb-3 font-bold transition-all text-sm relative ${activeTab === 'feed' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Global Feed
               {activeTab === 'feed' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
             </button>
             
             <button 
               onClick={() => setActiveTab('pending')} 
               className={`pb-3 font-bold transition-all text-sm relative flex items-center gap-2 ${activeTab === 'pending' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Pending Review 
               {myPendingPosts.length > 0 && (
                 <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{myPendingPosts.length}</span>
               )}
               {activeTab === 'pending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
             </button>

             <button 
               onClick={() => setActiveTab('approved')} 
               className={`pb-3 font-bold transition-all text-sm relative ${activeTab === 'approved' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
               My Approved Posts
               {activeTab === 'approved' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
             </button>
           </div>

           {/* The Active Feed */}
           <div className="space-y-6">
             {postsToRender.map(post => (
               <StudentPostCard key={post.id} post={post} currentUser={currentUser} onDeleteAction={handleDeletePost} onEditAction={handleEditRequest} />
             ))}

             {postsToRender.length === 0 && (
               <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                 <h3 className="text-xl font-bold text-slate-900 mb-2">It's quiet in here</h3>
                 <p className="text-slate-500 font-medium">
                   {activeTab === 'feed' && "No posts in this specific room yet. Be the first to start the conversation!"}
                   {activeTab === 'pending' && "You don't have any posts waiting for approval."}
                   {activeTab === 'approved' && "You don't have any approved posts yet. Share something on the Global Feed!"}
                 </p>
               </div>
             )}
           </div>
         </div>
         
       </div>
    </div>
  );
}