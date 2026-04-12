import { useState } from "react";

export default function Breakdown() {
  const [data, setData] = useState(null);

  const getData = async () => {
    const res = await fetch("http://localhost:5000/api/deema/breakdown", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ urgency: "urgent" })
    });

    const result = await res.json();
    setData(result);
  };

  return (
    <div className="p-10">
      <div className="bg-white shadow-lg rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-[#0041C2] mb-4">📊 Cost Breakdown</h2>

        <button 
          onClick={getData}
          className="bg-[#0041C2] text-white px-6 py-2 rounded-lg"
        >
          Show Breakdown
        </button>

        {data && (
          <div className="mt-6 text-left bg-gray-100 p-4 rounded-lg">
            <p>🔧 Labor: {data.labor}</p>
            <p>🧩 Parts: {data.parts}</p>
            <p>⚡ Urgency: {data.urgency}</p>
            <hr/>
            <p className="font-bold">💵 Total: {data.total}</p>
          </div>
        )}
      </div>
    </div>
  );
}