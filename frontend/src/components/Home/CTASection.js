import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const images = [
  "ai,technology",
  "artificial-intelligence",
  "robot,ai",
  "data,network",
  "smart,technology"
];

const CTASection = () => {
  const navigate = useNavigate();
  const [bg, setBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBg((prev) => (prev + 1) % images.length);
    }, 30000); // 30 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative py-28 bg-cover bg-center transition-all duration-1000"
      style={{
        backgroundImage: `url(https://source.unsplash.com/1600x900/?${images[bg]})`
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20">

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Get Instant AI Help
          </h2>

          <p className="mt-4 text-gray-200">
            Smart AI assistance + real professionals — all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => navigate("/ai-chat")}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              ⚡ Start Diagnosis
            </button>

            <button
              onClick={() => navigate("/emergency-workers")}
              className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition"
            >
              🚨 Emergency Help
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;