export default function TrendingSkills() {
  const skills = ['Python', 'Machine Learning', 'Next.js', 'React', 'Cybersecurity', 'AWS Certification', 'Prompt Engineering', 'Public Speaking', 'Data Science', 'Docker'];
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1600px] mx-auto px-8">
        <h3 className="text-2xl font-bold text-black mb-8">Trending Skills on Vidhyora</h3>
        <div className="flex flex-wrap gap-4">
          {skills.map((skill) => (
            <span key={skill} className="px-6 py-3 bg-gray-50 border-2 border-gray-200 text-black font-bold rounded-full cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-lg">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
