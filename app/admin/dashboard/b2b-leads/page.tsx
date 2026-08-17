"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; 
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Loader2, Briefcase, Mail, Phone, Clock, FileText, CheckCircle2, Trash2, Edit3, X } from "lucide-react";

interface B2BLead {
  id: string;
  name: string;
  position: string;
  email: string;
  mobile: string;
  requirement: string;
  status: string;
  notes: string;
  createdAt: any;
}

export default function B2BLeadsPage() {
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  
  // Modal State
  const [editingLead, setEditingLead] = useState<B2BLead | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, "corporate_leads"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as B2BLead)));
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "corporate_leads", editingLead.id), {
        status: editingLead.status,
        notes: editingLead.notes
      });
      // Update local state instantly
      setLeads(leads.map(l => l.id === editingLead.id ? editingLead : l));
      setEditingLead(null);
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update lead.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this corporate lead?")) return;
    try {
      await deleteDoc(doc(db, "corporate_leads", id));
      setLeads(leads.filter(l => l.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  if (isFetching) {
    return <div className="flex items-center justify-center h-full w-full py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" strokeWidth={2.5} /> 
            B2B Leads Pipeline
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage incoming corporate training requests and track pipeline status.</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm font-bold text-slate-700">
          Total Leads: <span className="text-blue-600">{leads.length}</span>
        </div>
      </div>

      {/* LEADS GRID */}
      {leads.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold">
          No corporate requests received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow relative overflow-hidden group">
              
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${
                  lead.status === 'New' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                  lead.status === 'Contacted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  'bg-green-50 text-green-600 border-green-200'
                }`}>
                  {lead.status}
                </span>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 pr-24">{lead.name}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">{lead.position}</p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" /> {lead.email}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" /> {lead.mobile}
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1 pt-2 border-t border-slate-200">
                  <Clock className="w-3.5 h-3.5 shrink-0" /> Submitted: {lead.createdAt?.toDate ? new Date(lead.createdAt.toDate()).toLocaleDateString() : "Just now"}
                </div>
              </div>

              {/* Requirement */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Client Requirement</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl">
                  {lead.requirement}
                </p>
              </div>

              {/* Admin Notes */}
              {lead.notes && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Internal Notes</h4>
                  <p className="text-sm text-blue-800 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl whitespace-pre-wrap font-medium">
                    {lead.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
                <button 
                  onClick={() => setEditingLead(lead)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Update Status & Notes
                </button>
                <button 
                  onClick={() => handleDelete(lead.id)}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                  title="Delete Lead"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Update Lead Details</h3>
              <button onClick={() => setEditingLead(null)} className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleUpdateLead} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Lead Status</label>
                <select 
                  value={editingLead.status} 
                  onChange={e => setEditingLead({...editingLead, status: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm bg-white"
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Contacted & Negotiating</option>
                  <option value="Closed">Closed / Deal Won</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Notes (Not visible to client)</label>
                <textarea 
                  rows={5} 
                  value={editingLead.notes} 
                  onChange={e => setEditingLead({...editingLead, notes: e.target.value})}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-medium text-slate-900 text-sm resize-none"
                  placeholder="Record call summaries, quoted prices, or next steps here..."
                ></textarea>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50">
                {isSaving ? "Saving..." : "Save Updates"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}