export default function ValueProp() {
  return (
    <section className="bg-blue-50/50 py-24 border-t-2 border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8 text-center">
        <h2 className="text-3xl font-black text-black mb-16">Why learn with Vidhyora?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
            <h3 className="text-xl font-bold text-black mb-3">Learn from Industry Experts</h3><p className="text-black font-medium">Our courses are built and taught by top-tier professionals with real-world experience.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-black rounded-full flex items-center justify-center text-white mb-6 shadow-lg"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
            <h3 className="text-xl font-bold text-black mb-3">Go at Your Own Pace</h3><p className="text-black font-medium">Enjoy lifetime access to courses on Vidhyora. Learn on your schedule, anywhere.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg></div>
            <h3 className="text-xl font-bold text-black mb-3">Get Certified</h3><p className="text-black font-medium">Earn recognized certificates upon completion to showcase your mastery to employers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
