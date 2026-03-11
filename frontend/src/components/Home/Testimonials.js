const testimonials = [
  {
    name: "Ayesha Rahman",
    text: "Amazing platform! Found an electrician in minutes."
  },
  {
    name: "Tanvir Hasan",
    text: "The AI suggestion helped me fix my AC quickly."
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-10">
          What Our Users Say
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center">

          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-slate-50 p-6 rounded-lg shadow"
            >
              <p className="text-gray-600">
                "{t.text}"
              </p>

              <h4 className="mt-4 font-semibold">
                - {t.name}
              </h4>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default Testimonials;