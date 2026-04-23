import { Link } from "react-router-dom";

const Cost = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 Cost Management</h1>
          <p className="text-gray-600 text-lg">Estimate costs and view detailed breakdowns</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Cost Estimation Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
              <h2 className="text-3xl font-bold mb-2">📊 Cost Estimation</h2>
              <p className="text-blue-100">Get instant estimates for your service requests</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Quick service assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Real-time price calculation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Transparent pricing model</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>No hidden charges</span>
                </li>
              </ul>
              <Link
                to="/estimate"
                className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-center hover:bg-blue-700 transition duration-200"
              >
                View Estimations
              </Link>
            </div>
          </div>

          {/* Cost Breakdown Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-8 text-white">
              <h2 className="text-3xl font-bold mb-2">💹 Cost Breakdown</h2>
              <p className="text-slate-200">Detailed analysis of service costs</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-slate-700 font-bold mt-1">✓</span>
                  <span>Service fees breakdown</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-700 font-bold mt-1">✓</span>
                  <span>Labor cost analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-700 font-bold mt-1">✓</span>
                  <span>Material expenses detail</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-700 font-bold mt-1">✓</span>
                  <span>Platform commission details</span>
                </li>
              </ul>
              <Link
                to="/breakdown"
                className="block w-full bg-slate-700 text-white font-semibold py-3 rounded-lg text-center hover:bg-slate-800 transition duration-200"
              >
                View Breakdown
              </Link>
            </div>
          </div>

        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Use Our Cost Tools?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-gray-900 mb-2">Accurate Pricing</h4>
              <p className="text-gray-600 text-sm">Get precise cost estimates based on current market rates</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="font-bold text-gray-900 mb-2">Full Transparency</h4>
              <p className="text-gray-600 text-sm">Understand exactly where your money goes with detailed breakdowns</p>
            </div>
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-bold text-gray-900 mb-2">Quick & Easy</h4>
              <p className="text-gray-600 text-sm">Get estimates instantly without complicated forms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cost;
