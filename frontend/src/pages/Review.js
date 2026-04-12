import { useState } from "react";

export default function Review() {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    await fetch("http://localhost:5000/api/deema/review",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ rating, review: text })
    });

    setMsg("✅ Review Submitted!");
    setText("");
  };

  const load = async () => {
    const res = await fetch("http://localhost:5000/api/deema/reviews");
    const data = await res.json();
    setReviews(data);
  };

  return (
    <div className="p-10">
      <div className="bg-white shadow-lg rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-[#0041C2] mb-4">⭐ Review System</h2>

        <select onChange={(e)=>setRating(e.target.value)} className="p-2 border">
          <option value="1">⭐ 1</option>
          <option value="2">⭐⭐ 2</option>
          <option value="3">⭐⭐⭐ 3</option>
          <option value="4">⭐⭐⭐⭐ 4</option>
          <option value="5">⭐⭐⭐⭐⭐ 5</option>
        </select>

        <br/>

        <input 
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Write review..."
          className="p-2 border mt-3 w-60"
        />

        <br/>

        <button 
          onClick={submit}
          className="mt-3 bg-[#0041C2] text-white px-6 py-2 rounded-lg"
        >
          Submit
        </button>

        <p className="text-green-600 mt-2">{msg}</p>

        <button 
          onClick={load}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Load Reviews
        </button>

        <div className="mt-4">
          {reviews.map((r, i) => (
            <div key={i} className="bg-gray-100 p-3 m-2 rounded">
              <p>{r.review}</p>
              <p>{"⭐".repeat(r.rating)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}