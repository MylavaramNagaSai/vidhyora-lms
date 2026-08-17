export default function CareerTracks() {
  return (
    <section className="bg-gray-50 py-24 border-t-2 border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8">
        <h2 className="text-4xl font-black text-black mb-4">Launch a New Career in 6 Months</h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">Professional Certificates offer flexible, online training designed to get you job-ready for high-growth fields.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-600 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="flex gap-4 items-center mb-6">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-2xl">AI</div>
              <div><h3 className="text-2xl font-black text-black group-hover:text-blue-600 transition-colors">AI Engineer</h3><p className="text-gray-500 font-medium">Average Salary: $120k+</p></div>
            </div>
            <p className="text-black font-medium mb-6">Master neural networks, large language models, and deploy production-ready AI applications.</p>
            <div className="font-bold text-blue-600">View Program &rarr;</div>
          </div>
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-600 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="flex gap-4 items-center mb-6">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-black text-2xl">FS</div>
              <div><h3 className="text-2xl font-black text-black group-hover:text-blue-600 transition-colors">Full-Stack Dev</h3><p className="text-gray-500 font-medium">Average Salary: $105k+</p></div>
            </div>
            <p className="text-black font-medium mb-6">Build scalable applications using Next.js, FastAPI, and robust database architectures.</p>
            <div className="font-bold text-blue-600">View Program &rarr;</div>
          </div>
          <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-600 hover:shadow-2xl transition-all group cursor-pointer">
            <div className="flex gap-4 items-center mb-6">
              <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-black text-2xl">PM</div>
              <div><h3 className="text-2xl font-black text-black group-hover:text-blue-600 transition-colors">Tech Manager</h3><p className="text-gray-500 font-medium">Average Salary: $115k+</p></div>
            </div>
            <p className="text-black font-medium mb-6">Develop the soft skills, agile methodologies, and leadership tactics to lead tech teams.</p>
            <div className="font-bold text-blue-600">View Program &rarr;</div>
          </div>
        </div>
      </div>
    </section>
  );
}
