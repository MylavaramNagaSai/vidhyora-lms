import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white py-3 border-b border-slate-200 shadow-sm">
      <div className="w-full px-8 flex justify-between items-center max-w-[1600px] mx-auto">
        <div className="flex-none">
          <Link href="/" className="text-3xl font-black text-blue-600 tracking-tight">Vidhyora</Link>
        </div>
        {/* Added items-center to ensure the new button aligns perfectly with the text links */}
        <div className="flex-1 flex justify-center items-center gap-7">
          <Link href="/mastery-in-ai" className="text-[15px] text-slate-600 font-semibold hover:text-blue-600 transition-colors">Mastery in Ai</Link>
          <Link href="/soft-skills" className="text-[15px] text-slate-600 font-semibold hover:text-blue-600 transition-colors">Soft skills related</Link>
          <Link href="/train-the-trainer" className="text-[15px] text-slate-600 font-semibold hover:text-blue-600 transition-colors">Train the trainer</Link>
          <Link href="/gen-ai" className="text-[15px] text-slate-600 font-semibold hover:text-blue-600 transition-colors">Gen Ai</Link>
          <Link href="/rag-ai" className="text-[15px] text-slate-600 font-semibold hover:text-blue-600 transition-colors">Rag Ai</Link>
          
          {/* New Charity Link */}
          <Link href="/charity" className="text-[15px] text-slate-600 font-semibold hover:text-blue-600 transition-colors">Charity</Link>
          
          {/* Verify Certificate converted to a subtle button */}
          <Link href="/verify-certificate" className="px-4 py-2 rounded-lg font-bold text-[14px] text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all">
            Verify Certificate
          </Link>
        </div>
        <div className="flex-none flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 rounded-lg font-bold text-[15px] text-slate-700 border-2 border-slate-300 hover:bg-slate-50 transition-all">LMS Login</Link>
          <Link href="/signup" className="px-5 py-2 rounded-lg font-bold text-[15px] text-white bg-blue-600 hover:bg-blue-700 border-2 border-blue-600 transition-all">Join for free</Link>
        </div>
      </div>
    </nav>
  );
}