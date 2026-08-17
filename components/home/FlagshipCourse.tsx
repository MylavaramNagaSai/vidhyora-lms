export default function FlagshipCourse() {
  return (
    <section className="bg-white py-24 border-t-2 border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 w-full h-[500px] bg-black rounded-3xl relative overflow-hidden shadow-2xl flex items-center justify-center border-8 border-gray-50">
           <span className="text-white font-bold text-2xl">Flagship Video Preview</span>
           <div className="absolute h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center pl-2 shadow-xl cursor-pointer hover:scale-110 transition-transform"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
        </div>
        <div className="flex-1 space-y-6">
          <span className="bg-blue-100 text-blue-600 font-bold px-4 py-2 rounded-full text-sm">Most Popular</span>
          <h2 className="text-4xl md:text-5xl font-black text-black leading-tight">Mastery in Gen AI: <br/>From Zero to Hero</h2>
          <p className="text-xl text-gray-600 font-medium">Join 50,000+ students in our most comprehensive course yet. Build real-world RAG applications and train your own custom AI models from scratch.</p>
          <div className="flex items-center gap-4 text-black font-bold text-lg pt-2"><span className="flex text-blue-600">★★★★★</span> (4.9/5 from 12k reviews)</div>
          <button className="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 mt-4">Enroll Now for Free</button>
        </div>
      </div>
    </section>
  );
}
