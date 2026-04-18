import { motion } from "framer-motion";

const activities = [
  "🔧 Rahim fixed an electrical issue",
  "🚿 Plumber assigned in Dhanmondi",
  "❄️ AC repair completed in Gulshan",
  "⚡ Emergency electrician dispatched",
];

const LiveActivitySection = () => {
  return (
    <section className="py-24 bg-black text-white overflow-hidden">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-6">
          Live Platform Activity
        </h2>

        <p className="text-gray-400 mb-10">
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