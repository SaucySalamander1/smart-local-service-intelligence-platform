import CustomerNavBar from '../../components/Navbars/CustomerNavbar';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, MapPin, AlertTriangle } from "lucide-react";

export default function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate("/ai-chat", { state: { problem: service } });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <CustomerNavBar />

      {/* HEADER */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        
        {/* Search */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-xl w-1/2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none ml-2 w-full text-sm"
          />
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <Bell className="text-gray-600 cursor-pointer" />

          {/* ✅ FIXED PROFILE BUTTON */}
          <div
            onClick={() => navigate("/customer/profile")}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
          >
            <User className="text-gray-600" />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </div>
      </div>

      {/* AI ASSISTANT */}
      <div className="p-6">
        <div 
          onClick={() => navigate("/ai-chat")}
          className="bg-blue-600 text-white rounded-2xl p-5 shadow cursor-pointer hover:bg-blue-700"
        >
          <h2 className="text-lg font-semibold">💬 AI Assistant</h2>
          <p className="text-sm mt-1 text-blue-100">
            Ask anything about your problem
          </p>
        </div>
      </div>

      {/* QUICK SERVICES */}
      <div className="px-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          Quick Services
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Plumber", "Electrician", "Transport", "AC Repair"].map((item) => (
            <button
              key={item}
              onClick={() => handleServiceClick(item)}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-sm font-medium"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE REQUESTS */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          Active Requests
        </h3>

        <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
          <div>
            <p className="font-medium">Plumber</p>
            <p className="text-xs text-orange-500">In Progress</p>
          </div>

          <button className="text-blue-600 text-sm font-semibold">
            Track →
          </button>
        </div>
      </div>

      {/* NEARBY SERVICES */}
      <div className="px-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          Nearby Services
        </h3>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
            >
              <div>
                <p className="font-medium">Electrician Service</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={12} /> 2 km away
                </p>
              </div>

              <button className="text-blue-600 text-sm">View</button>
            </div>
          ))}
        </div>
      </div>

      {/* AI RECOMMENDATIONS */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          AI Recommendations
        </h3>

        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-sm">
            Based on your recent issue, we recommend:
          </p>

          <ul className="mt-2 text-sm list-disc ml-5 text-gray-600">
            <li>Electrical wiring inspection</li>
            <li>Hire a certified electrician</li>
          </ul>
        </div>
      </div>

      {/* EMERGENCY BUTTON */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-red-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 transition">
          <AlertTriangle size={18} />
          Emergency
        </button>
      </div>

    </div>
  );
}