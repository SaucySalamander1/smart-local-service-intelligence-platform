import { Link } from "react-router-dom";

const Support = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛟 Support Center</h1>
          <p className="text-gray-600 text-lg">Warranty, disputes, and administrative support</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Warranty Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 px-6 py-8 text-white">
              <h2 className="text-3xl font-bold mb-2">🛡️ Warranty</h2>
              <p className="text-emerald-100">Service guarantees and protection</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">✓</span>
                  <span>Coverage information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">✓</span>
                  <span>Warranty claims process</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">✓</span>
                  <span>Protection policies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold mt-1">✓</span>
                  <span>Claim history tracking</span>
                </li>
              </ul>
              <Link
                to="/warranty"
                className="block w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg text-center hover:bg-emerald-700 transition duration-200"
              >
                View Warranty
              </Link>
            </div>
          </div>

          {/* Dispute Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-8 text-white">
              <h2 className="text-3xl font-bold mb-2">⚖️ Dispute</h2>
              <p className="text-orange-100">Resolve service disagreements</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-1">✓</span>
                  <span>File a dispute</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-1">✓</span>
                  <span>Track dispute status</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-1">✓</span>
                  <span>Mediation support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold mt-1">✓</span>
                  <span>Resolution documentation</span>
                </li>
              </ul>
              <Link
                to="/dispute"
                className="block w-full bg-orange-600 text-white font-semibold py-3 rounded-lg text-center hover:bg-orange-700 transition duration-200"
              >
                View Disputes
              </Link>
            </div>
          </div>

          {/* Admin Dispute Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-8 text-white">
              <h2 className="text-3xl font-bold mb-2">👮 Admin Dispute</h2>
              <p className="text-purple-100">Administrative dispute management</p>
            </div>
            <div className="p-8">
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span>Escalate disputes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span>Admin review process</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span>Enforcement actions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span>Appeal procedures</span>
                </li>
              </ul>
              <Link
                to="/admin-dispute"
                className="block w-full bg-purple-600 text-white font-semibold py-3 rounded-lg text-center hover:bg-purple-700 transition duration-200"
              >
                View Admin Disputes
              </Link>
            </div>
          </div>

        </div>

        {/* Support Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How We Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="font-bold text-gray-900 mb-2">Fair Resolution</h4>
              <p className="text-gray-600 text-sm">Our team ensures every dispute is handled fairly and impartially</p>
            </div>
            <div>
              <div className="text-3xl mb-3">⏱️</div>
              <h4 className="font-bold text-gray-900 mb-2">Quick Response</h4>
              <p className="text-gray-600 text-sm">Get timely updates on your warranty and dispute cases</p>
            </div>
            <div>
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-bold text-gray-900 mb-2">Full Documentation</h4>
              <p className="text-gray-600 text-sm">Complete records and transparency in all support matters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
