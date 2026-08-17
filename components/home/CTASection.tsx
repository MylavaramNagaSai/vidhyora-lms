import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="max-w-[1600px] mx-auto px-8 text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Ready to start your learning journey?</h2>
        <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto">Join thousands of learners achieving their goals with Vidhyora.</p>
        <Link href="/signup" className="inline-block px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-xl">Join Vidhyora for Free</Link>
      </div>
    </section>
  );
}
