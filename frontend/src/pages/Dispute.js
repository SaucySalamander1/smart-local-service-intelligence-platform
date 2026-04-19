import React, { useEffect, useState } from "react";
import { createDispute, getDisputes } from "../api/system";
import { toast } from "react-toastify";

const Dispute = () => {
  const [form, setForm] = useState({
    serviceId: "",
    type: "Overpricing",
    description: "",
    expectedResolution: "",
    amount: 0,
    evidence: null,
    evidencePreview: null,
  });
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getDisputes();
    setList(res.data || []);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("serviceId", form.serviceId);
      data.append("type", form.type);
      data.append("description", form.description);
      data.append("expectedResolution", form.expectedResolution);
      data.append("amount", form.amount);
      if (form.evidence) {
        data.append("evidence", form.evidence);
      }

      await createDispute(data);
      toast.success("Dispute submitted successfully");
      setForm({
        serviceId: "",
        type: "Overpricing",
        description: "",
        expectedResolution: "",
        amount: 0,
        evidence: null,
        evidencePreview: null,
      });
      load();
    } catch (err) {
      toast.error("Failed to submit dispute");
    }
  };

  const aiSuggestion = () => {
    if (form.description?.toLowerCase().includes("price"))
      return "AI: This looks like an overpricing concern. Add cost receipts.";
    if (form.description?.toLowerCase().includes("broken"))
      return "AI: This seems like an issue with damage or workmanship.";
    return "AI: Add supporting evidence to help admin review your dispute.";
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Dispute Submission System</h1>

      <div style={{ maxWidth: 700, marginBottom: 24, padding: 24, border: "1px solid #e5e7eb", borderRadius: 16, background: "#ffffff" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700, color: "#111827" }}>Service ID</div>
          <input
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15 }}
            type="text"
            value={form.serviceId}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
            placeholder="Enter the related service job or order ID"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700, color: "#111827" }}>Dispute Type</div>
          <select
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15, color: "#374151" }}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="Overpricing">Overpricing</option>
            <option value="Service Quality">Service Quality</option>
            <option value="Damage">Damage</option>
            <option value="Missed Deadline">Missed Deadline</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700, color: "#111827" }}>Description</div>
          <textarea
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15, color: "#111827" }}
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the issue clearly so admin can review faster"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700, color: "#111827" }}>Expected Resolution</div>
          <input
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15 }}
            type="text"
            value={form.expectedResolution}
            onChange={(e) => setForm({ ...form, expectedResolution: e.target.value })}
            placeholder="Example: refund, repair, replacement, discount"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700, color: "#111827" }}>Amount (optional)</div>
          <input
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 12, fontSize: 15 }}
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Enter amount you expect refunded or compensated"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 700, color: "#111827" }}>Evidence / Photo</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setForm({
                ...form,
                evidence: file,
                evidencePreview: file ? URL.createObjectURL(file) : null,
              });
            }}
          />
          {form.evidencePreview && (
            <div style={{ marginTop: 12 }}>
              <img
                src={form.evidencePreview}
                alt="Evidence preview"
                style={{ width: 220, borderRadius: 12, border: "1px solid #d1d5db" }}
              />
            </div>
          )}
        </div>

        <p style={{ color: "#4b5563", fontSize: 14 }}>{aiSuggestion()}</p>

        <button onClick={handleSubmit}>Submit Dispute</button>
      </div>

      <div>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Dispute History</h2>
        <p style={{ color: "#6b7280", marginBottom: 18 }}>
          All submitted disputes are listed below. Select any dispute to review the current status, evidence, and timeline.
        </p>
        {list.length === 0 && <p>No disputes submitted yet.</p>}
        {list.map((d) => (
          <div
            key={d._id || d.id}
            style={{ border: "1px solid #e5e7eb", background: "#fafafa", padding: 18, marginBottom: 16, borderRadius: 14 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{d.type}</h3>
              <span style={{ color: "#6b7280", fontWeight: 700 }}>{d.status}</span>
            </div>
            <p style={{ color: "#4b5563", margin: "4px 0" }}><strong>Service ID:</strong> <span style={{ color: "#111827", fontWeight: 500 }}>{d.serviceId || "N/A"}</span></p>
            <p style={{ color: "#4b5563", margin: "4px 0" }}>{d.description}</p>
            <p style={{ color: "#4b5563", margin: "4px 0" }}><strong>Resolution requested:</strong> <span style={{ color: "#111827", fontWeight: 500 }}>{d.expectedResolution || "N/A"}</span></p>
            <p style={{ color: "#4b5563", margin: "4px 0" }}><strong>Amount:</strong> <span style={{ color: "#111827", fontWeight: 500 }}>${d.amount || 0}</span></p>
            {d.evidence && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={`http://localhost:5000${d.evidence}`}
                  alt="Dispute evidence"
                  style={{ maxWidth: 320, borderRadius: 12, border: "1px solid #d1d5db" }}
                />
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <strong>Timeline</strong>
              <ul style={{ color: "#4b5563", paddingLeft: 20, marginTop: 8 }}>
                {(d.timeline || []).map((item, index) => (
                  <li key={index} style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{item.status}</span> — {new Date(item.date).toLocaleString()} {item.note ? `(${item.note})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dispute;