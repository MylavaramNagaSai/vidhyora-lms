export default function FAQSection() {
  const faqs = [
    { q: "Is Vidhyora completely free to join?", a: "Yes! Creating an account is 100% free. You can browse all courses, access free content, and choose to purchase premium tracks or certificates when you are ready." },
    { q: "Do I get a certificate upon completion?", a: "Absolutely. All premium courses and career tracks include a verifiable digital certificate that you can add directly to your LinkedIn profile or resume." },
    { q: "Can I learn at my own pace?", a: "Yes, all Vidhyora courses are strictly on-demand. Once you enroll, you have lifetime access to the video materials, quizzes, and community forums." },
    { q: "What is the refund policy?", a: "We offer a 30-day money-back guarantee on all individual course purchases. If you aren't satisfied, you get a full refund, no questions asked." }
  ];

  return (
    <section className="bg-white py-24 border-t-2 border-gray-100">
      <div className="max-w-[1000px] mx-auto px-8">
        <h2 className="text-4xl font-black text-black text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-600 transition-colors group cursor-pointer bg-white">
              <h3 className="text-xl font-bold text-black flex justify-between items-center">{faq.q}<span className="text-blue-600 group-hover:scale-125 transition-transform">+</span></h3>
              <p className="text-gray-600 font-medium mt-4 leading-relaxed pr-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
