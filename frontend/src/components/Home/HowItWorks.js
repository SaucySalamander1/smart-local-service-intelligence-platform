const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="p-6 hover:shadow-lg rounded-lg transition">
            <h3 className="text-xl font-semibold mb-2">
              1. Describe Problem
            </h3>
            <p className="text-gray-600">
              Tell our AI what issue you are facing.
            </p>
          </div>

          <div className="p-6 hover:shadow-lg rounded-lg transition">
            <h3 className="text-xl font-semibold mb-2">
              2. AI Analysis
            </h3>
            <p className="text-gray-600">
              The AI evaluates risk and service category.
            </p>
          </div>

          <div className="p-6 hover:shadow-lg rounded-lg transition">
            <h3 className="text-xl font-semibold mb-2">
              3. Get Solution
            </h3>
            <p className="text-gray-600">
              Receive guidance or recommended workers.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default HowItWorks;