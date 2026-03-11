const TrustSection = () => {
  return (
    <section className="py-20 bg-slate-50">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-bold mb-12">
          Why Trust Our Platform?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">
              Verified Professionals
            </h3>
            <p className="text-gray-600 mt-2">
              All workers are background checked and verified.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">
              AI Risk Analysis
            </h3>
            <p className="text-gray-600 mt-2">
              Our AI evaluates service risks before recommending help.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">
              Secure Payments
            </h3>
            <p className="text-gray-600 mt-2">
              Pay safely through our protected platform.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default TrustSection;