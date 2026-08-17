import Link from 'next/link';

export default function TopCategories() {
  const categories = ['Mastery in Ai', 'Gen Ai', 'Rag Ai', 'Soft skills related'];
  return (
    <section className="py-20 bg-white border-t-2 border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8">
        <h2 className="text-3xl font-black text-black mb-10">Explore Top Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category} href={`/${category.toLowerCase().replace(/ /g, '-')}`} className="group p-8 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-14 w-14 bg-blue-50 rounded-lg mb-6 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">{category}</h3>
              <p className="text-black font-semibold group-hover:text-blue-600 transition-colors">Explore courses &rarr;</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
