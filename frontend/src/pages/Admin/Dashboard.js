import { useState } from "react";
import AdminNavBar from "../../components/Navbars/AdminNavbar";
import {
  Users,
  UserCheck,
  Wallet,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ───────── YOUR NAVBAR ───────── */}
      <AdminNavBar />

      <div className="flex flex-1">

        {/* ───────── SIDEBAR-change ───────── */}
        <div className="w-64 bg-white border-r hidden md:block p-5">

          <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

          <div className="space-y-2">

            <button
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
            >
              <BarChart3 size={18} /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
            >
              <Users size={18} /> Users
            </button>

            <button
              onClick={() => setActiveTab("workers")}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
            >
              <UserCheck size={18} /> Workers
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
            >
              <Wallet size={18} /> Payments
            </button>

            <button className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100">
              <Settings size={18} /> Settings
            </button>

          </div>
        </div>

        {/* ───────── MAIN CONTENT ───────── */}
        <div className="flex-1 p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-gray-500 text-sm">
                Manage your platform operations
              </p>
            </div>

            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={16} /> Create Admin
            </button>
          </div>

          {/* ───────── DASHBOARD TAB ───────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">

              {/* KPI CARDS (NO FAKE DATA) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-white p-5 rounded-xl shadow">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h2 className="text-2xl font-bold">—</h2>
                  <p className="text-xs text-gray-400">Waiting for backend</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                  <p className="text-sm text-gray-500">Active Workers</p>
                  <h2 className="text-2xl font-bold">—</h2>
                  <p className="text-xs text-gray-400">Pending API</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                  <p className="text-sm text-gray-500">Revenue</p>
                  <h2 className="text-2xl font-bold">—</h2>
                  <p className="text-xs text-gray-400">Payment system later</p>
                </div>

              </div>

              {/* ANALYTICS SECTION */}
              <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white p-5 rounded-xl shadow">
                  <h3 className="font-semibold mb-3">User Analytics</h3>
                  <div className="h-52 border border-dashed rounded-lg flex items-center justify-center text-gray-400">
                    📊 Chart Placeholder (User growth, activity)
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                  <h3 className="font-semibold mb-3">Service Demand</h3>
                  <div className="h-52 border border-dashed rounded-lg flex items-center justify-center text-gray-400">
                    📈 Chart Placeholder (Plumber, Electrician, etc.)
                  </div>
                </div>

              </div>

              {/* ACTIVITY + PENDING */}
              <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white p-5 rounded-xl shadow">
                  <h3 className="font-semibold mb-3">Pending Tasks</h3>
                  <ul className="text-sm text-gray-500 space-y-2">
                    <li>• Worker approvals</li>
                    <li>• User reports</li>
                    <li>• Payment verification</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl shadow md:col-span-2">
                  <h3 className="font-semibold mb-3">Activity Feed</h3>
                  <div className="text-sm text-gray-500 space-y-2">
                    <p>• System initialized</p>
                    <p>• New user registration</p>
                    <p>• Worker request submitted</p>
                    <p>• Admin panel accessed</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ───────── USERS TAB ───────── */}
          {activeTab === "users" && (
            <div className="bg-white p-6 rounded-xl shadow text-gray-400">
              Users module UI placeholder (CRUD later)
            </div>
          )}

          {/* ───────── WORKERS TAB ───────── */}
          {activeTab === "workers" && (
            <div className="bg-white p-6 rounded-xl shadow text-gray-400">
              Workers approval UI placeholder (backend later)
            </div>
          )}

          {/* ───────── PAYMENTS TAB ───────── */}
          {activeTab === "payments" && (
            <div className="bg-white p-6 rounded-xl shadow text-gray-400">
              Payments dashboard placeholder (Stripe integration later)
            </div>
          )}

        </div>
      </div>
    </div>
  );
}