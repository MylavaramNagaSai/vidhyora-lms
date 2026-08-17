"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Briefcase, Mail, Phone, User, CheckCircle2 } from "lucide-react";

export default function CorporateTrainingPage() {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    mobile: "",
    requirement: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save Lead to Firebase
      await addDoc(collection(db, "corporate_leads"), {
        ...formData,
        status: "New", 
        notes: "",     
        createdAt: serverTimestamp()
      });

      // 2. Trigger Automated Email
      await fetch('/api/send-corporate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email })
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4 sm:px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Copy (Now in Clean Light Theme) */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase shadow-sm">
            For Business & Enterprise
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Train Your Entire Team.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
            Request custom corporate training batches. Empower your workforce with private LMS access, tailored curriculum, and live expert instruction.
          </p>
          <div className="space-y-5 pt-4">
            {['Custom AI & Tech Curriculums', 'Private Cohort Sandboxes', 'Dedicated Success Manager'].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-800 font-bold">
                <CheckCircle2 className="text-blue-600 w-6 h-6 shrink-0" strokeWidth={2.5} /> {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4 animate-in fade-in zoom-in duration-500 relative z-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-200">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Request Received</h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                Our enterprise team has been notified. Check your inbox for confirmation. We will be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Request Corporate Access</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all text-sm font-medium text-slate-900" placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Position</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all text-sm font-medium text-slate-900" placeholder="HR Manager / CEO" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all text-sm font-medium text-slate-900" placeholder="john@company.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all text-sm font-medium text-slate-900" placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Training Requirements</label>
                <textarea required rows={4} value={formData.requirement} onChange={e => setFormData({...formData, requirement: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition-all text-sm font-medium text-slate-900 resize-none custom-scrollbar" placeholder="Tell us about your team size, topics of interest, and timeline..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Request"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}