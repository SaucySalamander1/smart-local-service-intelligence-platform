import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import WorkerNavBar from "../../components/Navbars/WorkerNavbar";
import { AuthContext } from "../../context/AuthContext";
import { getMyJobs, markJobDone } from "../../api/jobs";

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [availableJobs, setAvailableJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingJobId, setCompletingJobId] = useState(null);

  useEffect(() => {
    fetchWorkerJobs();
  }, []);

  const fetchWorkerJobs = async () => {
    try {
      setLoading(true);
      const response = await getMyJobs();
      console.log("📊 Worker jobs response:", response);
      
      // Filter jobs for this worker
      const workerJobs = response.data || [];
      const available = workerJobs.filter(job => job.status === "in_progress");
      const completed = workerJobs.filter(job => job.status === "completed");
      
      console.log("✅ Available jobs:", available.length);
      console.log("✅ Completed jobs:", completed.length);
      
      setAvailableJobs(available);
      setCompletedJobs(completed);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching worker jobs:", err);
      setError("Failed to load your jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWork = async (jobId) => {
    setCompletingJobId(jobId);
    try {
      console.log("🔄 Marking job as done:", jobId);
      const result = await markJobDone(jobId);
      console.log("✅ Job marked as done:", result);
      alert("Work marked as complete! Waiting for customer confirmation.");
      await fetchWorkerJobs();
    } catch (err) {
      console.error("❌ Error marking job done:", err);
      alert(err.response?.data?.message || "Failed to mark job as complete");
    } finally {
      setCompletingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <WorkerNavBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <WorkerNavBar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Worker Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Available Jobs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📋 Available Jobs ({availableJobs.length})
          </h2>
          
          {availableJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No active jobs at the moment</p>
              <button
                onClick={() => navigate("/worker/jobs")}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Browse Available Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableJobs.map(job => (
                <div key={job._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Customer:</span> {job.customer?.name || "Unknown"}
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
                        {job.status === "in_progress" ? "🔄 In Progress" : job.status}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleCompleteWork(job._id)}
                    disabled={completingJobId === job._id}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {completingJobId === job._id ? "⏳ Marking complete..." : "✅ Complete Work"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Jobs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ✅ Completed Jobs ({completedJobs.length})
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
                      <span className="font-semibold">Customer:</span> {job.customer?.name || "Unknown"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Location:</span> {job.area}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Category:</span> {job.category}
                    </p>
                    <p className="text-orange-600 font-bold">
                      💰 Amount: ৳{job.budget?.toLocaleString() || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        ✅ Completed
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
      </div>
    </div>
  );
};

export default WorkerDashboard;