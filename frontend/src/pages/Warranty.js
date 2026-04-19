import React, { useEffect, useState } from "react";
import { createWarranty, getWarranty } from "../api/system";
import { toast } from "react-toastify";

const Warranty = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    serviceId: "",
    warrantyType: "Standard Service Warranty",
    coverageBasis: "Labor & Parts",
    provider: "",
    duration: 30,
    startDate: new Date().toISOString().slice(0, 10),
    coveredIssues: "",
    exclusions: "",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getWarranty();
    setList(res.data);
  };

  const handleAdd = async () => {
    try {
      const startDate = form.startDate ? new Date(form.startDate) : new Date();
      const expiry = new Date(startDate);
      expiry.setDate(expiry.getDate() + Number(form.duration));

      await createWarranty({
        ...form,
        duration: Number(form.duration),
        startDate: startDate.toISOString(),
        expiry: expiry.toISOString(),
      });

      toast.success("Warranty created successfully");
      setForm({
        serviceId: "",
        warrantyType: "Standard Service Warranty",
        coverageBasis: "Labor & Parts",
        provider: "",
        duration: 30,
        startDate: new Date().toISOString().slice(0, 10),
        coveredIssues: "",
        exclusions: "",
      });
      load();
    } catch (err) {
      toast.error("Failed to create warranty");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Warranty Tracking System</h1>

      <div style={{ maxWidth: 700, marginBottom: 24, padding: 24, border: "1px solid #e5e7eb", borderRadius: 16, background: "#ffffff" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Service ID</div>
          <input
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
            type="text"
            value={form.serviceId}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
            placeholder="Enter the service or job reference"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Warranty Type</div>
            <select
              style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
              value={form.warrantyType}
              onChange={(e) => setForm({ ...form, warrantyType: e.target.value })}
            >
              <option value="Standard Service Warranty">Standard Service Warranty</option>
              <option value="Premium Service Warranty">Premium Service Warranty</option>
              <option value="Extended Parts Warranty">Extended Parts Warranty</option>
            </select>
          </div>

          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Coverage Basis</div>
            <select
              style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
              value={form.coverageBasis}
              onChange={(e) => setForm({ ...form, coverageBasis: e.target.value })}
            >
              <option value="Labor & Parts">Labor & Parts</option>
              <option value="Service Work">Service Work</option>
              <option value="Parts Only">Parts Only</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Provider</div>
          <input
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
            type="text"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
            placeholder="Company or contractor offering warranty"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Start Date</div>
            <input
              style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Duration (days)</div>
            <input
              style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              min={1}
            />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Covered Issues</div>
          <textarea
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
            rows={3}
            value={form.coveredIssues}
            onChange={(e) => setForm({ ...form, coveredIssues: e.target.value })}
            placeholder="List what the warranty covers: repairs, replacements, service calls, etc."
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Exclusions</div>
          <textarea
            style={{ width: "100%", padding: 12, border: "1px solid #d1d5db", borderRadius: 10, fontSize: 15 }}
            rows={3}
            value={form.exclusions}
            onChange={(e) => setForm({ ...form, exclusions: e.target.value })}
            placeholder="List exclusions such as wear and tear, accidental damage, or unauthorized repairs."
          />
        </div>

        <button
          onClick={handleAdd}
          style={{ padding: "12px 24px", borderRadius: 12, background: "#111827", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}
        >
          Add Warranty
        </button>
      </div>

      <div>
        <h2>Warranty Records</h2>
        {list.length === 0 && <p>No warranties created yet.</p>}
        {list.map((w) => {
          const remaining = Math.max(
            0,
            Math.floor((new Date(w.expiry) - new Date()) / (1000 * 60 * 60 * 24))
          );

          return (
            <div
              key={w._id || w.id}
              style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12 }}
            >
              <h3 style={{ marginBottom: 10 }}>{w.serviceId || "Service"} — {w.status}</h3>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Provider:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{w.provider || "N/A"}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Warranty Type:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{w.warrantyType || "Standard Service Warranty"}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Coverage Basis:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{w.coverageBasis || "Labor & Parts"}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Remaining days:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{remaining}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Starts:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{new Date(w.startDate).toLocaleDateString()}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Expires:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{new Date(w.expiry).toLocaleDateString()}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Coverage:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{w.coveredIssues || "None listed"}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Exclusions:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{w.exclusions || "None"}</span></p>
              <p style={{ color: "#4b5563", margin: "4px 0" }}><strong style={{ fontWeight: 700 }}>Claims:</strong> <span style={{ fontWeight: 500, color: "#111827" }}>{w.claimCount ?? 0}</span></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Warranty;