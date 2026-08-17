"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();

      if (res.ok && data.success) {
        setStep(2);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setErrorMsg(data.error || "Access denied. Email not authorized.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 4) return;

    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: finalOtp })
      });
      
      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/portal"); 
      } else {
        setErrorMsg(data.error || "Invalid code. Please try again.");
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setErrorMsg("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-white w-full h-screen">
      
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative overflow-y-auto">
        <div className="absolute top-8 left-8 sm:left-16 lg:left-24 xl:left-32">
          <h1 className="text-3xl font-black text-blue-600 tracking-tight">Vidhyora</h1>
        </div>

        <div className="max-w-md w-full mx-auto mt-12">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back.</h2>
          <p className="text-slate-500 font-medium mb-10 text-sm">
            {step === 1 
              ? "Log in to access your live cohorts, recordings, and checkpoint exams." 
              : `We've sent a 4-digit code to ${email}.`}
          </p>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertIcon />
              <p className="text-sm font-bold text-red-900 leading-tight">
                {errorMsg}
              </p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="student@example.com" 
                  className={`w-full px-4 py-3.5 rounded-xl border focus:ring-2 outline-none transition-all font-medium text-slate-900 ${
                    errorMsg 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50' 
                      : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/20 bg-white'
                  }`}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
              >
                {isLoading ? "Sending Code..." : "Continue with Email"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-4 text-center">Enter 4-Digit Code</label>
                <div className="flex justify-center gap-4">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-16 h-16 text-center text-2xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading || otp.join("").length !== 4}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 mt-4"
              >
                {isLoading ? "Verifying..." : "Sign In to Portal"}
              </button>
              
              <button 
                type="button" 
                onClick={() => {
                  setStep(1);
                  setOtp(["", "", "", ""]);
                  setErrorMsg("");
                }}
                className="w-full text-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 h-full bg-slate-950 flex-col justify-center px-16 xl:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-block px-3 py-1.5 bg-blue-900/40 border border-blue-800/50 rounded-full mb-8">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Secure Student Portal</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-12 tracking-tight">
            Your gateway to the top 1% tech community.
          </h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckIcon />
              </div>
              <p className="text-slate-300 font-medium">Access Live Zoom Cohorts & Premium Recordings</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckIcon />
              </div>
              <p className="text-slate-300 font-medium">Network in the Invite-Only Community</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckIcon />
              </div>
              <p className="text-slate-300 font-medium">Take Checkpoint Exams for Certification</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-16 xl:left-24 flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
          <ShieldIcon />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Content Security Active</span>
        </div>
      </div>
    </div>
  );
}