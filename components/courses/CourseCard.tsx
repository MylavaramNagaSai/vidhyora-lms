// We define the data structure so TypeScript knows exactly what a course looks like
interface CourseProps {
  title: string;
  instructor: string;
  rating: string;
  reviews: string;
  price: string;
}

export default function CourseCard({ title, instructor, rating, reviews, price }: CourseProps) {
  return (
    <div className="flex flex-col group cursor-pointer bg-white p-3 rounded-xl border-2 border-gray-100 hover:border-blue-600 hover:shadow-xl transition-all">
      
      {/* Thumbnail */}
      <div className="w-full h-40 bg-gray-50 rounded-lg mb-4 border border-gray-200 flex items-center justify-center">
         <span className="text-gray-400 font-bold text-sm">Thumbnail</span>
      </div>
      
      {/* Course Info */}
      <h3 className="font-bold text-black leading-tight mb-2 group-hover:text-blue-600 transition-colors">
         {title}
      </h3>
      <p className="text-sm text-black mb-2">{instructor}</p>
      
      {/* Ratings */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-black font-bold text-sm">{rating}</span>
        <div className="flex text-blue-600 text-sm">★★★★☆</div>
        <span className="text-black text-xs">({reviews})</span>
      </div>
      
      {/* Price */}
      <div className="font-black text-black text-lg">{price}</div>
      
    </div>
  );
}