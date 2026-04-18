// frontend/src/pages/Customer/JobDetail.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerNavBar from "../../components/Navbars/CustomerNavbar";

const API = "http://localhost:5000/api/jobs";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(res.data.job);
      setBids(res.data.bids);
    } catch (err) {
      console.error("Failed to fetch job:", err);
    }
    setLoading(false);
  };

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm("Accept this bid? Other bids will be rejected.")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/${id}/accept/${bidId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Bid accepted! Job is now in progress.");
      fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept bid");
    }
    setActionLoading(false);
  };

  const handleConfirmCompletion = async () => {
    if (!window.confirm("Confirm that the job has been completed?")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/${id}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Job confirmed as completed! Please pay admin to release worker payment.");
      fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm");
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-400">
            <div className="text-4xl animate-pulse mb-2">📋</div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavBar />
        <div className="text-center py-20 text-gray-400">
          <p>Job not found.</p>
          <button onClick={() => navigate("/customer/my-jobs")} className="mt-4 text-blue-600">← Back to My Jobs</button>
        </div>
      </div>
    );
  }

  const pendingBids = bids.filter(b => b.status === "pending");
  const acceptedBid = bids.find(b => b.status === "accepted");

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <CustomerNavBar />

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back */}
        <button onClick={() => navigate("/customer/my-jobs")}
          className="text-gray-500 text-sm mb-4 flex items-center gap-1 hover:text-gray-700">
          ← Back to My Jobs
        </button>

        {/* Job Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{job.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{job.description}</p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium flex-shrink-0 ${
              job.status === "open" ? "bg-blue-100 text-blue-700" :
              job.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
              job.status === "completed" ? "bg-green-100 text-green-700" :
              "bg-purple-100 text-purple-700"
            }`}>
              {job.status === "open" ? "📢 Open" :
               job.status === "in_progress" ? "🔧 In Progress" :
               job.status === "completed" ? "✅ Completed" : "💰 Paid"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Category</p>
              <p className="font-medium capitalize">{job.category?.replace(/_/g, " ")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Budget</p>
              <p className="font-medium">{job.budget > 0 ? `৳${job.budget}` : "Negotiable"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Area</p>
              <p className="font-medium">{job.area}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Urgency</p>
              <p className={`font-medium ${job.urgency === "high" ? "text-red-600" : job.urgency === "normal" ? "text-blue-600" : "text-gray-600"}`}>
                {job.urgency === "high" ? "🔴 Urgent" : job.urgency === "normal" ? "🟡 Normal" : "🟢 Low"}
              </p>
            </div>
          </div>

          {/* Confirm completion button */}
          {job.status === "in_progress" && job.workerMarkedDone && !job.customerConfirmed && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-semibold text-sm mb-2">
                ✅ Worker has marked this job as done!
              </p>
              <p className="text-green-600 text-xs mb-3">
                Please confirm completion to release payment to the worker through admin.
              </p>
              <button onClick={handleConfirmCompletion} disabled={actionLoading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50">
                {actionLoading ? "Confirming..." : "✅ Confirm Job Completed"}
              </button>
            </div>
          )}

          {/* Payment notice */}
          {job.status === "completed" && !job.adminPaid && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-700 font-semibold text-sm">💰 Payment Pending</p>
              <p className="text-yellow-600 text-xs mt-1">
                Please pay admin to release payment to the worker. Contact admin for payment details.
              </p>
            </div>
          )}

          {job.status === "paid" && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
              <p className="text-purple-700 font-semibold text-sm">💰 Payment Released — Job Complete!</p>
            </div>
          )}
        </div>

        {/* Hired Worker */}
        {job.hiredWorker && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">👷 Hired Worker</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                {job.hiredWorker.profilePicture
                  ? <img src={job.hiredWorker.profilePicture} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl">👷</div>}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{job.hiredWorker.name}</p>
                <p className="text-xs text-gray-500">⭐ {job.hiredWorker.rating?.toFixed(1) || "0.0"} · 📍 {job.hiredWorker.serviceArea}</p>
              </div>
              <div className="flex gap-2">
                {job.hiredWorker.phone && (
                  <a href={`tel:${job.hiredWorker.phone}`}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition">
                    📞 Call
                  </a>
                )}
                <button onClick={() => navigate(`/messages?workerId=${job.hiredWorker._id}`)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                  💬 Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accepted Bid */}
        {acceptedBid && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
            <h2 className="font-bold text-green-700 mb-2">✅ Accepted Bid</h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><p className="text-xs text-gray-500">Price</p><p className="font-bold text-gray-800">৳{acceptedBid.price}</p></div>
              <div><p className="text-xs text-gray-500">Est. Time</p><p className="font-medium">{acceptedBid.estimatedTime}</p></div>
              <div><p className="text-xs text-gray-500">Location</p><p className="font-medium">{acceptedBid.workerLocation || "—"}</p></div>
            </div>
            <p className="text-gray-600 text-sm mt-3 bg-white rounded-lg p-3">"{acceptedBid.message}"</p>
          </div>
        )}

        {/* Bids Section */}
        {job.status === "open" && (
          <div>
            <h2 className="font-bold text-gray-800 mb-3">
              💬 Bids Received
              <span className="ml-2 text-sm font-normal text-gray-500">({bids.length} total)</span>
            </h2>

            {bids.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                <div className="text-4xl mb-2">⏳</div>
                <p>No bids yet. Workers will bid soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bids.map(bid => (
                  <div key={bid._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                    {/* Worker info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {bid.worker?.profilePicture
                          ? <img src={bid.worker.profilePicture} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">👷</div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{bid.worker?.name}</p>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>⭐ {bid.worker?.rating?.toFixed(1) || "0.0"}</span>
                          <span>✅ {bid.worker?.jobsDone || 0} jobs</span>
                          <span>📍 {bid.workerLocation || bid.worker?.serviceArea || "—"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">৳{bid.price}</p>
                        <p className="text-xs text-gray-500">{bid.estimatedTime}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    {bid.worker?.skills?.length > 0 && (
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {bid.worker.skills.slice(0, 4).map((s, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                            {s.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Message */}
                    <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3 mb-3">
                      "{bid.message}"
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/messages?workerId=${bid.worker?._id}`)}
                        className="flex-1 border border-blue-500 text-blue-600 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
                        💬 Chat First
                      </button>
                      <button
                        onClick={() => navigate(`/worker-profile/${bid.worker?._id}`)}
                        className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
                        👁️ View Profile
                      </button>
                      <button
                        onClick={() => handleAcceptBid(bid._id)}
                        disabled={actionLoading}
                        className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-50">
                        {actionLoading ? "..." : "✅ Hire"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}