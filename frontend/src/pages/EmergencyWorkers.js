// frontend/src/pages/EmergencyWorkers.js
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api/workers";

export default function EmergencyWorkers() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState(state?.area || "");
  const category = state?.category || "general";

  useEffect(() => {
    fetchWorkers();
  }, [area, category]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}?category=${category}&area=${area}&sort=emergency`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-red-600 text-white p-6">
        <button onClick={() => navigate(-1)} className="text-red-200 text-sm mb-2">← Back</button>
        <h1 className="text-2xl font-bold">🚨 Emergency Workers</h1>
        <p className="text-red-100 text-sm mt-1">
          Sorted by availability, rating, and completed jobs
        </p>
      </div>

      {/* Area filter */}
      <div className="p-4 bg-white border-b">
        <div className="flex gap-2">
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Enter your area (e.g. Mirpur, Dhanmondi...)"
            className="flex-1 px-4 py-2 border rounded-xl outline-none focus:border-red-400"
          />
          <button
            onClick={fetchWorkers}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Search
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Category: <span className="capitalize font-medium text-gray-600">{category}</span>
        </p>
      </div>

      {/* Worker list */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <p>Finding nearby workers...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2">😕</div>
            <p>No workers found in your area.</p>
            <p className="text-sm mt-1">Try a broader area like "Dhaka"</p>
          </div>
        ) : (
          workers.map((worker, i) => (
            <div
              key={worker._id}
              className={`bg-white rounded-2xl shadow-sm border-2 p-4 ${
                worker.availability === "online" ? "border-green-300" : "border-gray-100"
              }`}
            >
              <div className="flex gap-4">
                {/* Rank badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                  i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-blue-400"
                }`}>
                  {i + 1}
                </div>

                {/* Profile pic */}
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {worker.profilePicture ? (
                    <img src={worker.profilePicture} alt={worker.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">👷</div>
                  )}
                </div>

                {/* Worker info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800">{worker.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                      worker.availability === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}>
                      {worker.availability === "online" ? "🟢 Available Now" : "⚫ Offline"}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                    <span>⭐ {worker.rating?.toFixed(1) || "0.0"} ({worker.reviewCount || 0} reviews)</span>
                    <span>✅ {worker.jobsDone || 0} jobs</span>
                    <span>🗓️ {worker.experience || 0} yrs exp</span>
                  </div>

                  {/* Location */}
                  <div className="text-sm text-gray-500 mt-1">
                    📍 {worker.serviceArea || "Dhaka"}
                  </div>

                  {/* Skills */}
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {worker.skills?.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                        {s.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/worker-profile/${worker._id}`)}
                  className="flex-1 border border-blue-500 text-blue-500 py-2 rounded-xl text-sm hover:bg-blue-50 transition"
                >
                  View Profile
                </button>
                {worker.phone && (
                  <a
                    href={`tel:${worker.phone}`}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm text-center hover:bg-red-600 transition"
                  >
                    📞 Call Now
                  </a>
                )}
                <button
                  onClick={() => navigate(`/messages?workerId=${worker._id}`)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-sm hover:bg-blue-600 transition"
                >
                  💬 Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}