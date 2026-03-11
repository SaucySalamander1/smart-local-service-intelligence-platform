import { useEffect, useState } from "react";
import { getPendingWorkers, approveWorker } from "../../api/auth";
import AdminNavBar from "../../components/Navbars/AdminNavbar";

const AdminDashboard = () => {
  const [workers, setWorkers] = useState([]);

  const loadWorkers = async () => {
    try {
      const data = await getPendingWorkers();
      setWorkers(data);
    } catch (err) {
      alert("Failed to load workers");
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveWorker(id);
      alert("Worker approved");

      // remove worker from UI instantly
      setWorkers(workers.filter((w) => w._id !== id));
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <>
      <AdminNavBar />

      <div style={{ padding: "40px" }}>
        <h2>Admin Dashboard</h2>

        <h3>Pending Workers</h3>

        {workers.length === 0 ? (
          <p>No workers waiting for approval</p>
        ) : (
          workers.map((worker) => (
            <div
              key={worker._id}
              style={{
                border: "1px solid gray",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <p>
                <b>Name:</b> {worker.name}
              </p>

              <p>
                <b>Email:</b> {worker.email}
              </p>

              <p>
                <b>Certifications:</b>{" "}
                {worker.certifications || "None provided"}
              </p>

              <button onClick={() => handleApprove(worker._id)}>
                Approve Worker
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminDashboard;