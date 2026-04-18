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

const Home = () => {
  return (
    <div className="bg-slate-50">

      <HeroSection />

      <div style={{ textAlign: "center", margin: "20px" }}>
        <button 
          onClick={() => window.location.href="/estimate"}
          style={{ margin: "10px", padding: "10px", background:"#0041C2", color:"#fff" }}
        >
          Cost Estimation
        </button>

        <button 
          onClick={() => window.location.href="/breakdown"}
          style={{ margin: "10px", padding: "10px", background:"#0041C2", color:"#fff" }}
        >
          Cost Breakdown
        </button>

        <button 
          onClick={() => window.location.href="/review"}
          style={{ margin: "10px", padding: "10px", background:"#0041C2", color:"#fff" }}
        >
          Review System
        </button>
      </div>

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

      <CTASection />

    </div>
  );
};

export default Home;