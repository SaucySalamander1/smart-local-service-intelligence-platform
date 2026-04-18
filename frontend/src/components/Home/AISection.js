// frontend/src/components/Home/AISection.js
import { useNavigate } from "react-router-dom";

const AISection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-4">
          AI Service Assistant
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Our AI analyzes your issue, evaluates risk,
          and recommends solutions or nearby professionals.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {/* ✅ Fixed — now navigates properly */}
          <button
            onClick={() => navigate("/ai-chat")}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition font-semibold"
          >
            🛠️ Start AI Chat
          </button>
          <button
            onClick={() => navigate("/emergency-workers", { state: { category: "general" } })}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
          >
            🚨 Emergency Service
          </button>
        </div>

      </div>
    </section>
  );
};

export default AISection;