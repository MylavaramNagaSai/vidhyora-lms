export default function TrustedBy() {
  return (
    <section className="bg-gray-50 py-10 border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8 flex flex-col items-center">
        <p className="text-gray-500 font-bold mb-6 text-sm tracking-widest uppercase">Trusted by professionals at top companies worldwide</p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-black text-gray-800">Google</span>
          <span className="text-2xl font-black text-gray-800">Microsoft</span>
          <span className="text-2xl font-black text-gray-800">Meta</span>
          <span className="text-2xl font-black text-gray-800">Netflix</span>
          <span className="text-2xl font-black text-gray-800">Amazon</span>
        </div>
      </div>
    </section>
  );
}
