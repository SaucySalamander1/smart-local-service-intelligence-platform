// frontend/src/pages/ResultPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { recheckAISession } from "../api/ai";
import { getImage } from "../api/unsplash";

const threatConfig = {
  low:    { headerBg: "bg-green-500",  icon: "✅", label: "LOW RISK",    text: "text-green-700"  },
  medium: { headerBg: "bg-yellow-500", icon: "⚡", label: "MEDIUM RISK", text: "text-yellow-700" },
  high:   { headerBg: "bg-red-600",    icon: "🚨", label: "HIGH RISK",   text: "text-red-700"    },
};

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
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
      pImgs[i] = await getImage(state.precautions[i].imageQuery || `safety ${state.precautions[i].text}`);
    }
    setStepImages(sImgs);
    setPrecautionImages(pImgs);
    setImagesLoading(false);
  };

  // ── No data ──
  if (!state) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow max-w-sm">
          <div className="text-5xl mb-3">🤖</div>
          <p className="text-gray-500 mb-4">No diagnosis data found.</p>
          <button onClick={() => navigate("/ai-chat")}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
            Start New Chat
          </button>
        </div>
      </div>
    );
  }

  const {
    sessionId, threatLevel = "medium", confidence = 50, diagnosis = "",
    precautions = [], steps = [], workers = [], emergency = {}, category = "general",
  } = state;

  const config = threatConfig[threatLevel] || threatConfig.medium;
  const isHigh   = threatLevel === "high";
  const isMidHigh = threatLevel === "medium" || threatLevel === "high";

  const handleRecheck = async (isFixed) => {
    if (isFixed) { setResolved(true); return; }
    setRecheckLoading(true);
    try {
      const result = await recheckAISession(sessionId, false);
      if (result.type === "result") navigate("/ai/result", { state: result });
      else if (result.type === "resolved") setResolved(true);
    } catch { alert("Failed to recheck. Please try again."); }
    setRecheckLoading(false);
  };

  // ── Resolved ──
  if (resolved) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-sm w-full mx-4">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Problem Solved!</h2>
          <p className="text-gray-500 text-sm mb-6">Great job! Stay safe.</p>
          <button onClick={() => navigate("/")}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* ── THREAT BANNER ── */}
      <div className={`${config.headerBg} text-white py-8 px-6 text-center`}>
        <div className="text-5xl mb-2">{config.icon}</div>
        <h1 className="text-2xl font-bold tracking-wide">{config.label}</h1>
        <div className="mt-2 inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
          Confidence: {confidence}%
        </div>
        <p className="mt-3 text-white/90 text-sm max-w-lg mx-auto leading-relaxed">{diagnosis}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">

        {/* ── PRECAUTIONS ── */}
        {precautions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
              <h2 className="font-bold text-orange-700 text-sm">⚠️ Important Precautions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {precautions.map((p, i) => (
                <div key={i} className="flex items-stretch" style={{ minHeight: "80px" }}>
                  {/* LEFT: image fixed width */}
                  <div className="flex-shrink-0 bg-orange-50 overflow-hidden" style={{ width: "100px" }}>
                    {precautionImages[i] ? (
                      <img src={precautionImages[i]} alt={p.text}
                        className="w-full h-full object-cover" style={{ minHeight: "80px" }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl" style={{ minHeight: "80px" }}>
                        {imagesLoading
                          ? <div className="w-4 h-4 border-2 border-orange-300 border-t-transparent rounded-full animate-spin" />
                          : (p.icon || "⚠️")}
                      </div>
                    )}
                  </div>
                  {/* RIGHT: text */}
                  <div className="flex-1 px-4 py-3 flex items-center">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      <span className="mr-1">{p.icon || "⚠️"}</span>{p.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP BY STEP ── */}
        {steps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-bold text-gray-800">🛠️ Step-by-Step Guide</h2>
              {imagesLoading && <span className="text-xs text-gray-400 animate-pulse">Loading images...</span>}
            </div>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Step header */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-blue-600">
                    <div className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {step.stepNumber || i + 1}
                    </div>
                    <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                  </div>

                  {/* Image LEFT — Description RIGHT */}
                  <div className="flex items-stretch">
                    {/* LEFT: image fixed 130px */}
                    <div className="flex-shrink-0 bg-gray-100 overflow-hidden" style={{ width: "130px" }}>
                      {stepImages[step.stepNumber] ? (
                        <img src={stepImages[step.stepNumber]} alt={step.title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: "110px", maxHeight: "150px" }} />
                      ) : (
                        <div className="w-full flex items-center justify-center bg-blue-50"
                          style={{ minHeight: "110px" }}>
                          {imagesLoading
                            ? <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                            : <span className="text-4xl">🔧</span>}
                        </div>
                      )}
                    </div>

                    {/* RIGHT: description */}
                    <div className="flex-1 p-4">
                      <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      {step.warning && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 flex gap-2 items-start">
                          <span className="text-red-500 text-xs flex-shrink-0 mt-0.5">🔴</span>
                          <p className="text-red-700 text-xs leading-relaxed">{step.warning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DID IT FIX? (LOW only) ── */}
        {!isMidHigh && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 mb-3 text-sm">Did this solve your problem?</h2>
            <div className="flex gap-3">
              <button onClick={() => handleRecheck(true)}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition text-sm">
                ✅ Yes, Fixed!
              </button>
              <button onClick={() => handleRecheck(false)} disabled={recheckLoading}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50 text-sm">
                {recheckLoading ? "Re-evaluating..." : "❌ Not Fixed"}
              </button>
            </div>
          </div>
        )}

        {/* ── MID/HIGH — EMERGENCY SECTION ── */}
        {isMidHigh && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl overflow-hidden">
            <div className="bg-red-600 text-white px-5 py-4 text-center">
              <span className="text-3xl">🚨</span>
              <h2 className="font-bold text-lg mt-1">Professional Help Recommended</h2>
              {emergency?.message && <p className="text-red-100 text-xs mt-1">{emergency.message}</p>}
              {emergency?.callNumber && <p className="font-bold mt-1 text-sm">Emergency: {emergency.callNumber}</p>}
            </div>

            <div className="p-4 space-y-3">
              {/* Emergency Service */}
              <button
                onClick={() => navigate("/emergency-workers", { state: { category, area: "" } })}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm">
                🚨 Emergency Service
                <span className="text-xs font-normal opacity-80">(Nearby, sorted by rating)</span>
              </button>

              {/* Browse Workers */}
              <button
                onClick={() => navigate("/customer/browse-workers", { state: { preCategory: category } })}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm">
                👷 Browse Workers
              </button>

              {/* Post a Job */}
              <button
                onClick={() => navigate("/post-job", { state: { category, diagnosis } })}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm">
                📋 Post a Job
                <span className="text-xs font-normal opacity-80">(Workers will bid)</span>
              </button>

              {/* Medium — also show recheck */}
              {threatLevel === "medium" && (
                <div className="pt-3 border-t border-red-200">
                  <p className="text-center text-xs text-red-600 mb-3">Or try fixing it yourself first:</p>
                  <div className="flex gap-3">
                    <button onClick={() => handleRecheck(true)}
                      className="flex-1 bg-white border border-green-400 text-green-600 py-2 rounded-xl text-sm font-semibold hover:bg-green-50 transition">
                      ✅ Fixed!
                    </button>
                    <button onClick={() => handleRecheck(false)} disabled={recheckLoading}
                      className="flex-1 bg-white border border-red-400 text-red-600 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50">
                      {recheckLoading ? "Checking..." : "❌ Not Fixed"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RECOMMENDED WORKERS ── */}
        {workers && workers.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-3">👷 Recommended Workers</h2>
            <div className="space-y-3">
              {workers.map((worker) => (
                <div key={worker.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-gray-200">
                    {worker.profilePicture
                      ? <img src={worker.profilePicture} alt={worker.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">👷</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{worker.name}</h3>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full text-white flex-shrink-0 ${worker.availability === "online" ? "bg-green-500" : "bg-gray-400"}`}>
                        {worker.availability === "online" ? "🟢" : "⚫"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
                      <span>⭐ {worker.rating?.toFixed(1) || "0.0"}</span>
                      <span>✅ {worker.jobsDone || 0} jobs</span>
                      <span>📍 {worker.serviceArea || "Dhaka"}</span>
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {worker.skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                          {s.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => navigate(`/worker-profile/${worker.id}`)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex-shrink-0">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── START OVER ── */}
        <button onClick={() => navigate("/ai-chat")}
          className="w-full py-3 border-2 border-gray-200 text-gray-500 rounded-xl hover:bg-gray-100 transition text-sm">
          🔄 Start New Diagnosis
        </button>

      </div>
    </div>
  );
}