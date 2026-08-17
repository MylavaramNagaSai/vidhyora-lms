import Link from 'next/link';

export default function Hero() {
  return (
    <section className="max-w-[1600px] mx-auto px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-12 bg-white border-b border-gray-100">
      
      {/* Left Text Area */}
      <div className="flex-1 space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black leading-tight">
          Master your future <br />
          <span className="text-blue-600">with Vidhyora</span>
        </h1>
        <p className="text-xl text-black font-medium max-w-2xl">
          Launch your career in AI, Generative AI, and Soft Skills. Learn from industry experts and get certified to prove your mastery.
        </p>
        <div className="flex gap-4 pt-4">
          <Link href="/signup" className="px-8 py-4 rounded-lg font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30">
            Explore Courses
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-lg font-bold text-lg text-black border-2 border-black hover:bg-gray-100 transition-all">
            Log In
          </Link>
        </div>
      </div>
      
      {/* Right Graphic Placeholder */}
      <div className="flex-1 w-full h-[450px] bg-white rounded-2xl border-4 border-blue-50 flex items-center justify-center shadow-2xl">
         <span className="text-blue-600 font-bold text-lg">Hero Graphic / Image Placeholder</span>
      </div>
      
    </section>
  );
}