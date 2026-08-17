export default function BusinessSection() {
  return (
    <section className="bg-gray-900 py-24">
      <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row-reverse items-center gap-16">
        <div className="flex-1 w-full h-[400px] bg-gray-800 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-gray-700">
          <span className="text-gray-400 font-bold text-lg">Business Dashboard Image</span>
        </div>
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Vidhyora <span className="text-blue-500">Business</span></h2>
          <p className="text-xl text-gray-300 font-medium leading-relaxed">Upskill your entire team with unlimited access to top-rated courses. Get detailed analytics, custom learning paths, and enterprise-grade security.</p>
          <button className="inline-block px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg mt-4 border border-blue-500">Get Vidhyora for your team</button>
        </div>
      </div>
    </section>
  );
}
