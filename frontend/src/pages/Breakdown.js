import { useState } from "react";

export default function Breakdown() {
  const [service, setService] = useState("plumbing");
  const [urgency, setUrgency] = useState("normal");
  const [extraParts, setExtraParts] = useState(false);

  const [data, setData] = useState(null);

  const calculate = async () => {
    const res = await fetch("http://localhost:5000/api/deema/breakdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service,
        urgency,
        extraParts
      })
    });

    const result = await res.json();
    setData(result);
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
        
        <h2 style={{ color: "#0041C2" }}>📊 Smart Cost Calculator</h2>

        {/* SERVICE */}
        <select onChange={(e)=>setService(e.target.value)}>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="ac">AC</option>
        </select>

        {/* URGENCY */}
        <select onChange={(e)=>setUrgency(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>

        {/* EXTRA PARTS */}
        <div>
          <label>
            <input
              type="checkbox"
              onChange={(e)=>setExtraParts(e.target.checked)}
            />
            Need extra parts (+200)
          </label>
        </div>

        <button
          onClick={calculate}
          style={{
            marginTop: "10px",
            background: "#0041C2",
            color: "white",
            padding: "10px",
            borderRadius: "8px"
          }}
        >
          Calculate Cost
        </button>

        {/* RESULT */}
        {data && (
          <div style={{ marginTop: "20px", background: "#f2f2f2", padding: "10px" }}>
            <p>🔧 Labor: {data.labor}</p>
            <p>🧩 Parts: {data.parts}</p>
            <p>⚡ Urgency: {data.urgency}</p>
            <hr/>
            <h3>💰 Total: {data.total} BDT</h3>
          </div>
        )}

      </div>
    </div>
  );
}