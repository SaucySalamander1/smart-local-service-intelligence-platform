import HeroSection from "../components/Home/HeroSection";
import PopularServices from "../components/Home/PopularServices";
import HowItWorks from "../components/Home/HowItWorks";
import AISection from "../components/Home/AISection";
import FeaturedWorkers from "../components/Home/FeaturedWorkers";
import TrustSection from "../components/Home/TrustSection";
import Testimonials from "../components/Home/Testimonials";
import CTASection from "../components/Home/CTASection";

const Home = () => {
  return (
    <div className="bg-slate-50">

      <HeroSection />

      <div className="max-w-7xl mx-auto">
        <PopularServices />
        <HowItWorks />
        <AISection />
        <FeaturedWorkers />
        <TrustSection />
        <Testimonials />
      </div>

      <CTASection />

    </div>
  );
};

export default Home;