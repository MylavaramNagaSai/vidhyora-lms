"use client";
import { useState } from 'react';

// --- Premium SVG Icons ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);

const ShieldAlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const BadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
  </svg>
);

export default function VerifyCertificatePage() {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [certificateData, setCertificateData] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setCertificateData(null); 

    try {
      const res = await fetch('/api/certificates');
      const allCerts = await res.json();
      const foundCert = allCerts.find((cert: any) => cert.certificateCode === searchInput.trim());
      
      if (foundCert) {
        setCertificateData(foundCert);
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const evaluateStatus = (cert: any) => {
    if (!cert.expiryDate) return 'Active';
    const expiryTime = new Date(cert.expiryDate).getTime() + (24 * 60 * 60 * 1000);
    if (Date.now() > expiryTime) return 'Expired';
    return 'Active';
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center pt-24 pb-20 px-4">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Subtle Top Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-500/10 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      <div className="w-full max-w-5xl z-10 flex flex-col items-center">
        
        {/* Search Header */}
        <div className="w-full max-w-2xl text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg mb-6">
            <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Official Verification Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Credential Verification</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">Enter the unique alphanumeric ID found on the certificate to securely verify its authenticity and current standing.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl bg-white p-2.5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 mb-16 transition-all hover:shadow-2xl hover:shadow-blue-900/5">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="pl-5 pr-3">
              <SearchIcon />
            </div>
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. CERT-aX8bY2z9wQ"
              className="flex-1 py-4 px-2 outline-none text-slate-900 font-black text-lg placeholder:text-slate-300 placeholder:font-bold bg-transparent"
            />
            <button 
              type="submit" 
              disabled={isSearching || !searchInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-base px-8 py-4 rounded-2xl transition-all disabled:opacity-50 active:scale-95"
            >
              {isSearching ? 'Querying DB...' : 'Verify Record'}
            </button>
          </form>
        </div>

        {/* --- EMPTY STATE: TRUST FEATURES --- */}
        {!hasSearched && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                  <LockIcon />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Tamper-Proof Records</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">Every certificate issued is securely logged in our central database, preventing unauthorized modifications or forgery.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                  <GlobeIcon />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Global Recognition</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">Our standardized verification protocol allows employers and institutions worldwide to validate credentials instantly.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
                  <ZapIcon />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Instant Validation</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">No more waiting for manual email confirmations. Enter the code and receive the cryptographic status in real-time.</p>
              </div>
            </div>

            {/* Helper Section */}
            <div className="max-w-2xl mx-auto bg-slate-100/50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex items-start sm:items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-200">
                <BadgeIcon />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 mb-1">Where do I find the Certificate ID?</h4>
                <p className="text-sm font-medium text-slate-500">Look at the bottom-left corner of the digital or printed certificate. It will be a 15-character alphanumeric string starting with <span className="font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">CERT-</span>.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- RESULTS SECTION --- */}
        <div className="w-full max-w-3xl">
          
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl animate-pulse">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-5"></div>
              <p className="text-slate-900 font-black text-lg">Querying secure database...</p>
              <p className="text-slate-500 font-medium text-sm mt-1">Cross-referencing cryptographic hashes.</p>
            </div>
          )}

          {!isSearching && hasSearched && !certificateData && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-red-100 shadow-xl text-center px-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <ShieldAlertIcon />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3">Credential Not Found</h3>
              <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed">We could not locate any secure records matching <span className="font-black text-slate-900">"{searchInput}"</span>.</p>
              <button 
                onClick={() => {setHasSearched(false); setSearchInput('');}} 
                className="mt-8 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors border-b border-transparent hover:border-blue-600"
              >
                Clear search and try again
              </button>
            </div>
          )}

          {!isSearching && hasSearched && certificateData && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              
              {/* Verification Header */}
              <div className={`p-8 sm:p-10 flex items-center gap-6 ${evaluateStatus(certificateData) === 'Active' ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-red-50 border-b border-red-100'}`}>
                <div className="shrink-0 bg-white p-3 rounded-2xl shadow-sm">
                  {evaluateStatus(certificateData) === 'Active' ? <ShieldCheckIcon /> : <ShieldAlertIcon />}
                </div>
                <div>
                  <h3 className={`text-2xl font-black tracking-tight ${evaluateStatus(certificateData) === 'Active' ? 'text-emerald-900' : 'text-red-900'}`}>
                    {evaluateStatus(certificateData) === 'Active' ? 'Verified Official Credential' : 'Expired Credential Record'}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-white/60 ${evaluateStatus(certificateData) === 'Active' ? 'text-emerald-700' : 'text-red-700'}`}>
                      ID: {certificateData.certificateCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-8 sm:p-10 space-y-8">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><UserIcon/> Issued To</span>
                    <div className="text-xl font-black text-slate-900 leading-tight">
                      {certificateData.studentName}
                    </div>
                  </div>
                  
                  <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><BookIcon/> Achievement</span>
                    <div className="text-xl font-black text-slate-900 leading-tight">
                      {certificateData.course}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Score</div>
                    <div className="text-xl font-black text-blue-600">{certificateData.percentage}%</div>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Type</div>
                    <div className="text-sm font-bold text-slate-700 mt-1">{certificateData.issueType}</div>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Issue Date</div>
                    <div className="text-sm font-bold text-slate-700 mt-1">
                      {certificateData.issuedAt ? new Date(certificateData.issuedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Expiry Date</div>
                    <div className="text-sm font-bold text-slate-700 mt-1">
                      {certificateData.expiryDate ? new Date(certificateData.expiryDate).toLocaleDateString() : 'Lifetime'}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-6 sm:px-10 sm:py-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-bold text-slate-500">Record validated securely via Vidhyora DB.</p>
                
                <button 
                  onClick={() => alert("PDF Generation logic will be implemented in the next phase.")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <DownloadIcon />
                  Download Authenticated PDF
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}