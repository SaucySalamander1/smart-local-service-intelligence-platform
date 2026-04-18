// frontend/src/pages/AIChat.js

import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startAISession, continueAISession } from "../api/ai";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";

// 👉 Import your navbars (adjust paths if needed)
import CustomerNavbar from "../components/Navbars/CustomerNavbar";
import WorkerNavbar from "../components/Navbars/WorkerNavbar";
import AdminNavbar from "../components/Navbars/AdminNavbar";

export default function AIChat() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(state?.problem || "");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);

  const hasSent = useRef(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      alert("You must login to use AI support");
      navigate("/login");
      return;
    }
    if (state?.problem && !hasSent.current) {
      hasSent.current = true;
      handleStart(state.problem);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setImage({ base64, mime: file.type });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStart = async (text) => {
    const msg = text || input;
    if (!msg.trim() && !image) return;

    setLoading(true);
    addMessage("user", { text: msg, image: imagePreview });
    setInput("");
    setImagePreview(null);

    try {
      const result = await startAISession(
        msg,
        image?.base64 || null,
        image?.mime || null
      );
      setImage(null);
      setSessionId(result.sessionId);
      handleResponse(result);
    } catch (err) {
      addMessage("ai", { text: "Sorry, something went wrong. Please try again." });
    }
    setLoading(false);
  };

  const handleAnswer = async (text) => {
    const msg = text || input;
    if (!msg.trim() || !sessionId) return;

    setLoading(true);
    setWaitingForAnswer(false);
    addMessage("user", { text: msg });
    setInput("");

    try {
      const result = await continueAISession(sessionId, msg);
      handleResponse(result);
    } catch (err) {
      addMessage("ai", { text: "Sorry, something went wrong. Please try again." });
    }
    setLoading(false);
  };

  const handleResponse = (result) => {
    if (result.type === "question") {
      addMessage("ai", { text: result.question, isQuestion: true });
      setWaitingForAnswer(true);
    } else if (result.type === "result") {
      navigate("/ai/result", { state: result });
    }
  };

  // 👉 Role-based navbar renderer
  const renderNavbar = () => {
    if (!user) return null;

    switch (user.role) {
      case "customer":
        return <CustomerNavbar />;
      case "worker":
        return <WorkerNavbar />;
      case "admin":
        return <AdminNavbar />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* Navbar */}
      {renderNavbar()}

      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between shadow">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm hover:opacity-80"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Title */}
        <div className="text-center flex-1">
          <h1 className="text-xl font-bold">🤖 AI Home Assistant</h1>
          <p className="text-xs text-blue-100 mt-0.5">
            Describe your problem or upload a photo
          </p>
        </div>

        {/* Spacer */}
        <div className="w-12"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-24">
            <div className="text-6xl mb-3">🛠️</div>
            <p className="font-semibold text-gray-500">What's the problem?</p>
            <p className="text-sm mt-1">Type your issue or upload a photo</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-2xl p-3 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100"
              }`}
            >
              {msg.content.image && (
                <img
                  src={msg.content.image}
                  alt="uploaded"
                  className="rounded-lg mb-2 max-h-36 object-cover w-full"
                />
              )}
              <p className="text-sm leading-relaxed">{msg.content.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm rounded-2xl rounded-bl-none p-3 border border-gray-100">
              <div className="flex space-x-1">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 py-2 bg-white border-t flex items-center gap-2">
          <img
            src={imagePreview}
            alt="preview"
            className="h-14 w-14 object-cover rounded-lg border"
          />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Image ready to send</p>
          </div>
          <button
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            className="text-red-400 text-sm hover:text-red-600"
          >
            ✕ Remove
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t shadow-sm">
        <div className="flex gap-2 items-center">
          
          {/* Image upload */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 text-gray-400 hover:text-blue-500 transition text-xl"
            title="Upload photo"
          >
            📷
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Text input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sessionId ? handleAnswer(input) : handleStart();
              }
            }}
            placeholder={
              waitingForAnswer
                ? "Type your answer..."
                : "Describe your problem..."
            }
            className="flex-1 px-4 py-2 border rounded-xl outline-none focus:border-blue-400 text-sm"
          />

          {/* Send */}
          <button
            onClick={() =>
              sessionId ? handleAnswer(input) : handleStart()
            }
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition text-sm font-semibold"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}