import CourseCard from '../courses/CourseCard';

export default function CourseGrid() {
  const dummyCourses = [
    { title: "Mastery in AI: Complete Bootcamp", instructor: "Dr. Vidhyora", rating: "4.8", reviews: "12,345", price: "Free" },
    { title: "Generative AI for Beginners", instructor: "Sarah Tech", rating: "4.9", reviews: "8,201", price: "Free" },
    { title: "RAG AI Architecture Masterclass", instructor: "Data Institute", rating: "4.7", reviews: "4,112", price: "Free" },
    { title: "Train the Trainer: Soft Skills", instructor: "John Speaker", rating: "4.6", reviews: "9,021", price: "Free" },
    { title: "Advanced Neural Networks", instructor: "Dr. Vidhyora", rating: "4.9", reviews: "15,820", price: "Free" }
  ];

  return (
    <section className="bg-white py-20 border-t-2 border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8">
        <h2 className="text-3xl font-black text-black mb-10">Students are viewing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {dummyCourses.map((course, index) => (
            <CourseCard key={index} title={course.title} instructor={course.instructor} rating={course.rating} reviews={course.reviews} price={course.price} />
          ))}
        </div>
      </div>
    </section>
  );
}
