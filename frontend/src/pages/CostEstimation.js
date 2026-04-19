import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CostEstimation() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    service: "Plumbing",
    property: "Apartment",
    size: "Small",
    urgency: "Normal",
    quality: "Standard",
    travel: "Worker comes",
  });

  const [price, setPrice] = useState(null);

  const calculate = () => {
    let base = 200;

    if (form.service === "Electrical") base += 80;
    if (form.property === "House") base += 50;
    if (form.size === "Large") base += 120;

    if (form.urgency === "Urgent") base *= 1.3;
    if (form.urgency === "Emergency") base *= 1.6;

    if (form.quality === "Premium") base *= 1.5;

    if (form.travel === "Worker comes") base += 60;
    if (form.travel === "You go") base -= 20;

    setPrice(Math.round(base));
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Smart Cost Estimation</h1>

      {Object.keys(form).map((key) => (
        <div key={key} className="mb-6">
          <h2 className="text-lg font-bold capitalize mb-2">{key}</h2>

          <select
            className="w-full p-2 border rounded text-sm"
            value={form[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          >
            {key === "service" && (
              <>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Cleaning</option>
              </>
            )}

            {key === "property" && (
              <>
                <option>Apartment</option>
                <option>House</option>
              </>
            )}

            {key === "size" && (
              <>
                <option>Small</option>
                <option>Large</option>
              </>
            )}

            {key === "urgency" && (
              <>
                <option>Normal</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </>
            )}

            {key === "quality" && (
              <>
                <option>Standard</option>
                <option>Premium</option>
              </>
            )}

            {key === "travel" && (
              <>
                <option>Worker comes</option>
                <option>You go</option>
              </>
            )}
          </select>
        </div>
      ))}

      <button
        onClick={calculate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Calculate
      </button>

      {price && (
        <div className="mt-6 text-xl font-bold">
          Estimated Cost: ${price}
        </div>
      )}

      {price && (
        <button
          onClick={() =>
            navigate("/breakdown", { state: { total: price } })
          }
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          View Breakdown
        </button>
      )}
    </div>
  );
}