import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const keywords = [
  "repair technician",
  "electrician working",
  "plumbing repair",
  "home service worker",
  "maintenance tools"
];

const activities = [
  "🔧 Rahim fixed an electrical issue",
  "🚿 Plumber assigned in Dhanmondi",
  "❄️ AC repair completed in Gulshan",
  "⚡ Emergency electrician dispatched",
];

const LiveActivitySection = () => {
  const [bg, setBg] = useState("");
  const [index, setIndex] = useState(0);

  const fetchImage = async (query) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.REACT_APP_UNSPLASH_KEY}`
      );
      const data = await res.json();
      setBg(data.urls.full);
    } catch (err) {
      console.error("Unsplash error:", err);
    }
  };

  useEffect(() => {
    fetchImage(keywords[0]);

    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % keywords.length;
        fetchImage(keywords[next]);
        return next;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="py-24 text-white overflow-hidden bg-cover bg-center transition-all duration-1000 relative"
      style={{
        backgroundImage: `url(${bg})`
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-6">
          Live Platform Activity
        </h2>

        <p className="text-gray-300 mb-10">
          See what’s happening right now across the platform
        </p>

        {/* Animated list */}
        <div className="space-y-4 max-w-xl mx-auto">
          {activities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 p-4 rounded-xl backdrop-blur-md"
            >
              {item}
            </motion.div>
          ))}
        </div>

        {/* Floating animation */}
        <motion.div
          className="mt-10 text-green-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ● System Active
        </motion.div>

      </div>
    </section>
  );
};

export default LiveActivitySection;