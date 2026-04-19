import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

export default function Breakdown() {
  const location = useLocation();
  const total = location.state?.total || 0;

  const [discounted, setDiscounted] = useState(total);

  const breakdown = [
    { name: "Labor", value: total * 0.4 },
    { name: "Materials", value: total * 0.3 },
    { name: "Transport", value: total * 0.1 },
    { name: "Tax", value: total * 0.1 },
    { name: "Service Fee", value: total * 0.1 },
  ];

  const applyDiscount = () => {
    setDiscounted(Math.round(total * 0.9));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Total Cost: $${discounted}`, 10, 10);
    doc.save("invoice.pdf");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Cost Breakdown</h1>

      {breakdown.map((item, i) => (
        <div key={i} className="flex justify-between mb-3">
          <span title="Calculated based on service details">
            {item.name}
          </span>
          <span>${item.value.toFixed(2)}</span>
        </div>
      ))}

      <div className="mt-4 font-bold text-xl">
        Total: ${discounted}
      </div>

      <button
        onClick={applyDiscount}
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Apply Discount
      </button>

      <button
        onClick={downloadPDF}
        className="mt-4 ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download Invoice
      </button>

      <div className="mt-6 text-red-500">
        ⚠ Extra charges may apply for emergency services
      </div>

      <div className="mt-6">
        <h2 className="font-bold">Vendor Comparison</h2>
        <p>Vendor A: ${total + 50}</p>
        <p>Vendor B: ${total - 30}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-bold">Price Trend</h2>
        <p>Last Month: $250</p>
        <p>This Month: $280</p>
      </div>
    </div>
  );
}