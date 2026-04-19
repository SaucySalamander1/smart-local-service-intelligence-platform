// frontend/src/pages/PostJob.js
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = [
  "electrical", "plumbing", "ac_cooling", "carpentry", "painting",
  "roofing", "flooring", "home_cleaning", "pest_control", "refrigerator",
  "washing_machine", "tv_electronics", "generator_ips", "gardening",
  "water_pump", "car_service", "bike_repair", "moving_shifting",
  "cctv_security", "lock_key", "general"
];

export default function PostJob() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: state?.diagnosis || "",
    category: state?.category || "general",
    budget: "",
    area: "",
    urgency: "normal",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) { navigate("/login"); return null; }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.area.trim()) {
      alert("Please fill in all required fields (Title, Description, Area).");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        area: form.area.trim(),
        urgency: form.urgency,
        budget: form.budget ? parseInt(form.budget) : 0
      };
      console.log("📤 Posting job with payload:", payload);
      console.log("🔑 Token:", token ? "✅ Present" : "❌ Missing");
      const res = await axios.post("http://localhost:5000/api/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Job posted successfully! Response:", res.data);
      setSuccess(true);
    } catch (err) {
      console.error("❌ Error posting job:");
      console.error("Status:", err.response?.status);
      console.error("Message:", err.response?.data?.message);
      console.error("Full error:", err.response?.data);
      alert(err.response?.data?.message || "Failed to post job. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-sm w-full mx-4">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Job Posted!</h2>
          <p className="text-gray-500 text-sm mb-6">Workers will review and submit bids. You'll be notified when someone bids.</p>
          <div className="space-y-3">
            <button onClick={() => navigate("/customer/dashboard")}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
              View My Jobs
            </button>
            <button onClick={() => navigate("/")}
              className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 pt-4 pb-6">
        <button onClick={() => navigate(-1)} className="text-green-200 text-sm mb-3 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">📋 Post a Job</h1>
        <p className="text-green-100 text-xs mt-1">Workers will bid — you choose who to hire</p>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-6 space-y-4">

        {/* AI info */}
        {state?.category && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 items-start">
            <span className="text-lg">🤖</span>
            <p className="text-blue-700 text-sm">
              AI detected: <strong className="capitalize">{state.category.replace(/_/g, " ")}</strong>.
              Category and description are pre-filled from your diagnosis.
            </p>
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Fix AC not cooling in bedroom"
            className="w-full px-4 py-2 border rounded-xl outline-none focus:border-green-400 text-sm" />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Describe the problem in detail..." rows={4}
            className="w-full px-4 py-2 border rounded-xl outline-none focus:border-green-400 text-sm resize-none" />
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl outline-none focus:border-green-400 text-sm bg-white">
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Budget + Urgency */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (৳)</label>
            <input name="budget" type="number" value={form.budget} onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full px-4 py-2 border rounded-xl outline-none focus:border-green-400 text-sm" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Urgency</label>
            <select name="urgency" value={form.urgency} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl outline-none focus:border-green-400 text-sm bg-white">
              <option value="low">🟢 Low</option>
              <option value="normal">🟡 Normal</option>
              <option value="high">🔴 Urgent</option>
            </select>
          </div>
        </div>

        {/* Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Area <span className="text-red-500">*</span>
          </label>
          <input name="area" value={form.area} onChange={handleChange}
            placeholder="e.g. Mirpur 10, Dhaka"
            className="w-full px-4 py-2 border rounded-xl outline-none focus:border-green-400 text-sm" />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-base hover:bg-green-700 transition disabled:opacity-50">
          {loading ? "Posting..." : "📋 Post Job"}
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          Workers will bid on your job. You choose and hire the best one.
        </p>
      </div>
    </div>
  );
}