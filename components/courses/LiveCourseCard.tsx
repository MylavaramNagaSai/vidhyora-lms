import Link from 'next/link';

interface LiveCourseProps {
  title: string;
  category: string;
  nextBatchDate: string;
  seatsFilled: number;
  totalSeats: number;
  price: string;
  slug: string;
}

export default function LiveCourseCard({ title, category, nextBatchDate, seatsFilled, totalSeats, price, slug }: LiveCourseProps) {
  const percentFilled = Math.round((seatsFilled / totalSeats) * 100);
  const isAlmostFull = percentFilled > 80;

  return (
    <div className="flex flex-col bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-blue-600 hover:shadow-2xl transition-all group">
      
      {/* Top Banner - Live Indicator */}
      <div className="bg-gray-900 px-4 py-3 flex justify-between items-center">
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">🔴 LIVE ZOOM COHORT</span>
        <span className="text-gray-300 text-sm font-medium">{category}</span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-black leading-tight mb-4 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        {/* Scarcity & Timeline details */}
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Starts: {nextBatchDate}
          </div>
          
          {/* Progress Bar for Seats */}
          <div>
            <div className="flex justify-between text-sm font-bold mb-1">
              <span className={isAlmostFull ? "text-red-600" : "text-black"}>
                {isAlmostFull ? "Filling Fast!" : "Seats Available"}
              </span>
              <span className="text-gray-500">{seatsFilled}/{totalSeats} Booked</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${isAlmostFull ? 'bg-red-500' : 'bg-blue-600'}`} 
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-2xl font-black text-black">{price}</span>
          <Link href={`/courses/${slug}`} className="px-5 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
