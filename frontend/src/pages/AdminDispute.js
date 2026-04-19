import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { getDisputes, updateDisputeStatus } from "../api/system";
import { toast } from "react-toastify";

const socket = io("http://localhost:5000");

const AdminDispute = () => {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    loadDisputes();

    socket.on("disputeMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("connect", () => {
      console.log("Admin socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Admin socket disconnected");
    });

    return () => {
      socket.off("disputeMessage");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const loadDisputes = async () => {
    try {
      const res = await getDisputes();
      setDisputes(res.data);
    } catch (err) {
      toast.error("Unable to load disputes");
    }
  };

  const selectDispute = (dispute) => {
    setSelectedDispute(dispute);
    setMessages([]);
    socket.emit("joinDispute", dispute._id || dispute.id);
  };

  const sendMessage = () => {
    if (!selectedDispute || !input.trim()) return;
    const payload = {
      disputeId: selectedDispute._id || selectedDispute.id,
      sender: "Admin",
      message: input.trim(),
    };
    socket.emit("disputeMessage", payload);
    setMessages((prev) => [...prev, payload]);
    setInput("");
  };

  const handleStatusUpdate = async () => {
    if (!selectedDispute || !statusUpdate) return;
    try {
      const res = await updateDisputeStatus(selectedDispute._id || selectedDispute.id, {
        status: statusUpdate,
        adminNotes: `Admin set status to ${statusUpdate}`,
      });
      setSelectedDispute(res.data);
      setStatusUpdate("");
      toast.success("Dispute status updated");
      loadDisputes();
    } catch (err) {
      toast.error("Failed to update dispute status");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Admin Dispute Resolution</h1>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: "35%", minWidth: 320 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Open Disputes</h2>
          {disputes.length === 0 && <p style={{ color: "#6b7280" }}>No disputes available.</p>}
          {disputes.map((dispute) => (
            <div
              key={dispute._id || dispute.id}
              onClick={() => selectDispute(dispute)}
              style={{
                padding: 16,
                marginBottom: 12,
                cursor: "pointer",
                background: selectedDispute?._id === dispute._id ? "#eef2ff" : "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: 14,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{dispute.type}</div>
              <div style={{ color: "#6b7280", fontSize: 14 }}>{dispute.serviceId || "No service ID"}</div>
              <div style={{ marginTop: 8, fontWeight: 600 }}>Status: <span style={{ fontWeight: 500 }}>{dispute.status}</span></div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {selectedDispute ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: 26, margin: 0 }}>Dispute #{selectedDispute._id || selectedDispute.id}</h2>
                  <p style={{ color: "#6b7280", margin: "8px 0 0" }}>Selected dispute details and admin chat.</p>
                </div>
                <div style={{ padding: "10px 16px", borderRadius: 999, background: "#f3f4f6", color: "#111827", fontWeight: 700 }}>
                  {selectedDispute.status}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div style={{ padding: 18, border: "1px solid #e5e7eb", borderRadius: 16, background: "#ffffff" }}>
                  <div style={{ marginBottom: 10, fontWeight: 700 }}>Type</div>
                  <div style={{ color: "#111827" }}>{selectedDispute.type}</div>
                  <div style={{ marginTop: 12, fontWeight: 700 }}>Requested Resolution</div>
                  <div style={{ color: "#111827" }}>{selectedDispute.expectedResolution || "N/A"}</div>
                </div>
                <div style={{ padding: 18, border: "1px solid #e5e7eb", borderRadius: 16, background: "#ffffff" }}>
                  <div style={{ marginBottom: 10, fontWeight: 700 }}>Service ID</div>
                  <div style={{ color: "#111827" }}>{selectedDispute.serviceId || "N/A"}</div>
                  <div style={{ marginTop: 12, fontWeight: 700 }}>Amount</div>
                  <div style={{ color: "#111827" }}>${selectedDispute.amount || 0}</div>
                </div>
              </div>

              <div style={{ marginBottom: 24, padding: 18, border: "1px solid #e5e7eb", borderRadius: 16, background: "#ffffff" }}>
                <h3 style={{ marginBottom: 16 }}>Dispute Chat</h3>
                <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 16, padding: 12, border: "1px solid #d1d5db", borderRadius: 14, background: "#f8fafc" }}>
                  {messages.length === 0 ? (
                    <p style={{ color: "#6b7280" }}>No messages yet. Type a message to start the dispute conversation.</p>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, color: "#111827" }}>{msg.sender}</div>
                        <div style={{ color: "#374151" }}>{msg.message}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{msg.time ? new Date(msg.time).toLocaleString() : ""}</div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #d1d5db" }}
                    placeholder="Type your message here"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    onClick={sendMessage}
                    style={{ padding: "12px 20px", borderRadius: 12, background: "#111827", color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    Send
                  </button>
                </div>
              </div>

              <div style={{ padding: 18, border: "1px solid #e5e7eb", borderRadius: 16, background: "#ffffff" }}>
                <h3 style={{ marginBottom: 16 }}>Resolution Actions</h3>
                <select
                  style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 12, marginBottom: 12 }}
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option value="">Choose a resolution</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  style={{ padding: "12px 20px", borderRadius: 12, background: "#111827", color: "#fff", border: "none", cursor: "pointer" }}
                >
                  Update Status
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: 20, border: "1px solid #e5e7eb", borderRadius: 16, background: "#fafafa" }}>
              <h2 style={{ marginTop: 0 }}>Select a dispute</h2>
              <p style={{ color: "#6b7280" }}>
                Click any dispute on the left to open the chat and resolve it. Once selected, you can send messages and update dispute status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDispute;