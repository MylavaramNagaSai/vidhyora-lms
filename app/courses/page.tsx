import LiveCourseCard from '../components/courses/LiveCourseCard';

export default function CourseCatalog() {
  // Dummy data simulating your upcoming live batches
  const liveBatches = [
    { title: "Mastery in Generative AI: Build RAG Apps", category: "Gen AI", nextBatchDate: "Aug 15, 2026", seatsFilled: 42, totalSeats: 50, price: "$299", slug: "gen-ai-mastery" },
    { title: "Train the Trainer: Elite Presentation Skills", category: "Soft Skills", nextBatchDate: "Aug 20, 2026", seatsFilled: 15, totalSeats: 30, price: "$199", slug: "train-the-trainer" },
    { title: "Full-Stack Next.js & Python Bootcamp", category: "Development", nextBatchDate: "Sept 01, 2026", seatsFilled: 48, totalSeats: 50, price: "$349", slug: "full-stack-bootcamp" },
    { title: "AI Tools for Business Professionals", category: "Mastery in AI", nextBatchDate: "Sept 10, 2026", seatsFilled: 8, totalSeats: 40, price: "$149", slug: "ai-for-business" },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-black py-16">
        <div className="max-w-[1600px] mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Upcoming Live Cohorts</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join our exclusive Zoom-based training sessions. Learn directly from experts in real-time, ask questions, and build your portfolio.
          </p>
        </div>
      </div>

      {/* Catalog Layout */}
      <div className="max-w-[1600px] mx-auto px-8 py-16 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-black text-black mb-4 uppercase tracking-widest text-sm">Categories</h3>
            <ul className="space-y-3">
              {['All Courses', 'Mastery in AI', 'Gen AI', 'RAG AI', 'Soft Skills'].map(cat => (
                <li key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  <span className="text-black font-medium group-hover:text-blue-600">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-black text-black mb-4 uppercase tracking-widest text-sm">Batch Status</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                <span className="text-black font-medium group-hover:text-blue-600">Open for Enrollment</span>
              </li>
              <li className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-red-500" />
                <span className="text-black font-medium group-hover:text-red-500">Filling Fast</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Course Grid */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">Showing {liveBatches.length} Live Cohorts</h2>
            <select className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-black font-medium outline-none focus:border-blue-600">
              <option>Sort by: Starting Soonest</option>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Seats Available</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {liveBatches.map((batch, idx) => (
              <LiveCourseCard key={idx} {...batch} />
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}
