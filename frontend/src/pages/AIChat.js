import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startAI, answerAI } from "../api/ai";
import { AuthContext } from "../context/AuthContext";

const AIChat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const initialProblem = location.state?.problem || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialProblem);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      alert("You must login to use AI support");
      navigate("/login");
    } else if (initialProblem) {
      handleStart(initialProblem);
    }
  }, [user, initialProblem, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = async (problemText) => {
    if (!problemText.trim()) return;
    setLoading(true);
    try {
      const res = await startAI(problemText);
      setSessionId(res.sessionId);
      setMessages([
        { type: "user", text: problemText },
        { type: "ai", text: res.question },
      ]);
      setInput("");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleSend = async (overrideInput) => {
    const text = overrideInput || input;
    if (!text.trim() || !sessionId) return;
    setLoading(true);

    try {
      const res = await answerAI(sessionId, text);
      let aiMessage = "";

      if (res.done) {
        const { threatLevel, confidence, solutions, precautions, workers } =
          res.result;

        const threatColors = {
          low: "bg-green-200 text-green-800",
          medium: "bg-yellow-200 text-yellow-800",
          high: "bg-red-200 text-red-800",
        };

        const threatIcons = { low: "✅", medium: "⚡", high: "⚠️" };

        aiMessage = (
          <div className={`p-3 rounded-lg ${threatColors[threatLevel]}`}>
            <div className="font-bold text-lg">
              {threatIcons[threatLevel]} Threat Level: {threatLevel.toUpperCase()}
            </div>
            <div className="mb-2">💡 Confidence: {confidence}%</div>
            <div className="mb-2">
              <div className="font-semibold">Solutions:</div>
              <ul className="list-disc ml-5">
                {solutions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <div className="font-semibold">Precautions:</div>
              <ul className="list-disc ml-5">
                {precautions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            {workers?.length > 0 && (
              <div className="mt-2">
                <div className="font-semibold">Recommended Workers Nearby:</div>
                <ul className="list-disc ml-5">
                  {workers.map((w) => (
                    <li key={w.id}>
                      {w.name} ({w.rating}⭐) — {w.price} — Locations:{" "}
                      {w.locations.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      } else {
        aiMessage = res.nextQuestion;
      }

      setMessages((prev) => [
        ...prev,
        { type: "user", text },
        { type: "ai", text: aiMessage },
      ]);
      setInput("");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-blue-600 text-white text-center text-xl font-bold">
        🛠 AI Home Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl p-3 rounded-lg ${
              msg.type === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "mr-auto"
            }`}
          >
            {msg.type === "ai" && typeof msg.text !== "string" ? msg.text : msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500">🤖 AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white flex flex-col gap-2 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 px-4 py-2 border rounded-lg outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") sessionId ? handleSend() : handleStart(input);
            }}
          />
          {!sessionId ? (
            <button
              onClick={() => handleStart(input)}
              className="bg-green-500 px-4 py-2 text-white rounded-lg"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => handleSend()}
              className="bg-blue-600 px-4 py-2 text-white rounded-lg"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;