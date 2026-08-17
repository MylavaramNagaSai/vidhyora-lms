import Hero from '../components/layout/Hero';
import TrustedBy from '../components/home/TrustedBy';
import WallOfWins from '../components/home/WallOfWins';
import UpcomingCohorts from '../components/UpcomingCohorts';
import AboutUsSection from '../components/home/AboutUsSection';
import AudienceSplitSection from '../components/home/AudienceSplitSection';
import SpecializationsAndSkills from '../components/home/SpecializationsAndSkills';
import CentralCourseHub from '../components/home/CentralCourseHub';
import CourseGrid from '../components/home/CourseGrid';
import LiveFeedbackStream from '../components/home/LiveFeedbackStream';
import CommunitySection from '../components/home/CommunitySection';
import CharitySection from '../components/home/CharitySection';
import BenefitsAndRules from '../components/home/BenefitsAndRules';
import SecurePayments from '../components/home/SecurePayments';
import ValueProp from '../components/home/ValueProp';
import Testimonials from '../components/home/Testimonials';
import FlagshipCourse from '../components/home/FlagshipCourse';
import BusinessSection from '../components/home/BusinessSection';
import InstructorSection from '../components/home/InstructorSection';
import FAQSection from '../components/home/FAQSection';
import CTASection from '../components/home/CTASection';
import HomePopup from "@/components/home/HomePopup";

export default function Home() {
  return (
    <div className="w-full bg-white">
      <Hero />
      <WallOfWins />
      <TrustedBy />
      
      {/* Dynamic Live Masterclasses injected right above About Section */}
      <UpcomingCohorts />
      <HomePopup />
      <AboutUsSection />
      <AudienceSplitSection />
      <SpecializationsAndSkills />
      <CentralCourseHub />
      <CourseGrid />
      <LiveFeedbackStream />
      <CommunitySection />
      <CharitySection />
      <BenefitsAndRules />
      <ValueProp />
      <Testimonials />
      <FlagshipCourse />
      <BusinessSection />
      <InstructorSection />
      <SecurePayments />
      <FAQSection />
      <CTASection />
    </div>
  );
}