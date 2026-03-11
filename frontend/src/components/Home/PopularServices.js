const services = [
  "Plumbing",
  "Electrical",
  "AC Repair",
  "Cleaning",
  "Painting",
  "Appliance Repair"
];

const PopularServices = () => {
  return (
    <section className="py-20 bg-slate-50">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-10">
          Popular Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition"
            >
              {service}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default PopularServices;