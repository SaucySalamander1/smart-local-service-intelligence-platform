// frontend/src/pages/ResultPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { recheckAISession } from "../api/ai";
import { getImage } from "../api/unsplash";
import { AuthContext } from "../context/AuthContext";
import CustomerNavBar from "../components/Navbars/CustomerNavbar";
import HomeNavbar from "../components/Navbars/HomeNavBar";

const threatConfig = {
  low:    { headerBg: "bg-green-500",  icon: "✅", label: "LOW RISK" },
  medium: { headerBg: "bg-yellow-500", icon: "⚡", label: "MEDIUM RISK" },
  high:   { headerBg: "bg-red-600",    icon: "🚨", label: "HIGH RISK" }
};

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [recheckLoading, setRecheckLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [stepImages, setStepImages] = useState({});
  const [precautionImages, setPrecautionImages] = useState({});
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    if (!state) return;
    loadImages();
  }, [state]);

  const loadImages = async () => {
    setImagesLoading(true);
    const sImgs = {};
    const pImgs = {};

    for (let step of state.steps || []) {
      sImgs[step.stepNumber] = await getImage(step.imageQuery || step.title);
    }

    for (let i = 0; i < (state.precautions || []).length; i++) {
      pImgs[i] = await getImage(
        state.precautions[i].imageQuery || `safety ${state.precautions[i].text}`
      );
    }

    setStepImages(sImgs);
    setPrecautionImages(pImgs);
    setImagesLoading(false);
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
        {user ? <CustomerNavBar /> : <HomeNavbar />}
        <div className="flex items-center justify-center h-64">
          <div className="text-center p-8 bg-white rounded-2xl shadow max-w-sm">
            <div className="text-5xl mb-3">🤖</div>
            <p className="text-gray-500 mb-4">No diagnosis data found.</p>
            <button
              onClick={() => navigate("/ai-chat")}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Start New Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    sessionId,
    threatLevel = "medium",
    confidence = 50,
    diagnosis = "",
    precautions = [],
    steps = [],
    workers = [],
    category = "general"
  } = state;

  const config = threatConfig[threatLevel] || threatConfig.medium;
  const isMidHigh = threatLevel === "medium" || threatLevel === "high";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 pb-16">

      {user ? <CustomerNavBar /> : <HomeNavbar />}

      {/* HEADER */}
      <div className={`${config.headerBg} text-white py-8 px-6`}>
        <button
          onClick={() => navigate(-1)}
          className="text-white/80 hover:text-white text-sm mb-4"
        >
          ← Back
        </button>

        <div className="text-center max-w-3xl mx-auto">
          <div className="text-4xl mb-2">{config.icon}</div>
          <h1 className="text-2xl font-bold">{config.label}</h1>

          <p className="mt-3 text-sm text-white/90">{diagnosis}</p>

          {/* CONFIDENCE BAR */}
          <div className="mt-5 max-w-md mx-auto">
            <div className="flex justify-between text-xs text-white/80">
              <span>Confidence</span>
              <span>{confidence}%</span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2 mt-1">
              <div
                className="h-2 bg-white rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {isMidHigh && (
            <button
              onClick={() =>
                navigate("/emergency-workers", { state: { category } })
              }
              className="mt-5 bg-red-700 hover:bg-red-800 px-6 py-3 rounded-xl font-bold"
            >
              🚨 Emergency Help Now
            </button>
          )}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* PRECAUTIONS */}
          {precautions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-yellow-100 border-b">
                <h2 className="font-semibold text-yellow-800 text-sm">
                  ⚠️ Precautions
                </h2>
              </div>

              {precautions.map((p, i) => (
                <div key={i} className="flex gap-4 p-4 border-t bg-white/70">
                  <div className="w-20 h-20 bg-yellow-100 rounded-lg overflow-hidden">
                    {precautionImages[i] ? (
                      <img
                        src={precautionImages[i]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        ⚠️
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{p.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* STEPS */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden ${
                  i % 2 === 0 ? "bg-white" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-100 border-b">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.stepNumber || i + 1}
                  </div>
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                </div>

                <div className="flex flex-col md:flex-row">
                  <div className="md:w-40 h-40 bg-gray-100">
                    {stepImages[step.stepNumber] ? (
                      <img
                        src={stepImages[step.stepNumber]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        🔧
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1">
                    <p className="text-sm text-gray-700">{step.description}</p>

                    {step.warning && (
                      <div className="mt-3 bg-red-50 border-l-4 border-red-400 p-2 text-xs text-red-700">
                        ⚠️ {step.warning}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() =>
                navigate("/emergency-workers", { state: { category } })
              }
              className="bg-red-600 text-white py-3 rounded-xl"
            >
              🚨 Emergency Service
            </button>

            <button
              onClick={() =>
                navigate("/customer/browse-workers", { state: { preCategory: category } })
              }
              className="bg-blue-600 text-white py-3 rounded-xl"
            >
              👷 Browse Workers
            </button>

            <button
              onClick={() =>
                navigate("/post-job", { state: { category, diagnosis } })
              }
              className="bg-green-600 text-white py-3 rounded-xl"
            >
              📋 Post Job
            </button>

            <button
              onClick={() => navigate("/ai-chat")}
              className="bg-gray-900 text-white py-3 rounded-xl"
            >
              ✨ Start New Issue
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">

          {/* ADD INFO */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">Add More Info</h3>
            <textarea
              className="w-full border rounded-lg p-2 text-xs"
              rows={3}
              placeholder="Describe additional issue details..."
            />
            <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-sm">
              Save Info
            </button>
          </div>

          {/* FLAGS */}
          <div className="bg-white border rounded-xl p-4 text-xs space-y-2">
            <h3 className="font-semibold text-sm mb-2">Risk Flags</h3>
            <div className="flex justify-between">
              <span>Severity</span>
              <span className="font-bold">{threatLevel}</span>
            </div>
            <div className="flex justify-between">
              <span>Urgency</span>
              <span className="font-bold">{isMidHigh ? "High" : "Normal"}</span>
            </div>
            <div className="flex justify-between">
              <span>Category</span>
              <span className="font-bold">{category}</span>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-2">Summary</h3>
            <p className="text-xs text-gray-600">{diagnosis}</p>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border rounded-xl p-4 space-y-2">
            <button
              onClick={() => navigate("/ai-chat")}
              className="w-full bg-black text-white py-2 rounded-lg text-sm"
            >
              ✨ Start New Issue
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full border py-2 rounded-lg text-sm"
            >
              ⬅ Go Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}