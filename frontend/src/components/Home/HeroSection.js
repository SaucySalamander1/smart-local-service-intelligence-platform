import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [problem, setProblem] = useState("");
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // 🔹 Fetch images from Unsplash
  const fetchImages = async (query = "home service") => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=5&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_KEY}`,
          },
        }
      );

      const data = await res.json();
      const urls = data.results.map((img) => img.urls.regular);

      setImages(urls);
      setCurrent(0);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Load default images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  // 🔹 Rotate images every 5s
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  const handleAskAI = async () => {
    if (!problem.trim()) return;

    // 🔥 fetch new images based on user problem
    await fetchImages(problem);

    navigate("/ai-chat", {
      state: { problem },
    });
  };

  return (
    <section
      className="relative text-white py-32 transition-all duration-1000"
      style={{
        backgroundImage: `url(${images[current]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-5xl mx-auto text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Smart Local Service Platform
        </h1>

        <p className="mt-6 text-lg text-blue-100">
          Describe your problem and our AI assistant will guide you
        </p>

        <div className="mt-10 flex justify-center">
          <input
            type="text"
            placeholder="Describe your problem..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
            className="px-4 py-3 w-72 md:w-96 rounded-l-lg text-black outline-none"
          />

          <button
            onClick={handleAskAI}
            className="bg-green-500 px-6 py-3 rounded-r-lg hover:bg-green-600"
          >
            Ask AI
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;