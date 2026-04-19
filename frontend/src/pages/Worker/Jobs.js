import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WorkerNavBar from "../../components/Navbars/WorkerNavbar";
import Footer from "../../components/Footer/Footer";

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

export default function WorkerJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🔄 Fetching jobs from:", API);
      const res = await axios.get(`${API}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Jobs response:", res.data);
      const jobsData = res.data.data || res.data;
      console.log("📋 Extracted jobs:", jobsData);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to fetch jobs:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Failed to load jobs. Please try again.");
    }
    setLoading(false);
  };

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WorkerNavBar />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Available Jobs</h1>
          <p className="text-gray-600">Browse and bid on jobs posted by customers in your area</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", "open", "in_progress", "completed", "paid"].map(s => (
            <button key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === s ? "bg-orange-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}>
              {s === "all" ? "All Jobs" : statusConfig[s]?.label}
              {s !== "all" && (
                <span className="ml-1 text-xs">
                  ({jobs.filter(j => j.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Jobs Found</h3>
            <p className="text-gray-500">
              {filter === "all" 
                ? "No jobs available right now. Check back later!"
                : `No jobs with status "${statusConfig[filter]?.label}"`
              }
            </p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200">
                
                {/* Job Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                  <h3 className="text-lg font-bold truncate">{job.title}</h3>
                  <p className="text-sm text-orange-100 truncate">{job.category}</p>
                </div>

                {/* Job Body */}
                <div className="p-4 space-y-3">
                  
                  {/* Description */}
                  <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>

                  {/* Status & Urgency */}
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[job.status]?.color}`}>
                      {statusConfig[job.status]?.icon} {statusConfig[job.status]?.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyConfig[job.urgency]?.color}`}>
                      {urgencyConfig[job.urgency]?.label}
                    </span>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Budget:</span>
                    <span className="text-lg font-bold text-orange-600">
                      ৳{job.budget ? job.budget.toLocaleString() : "TBD"}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <span>📍</span>
                    <span className="truncate">{job.location || "Not specified"}</span>
                  </div>

                  {/* Bids Count */}
                  <div className="text-gray-600 text-sm">
                    💼 {job.bids?.length || 0} bid{job.bids?.length !== 1 ? "s" : ""} received
                  </div>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/worker/job-detail/${job._id}`)}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                  >
                    View Details & Bid
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
