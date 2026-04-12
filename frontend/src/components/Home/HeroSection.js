import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [problem, setProblem] = useState("");
  const navigate = useNavigate();

  const handleAskAI = () => {
    if (!problem.trim()) return;

    navigate("/ai-chat", {
      state: { problem }
    });
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32">
      <div className="max-w-5xl mx-auto text-center px-6">

        <h1 className="text-4xl md:text-5xl font-bold">
          Smart Local Service Platform
        </h1>

        <p className="mt-6 text-lg text-blue-100">
          Describe your problem and our AI assistant will guide you
          to the right solution or professional worker.
        </p>

        <div className="mt-10 flex justify-center">

          <input
            type="text"
            placeholder="Describe your problem..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAskAI();
            }}
            className="px-4 py-3 w-72 md:w-96 rounded-l-lg text-black outline-none"
          />

          <button
            onClick={handleAskAI}
            className="bg-green-500 px-6 py-3 rounded-r-lg hover:bg-green-600 transition"
          >
            Ask AI
          </button>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;