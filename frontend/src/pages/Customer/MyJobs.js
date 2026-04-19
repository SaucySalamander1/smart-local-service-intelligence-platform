// frontend/src/pages/Customer/MyJobs.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerNavBar from "../../components/Navbars/CustomerNavbar";

const API = "http://localhost:5000/api/jobs";

const statusConfig = {
  open:        { label: "Open",        color: "bg-blue-100 text-blue-700",   icon: "📢" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-700", icon: "🔧" },
  completed:   { label: "Completed",   color: "bg-green-100 text-green-700",  icon: "✅" },
  paid:        { label: "Paid",        color: "bg-purple-100 text-purple-700", icon: "💰" },
};

const urgencyConfig = {
  low:    { label: "Low",    color: "bg-gray-100 text-gray-600"   },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-600"   },
  high:   { label: "Urgent", color: "bg-red-100 text-red-600"     },
};

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
    setLoading(false);
  };

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 My Jobs</h1>
            <p className="text-gray-500 text-sm mt-1">Track all your posted jobs and bids</p>
          </div>
          <button onClick={() => navigate("/post-job")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition text-sm font-semibold">
            + Post New Job
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "open", "in_progress", "completed", "paid"].map(s => (
            <button key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === s ? "bg-gray-800 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}>
              {s === "all" ? "All" : statusConfig[s]?.label}
              {s !== "all" && (
                <span className="ml-1 text-xs">
                  ({jobs.filter(j => j.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Jobs list */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">📋</div>
            <p>Loading your jobs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-medium">No jobs found</p>
            <button onClick={() => navigate("/post-job")}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition text-sm">
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => {
              const sConfig = statusConfig[job.status] || statusConfig.open;
              const uConfig = urgencyConfig[job.urgency] || urgencyConfig.normal;
              return (
                <div key={job._id}
                  onClick={() => navigate(`/customer/jobs/${job._id}`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition">

                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{job.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sConfig.color}`}>
                          {sConfig.icon} {sConfig.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${uConfig.color}`}>
                          {uConfig.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{job.description}</p>
                    </div>
                    {job.budget > 0 && (
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-800">৳{job.budget}</p>
                        <p className="text-xs text-gray-400">Budget</p>
                      </div>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                    <span>📍 {job.area}</span>
                    <span>🏷️ {job.category?.replace(/_/g, " ")}</span>
                    <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                    {job.bidCount > 0 && (
                      <span className="text-blue-600 font-medium">💬 {job.bidCount} bid{job.bidCount !== 1 ? "s" : ""}</span>
                    )}
                  </div>

                  {/* Hired worker */}
                  {job.hiredWorker && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden">
                        {job.hiredWorker.profilePicture
                          ? <img src={job.hiredWorker.profilePicture} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-sm">👷</div>}
                      </div>
                      <span className="text-xs text-gray-600">
                        Hired: <strong>{job.hiredWorker.name}</strong>
                      </span>
                      {job.status === "in_progress" && job.workerMarkedDone && (
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          ✅ Worker marked done — confirm?
                        </span>
                      )}
                    </div>
                  )}

                  {/* View bids hint */}
                  {job.status === "open" && job.bidCount > 0 && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      → View bids and accept one
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}