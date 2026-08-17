import Link from 'next/link';

export default function InstructorSection() {
  return (
    <section className="bg-white py-24 border-t-2 border-gray-100">
      <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 w-full h-[400px] bg-blue-50 rounded-2xl flex items-center justify-center border-4 border-white shadow-2xl">
          <span className="text-blue-600 font-bold text-lg">Instructor Image Placeholder</span>
        </div>
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h2 className="text-4xl font-black text-black tracking-tight">Become an instructor</h2>
          <p className="text-lg text-black font-medium leading-relaxed">Instructors from around the world teach millions of learners on Vidhyora. We provide the tools and skills to teach what you love.</p>
          <Link href="/train-the-trainer" className="inline-block px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors mt-4">Start teaching today</Link>
        </div>
      </div>
    </section>
  );
}
