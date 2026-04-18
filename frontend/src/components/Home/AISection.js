import { useNavigate } from "react-router-dom";
import { Brain, ShieldCheck, MapPin } from "lucide-react";

const AISection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-4">
          AI-Powered Smart Assistance
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Diagnose problems, detect risks, and connect with experts instantly.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">

          {[{
            icon: <Brain className="text-blue-600" />,
            title: "Smart Diagnosis",
            desc: "AI instantly understands your issue."
          },{
            icon: <ShieldCheck className="text-green-600" />,
            title: "Risk Detection",
            desc: "Detects dangerous situations early."
          },{
            icon: <MapPin className="text-red-500" />,
            title: "Local Experts",
            desc: "Connects you to nearby professionals."
          }].map((item, i) => (

            <div key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition duration-300">

              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>

            </div>
          ))}

        </div>

        <div className="mt-10 flex gap-3 justify-center">

          <button
            onClick={() => navigate("/ai-chat")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition"
          >
            🧠 Try AI
          </button>

          <button
            onClick={() => navigate("/emergency-workers")}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition"
          >
            🚨 Emergency
          </button>

        </div>
      </div>
    </section>
  );
};

export default AISection;