const workers = [
  { name: "Rahim Uddin", service: "Electrician", rating: "4.9" },
  { name: "Karim Ahmed", service: "Plumber", rating: "4.7" },
  { name: "Sajid Khan", service: "AC Technician", rating: "4.8" }
];

const FeaturedWorkers = () => {
  return (
    <section className="py-20 bg-slate-50">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-10">
          Top Rated Professionals
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {workers.map((worker, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >

              <h3 className="text-xl font-semibold">
                {worker.name}
              </h3>

              <p className="text-gray-500 mt-1">
                {worker.service}
              </p>

              <p className="mt-2 text-yellow-500">
                ⭐ {worker.rating}
              </p>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                View Profile
              </button>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default FeaturedWorkers;