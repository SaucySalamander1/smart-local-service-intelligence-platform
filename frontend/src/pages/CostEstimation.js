import { useState } from "react";

export default function CostEstimation() {
  const [service, setService] = useState("plumbing");
  const [urgency, setUrgency] = useState("normal");
  const [result, setResult] = useState("");

  const estimate = async () => {
    setResult("Calculating...");

    const res = await fetch("http://localhost:5000/api/deema/estimate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ service, urgency })
    });

    const data = await res.json();
    setResult(data.estimated_cost + " BDT");
  };

  return (
    <div className="p-10">
      <div className="bg-white shadow-lg rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-[#0041C2] mb-4">💰 Cost Estimation</h2>

        <select onChange={(e)=>setService(e.target.value)} className="p-2 m-2 border">
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="ac">AC</option>
        </select>

        <select onChange={(e)=>setUrgency(e.target.value)} className="p-2 m-2 border">
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>

        <br/>

        <button 
          onClick={estimate}
          className="mt-4 bg-[#0041C2] text-white px-6 py-2 rounded-lg hover:bg-blue-800"
        >
          Estimate Now
        </button>

        <p className="mt-4 text-lg font-semibold">{result}</p>
      </div>
    </div>
  );
}