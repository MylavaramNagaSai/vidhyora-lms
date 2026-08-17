"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Automatically request OTP when the page loads
  useEffect(() => {
    triggerOTP();
  }, []);

  const triggerOTP = async () => {
    setError('');
    setMessage('Requesting secure code...');
    try {
      const res = await fetch('/api/admin/send-otp', { method: 'POST' });
      if (res.ok) {
        setMessage('OTP sent to the registered master admin email.');
      } else {
        setError('Failed to send OTP. Please try again.');
        setMessage('');
      }
    } catch (err) {
      setError('Network error occurred.');
      setMessage('');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length === 6) {
      setLoading(true);
      setError('');
      
      try {
        const res = await fetch('/api/admin/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: otpValue })
        });
        
        const data = await res.json();

        if (res.ok && data.success) {
          router.push('/admin/dashboard');
        } else {
          setError(data.message || 'Invalid OTP code.');
          setOtp(['', '', '', '', '', '']); // Clear grid on failure
          inputRefs.current[0]?.focus();
        }
      } catch (err) {
        setError('Verification failed due to a server error.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return; 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1.5 w-full bg-blue-600"></div>
        <div className="p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Admin Authentication</h1>
            {error ? (
              <p className="text-red-500 text-sm font-bold">{error}</p>
            ) : (
              <p className="text-blue-600 text-sm font-bold">{message}</p>
            )}
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-8">
            <div>
              <div className="flex justify-between gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button 
                type="submit" 
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-3.5 bg-blue-600 disabled:bg-blue-400 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Verify & Login
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="w-full py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                onClick={triggerOTP}
              >
                Resend OTP Code
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
