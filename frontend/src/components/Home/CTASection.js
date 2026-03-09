const CTASection = () => {
  return (
    <section className="py-24 bg-blue-600 text-white text-center">

      <div className="max-w-4xl mx-auto px-6">

        <h2 className="text-3xl font-bold">
          Need Help Right Now?
        </h2>

        <p className="mt-4 text-blue-100">
          Let our AI assistant analyze your problem and find the best solution.
        </p>

        <button className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Start AI Diagnosis
        </button>

      </div>

    </section>
  );
};

export default CTASection;