import HeroSection from "../components/Home/HeroSection";
import PopularServices from "../components/Home/PopularServices";
import HowItWorks from "../components/Home/HowItWorks";
import AISection from "../components/Home/AISection";
import FeaturedWorkers from "../components/Home/FeaturedWorkers";
import TrustSection from "../components/Home/TrustSection";
import Testimonials from "../components/Home/Testimonials";
import CTASection from "../components/Home/CTASection";

import LiveActivitySection from "../components/Home/LiveActivitySection";
import EmergencyResponseSection from "../components/Home/EmergencyResponseSection";

import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="bg-slate-50">

      {/* HERO */}
      <HeroSection />

      <div className="max-w-7xl mx-auto">
        <PopularServices />
        <HowItWorks />
        <AISection />
        <FeaturedWorkers />
        <LiveActivitySection/>
        <TrustSection />
        <EmergencyResponseSection />
        <Testimonials />
      </div>

      {/* CTA */}
      <CTASection />

    </div>
  );
};

export default Home;