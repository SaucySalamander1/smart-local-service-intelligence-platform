import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const EmergencyResponseSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 bg-gradient-to-r from-red-500 to-orange-500 text-white overflow-hidden relative">

      {/* Animated background glow */}
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>
      <div className="absolute w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl bottom-[-100px] right-[-100px]"></div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT: TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold">
            🚨 Emergency? We Respond Instantly
          </h2>

          <p className="mt-4 text-white/90">
            Our system detects urgency and immediately connects you with nearby
            professionals. Fast response, real help, no delays.
          </p>

          <button
            onClick={() => navigate("/emergency-workers")}
            className="mt-6 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Get Emergency Help
          </button>
        </motion.div>

        {/* RIGHT: ANIMATION */}
        <motion.div
          className="relative flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-xl">
            <AlertTriangle size={80} className="text-white" />
            <p className="mt-4 text-center text-sm">
              Emergency detected ⚡
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default EmergencyResponseSection;