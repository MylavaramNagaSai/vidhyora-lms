"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, where, updateDoc, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

import PostCard from "./components/PostCard";
import CreatePost from "./components/CreatePost";
import LiveUsersSidebar from "./components/LiveUsersSidebar";
import RoomsSidebar from "./components/RoomsSidebar";
import ApprovalQueueWidget from "./components/ApprovalQueueWidget";
import ScheduledQueueWidget from "./components/ScheduledQueueWidget";
import { Post, CurrentUser } from "./types";

const adminUser: CurrentUser = {
  id: "admin_user_001",
  name: "Vidhyora Admin", // <-- Updated!
  role: "admin",
  badges: ["Admin"], 
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingQueue, setPendingQueue] = useState<Post[]>([]);
  const [scheduledQueue, setScheduledQueue] = useState<Post[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>("global");
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  
  // NEW: Track the post being edited in the main window
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPlatformData = async () => {
      try {
        const vaultsQuery = query(collection(db, 'mediaVaults'), where('status', '==', 'Published'));
        const vaultsSnap = await getDocs(vaultsQuery);
        setAvailableRooms(vaultsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Failed to load platform data:", error);
      }
    };
    fetchPlatformData();
  }, []);

  useEffect(() => {
    let qApproved = activeRoomId === "global" 
      ? query(collection(db, "community_posts"), where("isApproved", "==", true), orderBy("createdAt", "desc"))
      : query(collection(db, "community_posts"), where("courseRoomId", "==", activeRoomId), where("isApproved", "==", true), orderBy("createdAt", "desc"));
    
    const qPending = query(collection(db, "community_posts"), where("isApproved", "==", false), orderBy("createdAt", "desc"));

    const unsubscribeApproved = onSnapshot(qApproved, (snapshot) => {
      const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
      const now = Date.now();
      
      const futureScheduled = allPosts.filter(p => p.scheduledFor && p.scheduledFor > now).sort((a, b) => (a.scheduledFor || 0) - (b.scheduledFor || 0));
      setScheduledQueue(futureScheduled);

      const feedPosts = allPosts.filter(p => !p.scheduledFor || p.scheduledFor <= now).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0; 
      });
      setPosts(feedPosts);
    });

    const unsubscribePending = onSnapshot(qPending, (snapshot) => {
      const pending = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
      // ONLY show posts that are NOT currently being edited by students
      setPendingQueue(pending.filter(p => !p.isDraft));
    });

    return () => { unsubscribeApproved(); unsubscribePending(); };
  }, [activeRoomId]);

  const handlePostAction = async (action: string, post: Post, newContent?: string) => {
    if (action === 'delete') {
      if (window.confirm("Delete this post permanently?")) await deleteDoc(doc(db, "community_posts", post.id));
    } else if (action === 'edit' && newContent) {
      await updateDoc(doc(db, "community_posts", post.id), { content: newContent });
    } else if (action === 'pin') {
      await updateDoc(doc(db, "community_posts", post.id), { isPinned: !post.isPinned });
    } else if (action === 'repost') {
      if (window.confirm("Share this post to the feed?")) {
        await addDoc(collection(db, 'community_posts'), {
          ...post, authorId: adminUser.id, authorName: adminUser.name, authorRole: adminUser.role, isRepost: true, originalAuthor: post.authorName, createdAt: serverTimestamp(), isPinned: false, id: undefined 
        });
      }
    }
  };

  const handleEditRequest = (post: Post) => {
    setEditingPost(post);
    // Smoothly scroll to the top so the admin sees the posting window populate
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApprove = async (postId: string) => await updateDoc(doc(db, "community_posts", postId), { isApproved: true });
  const handleReject = async (post: Post) => handlePostAction('delete', post);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-12 relative">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community Hub</h2>
           <p className="text-slate-500 font-medium mt-1">Engage with students, post updates, and moderate global platform discussions.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
         <div className="xl:col-span-3">
           <RoomsSidebar activeRoomId={activeRoomId} setActiveRoomId={setActiveRoomId} availableRooms={availableRooms} />
         </div>

         <div className="xl:col-span-6 space-y-6">
           {/* Pass editing state down */}
           <CreatePost currentUser={adminUser} activeRoomId={activeRoomId} editingPost={editingPost} onCancelEdit={() => setEditingPost(null)} />
           
           <div className="space-y-6">
             {posts.map(post => (
               <PostCard key={post.id} post={post} currentUser={adminUser} onAction={handlePostAction} />
             ))}
           </div>
         </div>

         <div className="xl:col-span-3 space-y-6 sticky top-6">
           <ScheduledQueueWidget scheduledQueue={scheduledQueue} onEditRequest={handleEditRequest} onDelete={(post) => handlePostAction('delete', post)} />
           <ApprovalQueueWidget pendingQueue={pendingQueue} onApprove={handleApprove} onReject={handleReject} />
           <LiveUsersSidebar />
         </div>
       </div>
    </div>
  );
}