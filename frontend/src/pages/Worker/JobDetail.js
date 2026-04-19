import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import WorkerNavBar from "../../components/Navbars/WorkerNavbar";
import Footer from "../../components/Footer/Footer";

const API = "http://localhost:5000/api/jobs";

export default function WorkerJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasBid, setHasBid] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null;

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(res.data.job || res.data);
      const jobBids = res.data.bids || [];
      setBids(jobBids);

      // Check if current worker has already bid
      const userBid = jobBids.some(b => b.workerId === userId);
      setHasBid(userBid);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch job:", err);
      setError("Failed to load job details");
    }
    setLoading(false);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    if (!bidMessage.trim()) {
      alert("Please enter a message for your bid");
      return;
    }

    if (!estimatedDays || estimatedDays <= 0) {
      alert("Please enter estimated days to complete");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        price: parseInt(bidAmount),
        message: bidMessage.trim(),
        estimatedTime: parseInt(estimatedDays)
      };
      console.log("📤 Submitting bid with payload:", payload);
      const res = await axios.post(`${API}/${id}/bid`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Bid submitted successfully! Response:", res.data);
      alert("Bid submitted successfully!");
      setBidAmount("");
      setBidMessage("");
      setEstimatedDays("");
      setHasBid(true);
      fetchJob();
    } catch (err) {
      console.error("❌ Error submitting bid:", err.response?.data);
      alert(err.response?.data?.message || "Failed to submit bid");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <WorkerNavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <WorkerNavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Job not found</p>
            <button
              onClick={() => navigate("/worker/jobs")}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WorkerNavBar />

      <div className="flex-grow max-w-4xl w-full mx-auto px-4 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate("/worker/jobs")}
          className="text-orange-600 hover:text-orange-700 mb-6 flex items-center gap-2"
        >
          ← Back to Jobs
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">

            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-gray-500 mt-1">Category: {job.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">৳{job.budget?.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Budget</div>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  job.status === "open" ? "bg-blue-100 text-blue-700" :
                  job.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {job.status === "open" ? "📢 Open" :
                   job.status === "in_progress" ? "🔧 In Progress" :
                   "✅ Completed"}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  job.urgency === "high" ? "bg-red-100 text-red-700" :
                  job.urgency === "normal" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {job.urgency === "high" ? "🔴 Urgent" :
                   job.urgency === "normal" ? "🟡 Normal" :
                   "🟢 Low Priority"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Location & Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="text-gray-900 font-medium">{job.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Posted Date</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Bids */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">💼 Bids ({bids.length})</h2>
              {bids.length === 0 ? (
                <p className="text-gray-500">No bids yet. Be the first!</p>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{bid.workerName || "Anonymous Worker"}</p>
                          <p className="text-sm text-gray-500">{bid.message || "No message"}</p>
                        </div>
                        <p className="text-lg font-bold text-orange-600">৳{bid.amount?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Bid Form Sidebar */}
          <div className="md:col-span-1">

            {job.status === "open" ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 border-l-4 border-orange-600">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Place Your Bid</h3>

                {hasBid ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                    ✅ You have already placed a bid for this job
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBid} className="space-y-4">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bid Amount (৳) *
                      </label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Days to Complete *
                      </label>
                      <input
                        type="number"
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(e.target.value)}
                        placeholder="e.g. 2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        placeholder="Tell the customer why you're the best fit..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Bid"}
                    </button>

                  </form>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg shadow-md p-6 sticky top-8">
                <p className="text-gray-600 text-center">
                  This job is no longer accepting bids
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
