import HeroSection from "../components/Home/HeroSection";
import PopularServices from "../components/Home/PopularServices";
import HowItWorks from "../components/Home/HowItWorks";
import AISection from "../components/Home/AISection";
import FeaturedWorkers from "../components/Home/FeaturedWorkers";
import TrustSection from "../components/Home/TrustSection";
import Testimonials from "../components/Home/Testimonials";
import CTASection from "../components/Home/CTASection";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-slate-50">

      {/* HERO */}
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-center">
          <div className="space-y-3">
            <Link
              to="/estimate"
              className="block rounded-full bg-blue-800 px-4 py-2 text-center text-white text-base font-semibold shadow-[0_16px_40px_-26px_rgba(0,65,194,0.8)] transition hover:bg-blue-700"
            >
              💰 Cost Estimation
            </Link>
            <Link
              to="/breakdown"
              className="block rounded-full bg-slate-900 px-4 py-2 text-center text-white text-base font-semibold shadow-[0_16px_40px_-26px_rgba(15,23,42,0.7)] transition hover:bg-slate-800"
            >
              📊 Cost Breakdown
            </Link>
          </div>

          <div className="space-y-3">
            <Link
              to="/warranty"
              className="block rounded-full bg-emerald-600 px-4 py-2 text-center text-white text-base font-semibold shadow-[0_16px_40px_-26px_rgba(16,185,129,0.7)] transition hover:bg-emerald-500"
            >
              🛡 Warranty
            </Link>
            <Link
              to="/dispute"
              className="block rounded-full bg-red-600 px-4 py-2 text-center text-white text-base font-semibold shadow-[0_16px_40px_-26px_rgba(239,68,68,0.7)] transition hover:bg-red-500"
            >
              ⚖ Dispute
            </Link>
            <Link
              to="/admin-dispute"
              className="block rounded-full bg-purple-600 px-4 py-2 text-center text-white text-base font-semibold shadow-[0_16px_40px_-26px_rgba(139,92,246,0.7)] transition hover:bg-purple-500"
            >
              🧑‍⚖ Admin Panel
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto">
        <PopularServices />
        <HowItWorks />
        <AISection />
        <FeaturedWorkers />
        <TrustSection />
        <Testimonials />
      </div>

      {/* CTA */}
      <CTASection />

    </div>
  );
};

export default Home;