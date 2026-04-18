// frontend/src/pages/Admin/AdminJobs.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavBar from "../../components/Navbars/AdminNavbar";

const API = "http://localhost:5000/api/jobs";

const statusConfig = {
  open:        { label: "Open",        color: "bg-blue-100 text-blue-700",    icon: "📢" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-700", icon: "🔧" },
  completed:   { label: "Completed",   color: "bg-green-100 text-green-700",   icon: "✅" },
  paid:        { label: "Paid",        color: "bg-purple-100 text-purple-700", icon: "💰" },
};

export default function AdminJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchJobs(); }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = filter === "all" ? `${API}/admin/all` : `${API}/admin/all?status=${filter}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
    setLoading(false);
  };

  const handleMarkPaid = async (jobId) => {
    if (!window.confirm("Mark payment as released to worker?")) return;
    setActionLoading(jobId);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/${jobId}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Payment released successfully!");
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to release payment");
    }
    setActionLoading(null);
  };

  const counts = {
    all: jobs.length,
    open: jobs.filter(j => j.status === "open").length,
    in_progress: jobs.filter(j => j.status === "in_progress").length,
    completed: jobs.filter(j => j.status === "completed").length,
    paid: jobs.filter(j => j.status === "paid").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📋 All Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all job postings and payments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { key: "all", label: "Total", color: "bg-gray-800" },
            { key: "open", label: "Open", color: "bg-blue-600" },
            { key: "in_progress", label: "In Progress", color: "bg-yellow-500" },
            { key: "completed", label: "Completed", color: "bg-green-600" },
            { key: "paid", label: "Paid", color: "bg-purple-600" },
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={`${s.color} text-white rounded-xl p-3 text-center transition ${filter === s.key ? "ring-2 ring-white ring-offset-2" : "opacity-80 hover:opacity-100"}`}>
              <p className="text-2xl font-bold">{counts[s.key]}</p>
              <p className="text-xs mt-0.5 opacity-90">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Jobs table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl animate-pulse mb-2">📋</div>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => {
              const sConfig = statusConfig[job.status] || statusConfig.open;
              return (
                <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{job.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sConfig.color}`}>
                          {sConfig.icon} {sConfig.label}
                        </span>
                        {job.urgency === "high" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">🔴 Urgent</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{job.description}</p>
                    </div>
                    {job.budget > 0 && (
                      <p className="font-bold text-gray-800 flex-shrink-0">৳{job.budget}</p>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs text-gray-500">
                    <span>📍 {job.area}</span>
                    <span>🏷️ {job.category?.replace(/_/g, " ")}</span>
                    <span>👤 Customer: {job.customer?.name || "—"}</span>
                    <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Hired worker */}
                  {job.hiredWorker && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">👷 Worker:</span>
                        <span className="text-xs font-medium text-gray-700">{job.hiredWorker.name}</span>
                        {job.hiredWorker.phone && (
                          <a href={`tel:${job.hiredWorker.phone}`}
                            className="text-xs text-blue-600 hover:underline">{job.hiredWorker.phone}</a>
                        )}
                      </div>

                      {/* Pay button — only for completed unpaid jobs */}
                      {job.status === "completed" && !job.adminPaid && (
                        <button
                          onClick={() => handleMarkPaid(job._id)}
                          disabled={actionLoading === job._id}
                          className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 transition disabled:opacity-50">
                          {actionLoading === job._id ? "Processing..." : "💰 Release Payment"}
                        </button>
                      )}

                      {job.status === "paid" && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                          💰 Payment Released
                        </span>
                      )}
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