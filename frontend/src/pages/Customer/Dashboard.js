import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavBar from '../../components/Navbars/CustomerNavbar';
import RatingModal from "../../components/RatingModal";
import { Bell, Search, User, AlertTriangle } from "lucide-react";
import { getMyJobs } from "../../api/jobs";
import { verifyOTP } from "../../api/payments";
import { submitRating } from "../../api/ratings";

export default function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingJobId, setConfirmingJobId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingJob, setRatingJob] = useState(null);

  useEffect(() => {
    fetchCustomerJobs();
  }, []);

  const fetchCustomerJobs = async () => {
    try {
      setLoading(true);
      const response = await getMyJobs();
      console.log("📊 Customer jobs response:", response);
      
      const jobs = response.data || [];
      const inProgress = jobs.filter(job => job.status === "in_progress" && job.hiredWorker);
      const completed = jobs.filter(job => job.status === "completed" || job.status === "paid");
      
      console.log("✅ In progress jobs:", inProgress.length);
      console.log("✅ Completed jobs:", completed.length);
      
      setInProgressJobs(inProgress);
      setCompletedJobs(completed);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching customer jobs:", err);
      setError("Failed to load your jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCompletion = async (jobId) => {
    setConfirmingJobId(jobId);
    try {
      console.log("💰 Processing payment for job:", jobId);
      const result = await verifyOTP(jobId, "123456");
      console.log("✅ Payment processed:", result);
      alert("✅ Payment completed! Job is now marked as paid.");
      
      // Find the job to get worker info
      const job = inProgressJobs.find(j => j._id === jobId);
      if (job) {
        setRatingJob(job);
        setShowRatingModal(true);
      }
      
      await fetchCustomerJobs();
    } catch (err) {
      console.error("❌ Error processing payment:", err);
      alert(err.response?.data?.message || "Failed to process payment");
    } finally {
      setConfirmingJobId(null);
    }
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      await submitRating(ratingJob._id, ratingJob.hiredWorker._id, ratingData.rating, ratingData.review);
      alert("✅ Rating submitted! Thank you for your feedback.");
      setShowRatingModal(false);
      setRatingJob(null);
      await fetchCustomerJobs();
    } catch (err) {
      console.error("Error submitting rating:", err);
      throw err;
    }
  };

  const handleServiceClick = (service) => {
    navigate("/ai-chat", { state: { problem: service } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <CustomerNavBar />

      {/* HEADER */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        
        {/* Search */}
        <div className="flex items-center bg-gray-100 px-3 py--2 rounded-xl w-1/2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none ml-2 w-full text-sm"
          />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <Bell className="text-gray-600 cursor-pointer" />
          <div
            onClick={() => navigate("/customer/profile")}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
          >
            <User className="text-gray-600" />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* AI ASSISTANT */}
        <div 
          onClick={() => navigate("/ai-chat")}
          className="bg-blue-600 text-white rounded-2xl p-5 shadow cursor-pointer hover:bg-blue-700 mb-8"
        >
          <h2 className="text-lg font-semibold">💬 AI Assistant</h2>
          <p className="text-sm mt-1 text-blue-100">
            Ask anything about your problem
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* In Progress Jobs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🔄 In Progress ({inProgressJobs.length})
          </h2>

          {inProgressJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No active jobs</p>
              <button
                onClick={() => navigate("/browse-workers")}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Browse Workers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inProgressJobs.map(job => (
                <div key={job._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Worker:</span> {job.hiredWorker?.name || "Unknown"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Location:</span> {job.area}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Category:</span> {job.category}
                    </p>
                    <p className="text-orange-600 font-bold">
                      💰 Budget: ৳{job.budget?.toLocaleString() || "Negotiable"}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        🔄 In Progress
                      </span>
                    </p>
                  </div>

                  {job.workerMarkedDone && !job.customerConfirmed ? (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                      <p className="text-sm text-green-700">
                        ✅ Worker marked the work as complete. Please review and confirm.
                      </p>
                    </div>
                  ) : null}

                  {job.workerMarkedDone && !job.customerConfirmed && (
                    <button
                      onClick={() => handleConfirmCompletion(job._id)}
                      disabled={confirmingJobId === job._id}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {confirmingJobId === job._id ? "⏳ Processing..." : "💰 Pay Now"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ✅ Completed ({completedJobs.length})
          </h2>

          {completedJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No completed jobs yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedJobs.map(job => (
                <div key={job._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Worker:</span> {job.hiredWorker?.name || "Unknown"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Location:</span> {job.area}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Category:</span> {job.category}
                    </p>
                    <p className="text-orange-600 font-bold">
                      💰 Amount Paid: ৳{job.budget?.toLocaleString() || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        ✅ {job.status === "paid" ? "Paid" : "Completed"}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-500">
                    Completed on {new Date(job.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK SERVICES */}
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Quick Services
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Plumber", "Electrician", "Transport", "AC Repair"].map((item) => (
              <button
                key={item}
                onClick={() => handleServiceClick(item)}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-sm font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EMERGENCY BUTTON */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-red-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 transition">
          <AlertTriangle size={18} />
          Emergency
        </button>
      </div>

      {showRatingModal && ratingJob?.hiredWorker && (
        <RatingModal
          workerId={ratingJob.hiredWorker._id}
          workerName={ratingJob.hiredWorker.name}
          jobTitle={ratingJob.title}
          onSubmit={handleRatingSubmit}
          onClose={() => {
            setShowRatingModal(false);
            setRatingJob(null);
          }}
        />
      )}
    </div>
  );
}