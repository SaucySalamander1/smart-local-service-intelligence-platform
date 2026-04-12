import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayouts";
import AIChat from "./pages/AIChat";

import Home from "./pages/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Auth/AdminLogin";

import CustomerDashboard from "./pages/Customer/Dashboard";
import BrowseWorkers from "./pages/Customer/BrowseWorkers";
import WorkerProfile from "./pages/WorkerProfile";
import WorkerDashboard from "./pages/Worker/Dashboard";
import WorkerServices from "./pages/Worker/Services";   // ✅ NEW IMPORT
import AdminDashboard from "./pages/Admin/Dashboard";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import BecomeWorker from "./pages/BecomeWorker";

import ProtectedRoute from "./routes/ProtectedRoute";
import CostEstimation from "./pages/CostEstimation";
import Breakdown from "./pages/Breakdown";
import Review from "./pages/Review";

function App() {
  return (
    <Routes>

      {/* PUBLIC LAYOUT */}
      <Route element={<PublicLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/services" element={<Services />} />

        <Route path="/become-worker" element={<BecomeWorker />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/ai-chat" element={<AIChat />} />
        
        <Route path="/about" element={<About />} />
        
        <Route path="/estimate" element={<CostEstimation />} />
        <Route path="/breakdown" element={<Breakdown />} />
        <Route path="/review" element={<Review />} />

      </Route>

      {/* DASHBOARDS */}

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/browse-workers"
        element={
          <ProtectedRoute role="customer">
            <BrowseWorkers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/worker-profile/:workerId"
        element={
          <WorkerProfile />
        }
      />

      <Route
        path="/worker/dashboard"
        element={
          <ProtectedRoute role="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
   
      {/* ✅ NEW WORKER SERVICES ROUTE */}

      <Route
        path="/worker/services"
        element={
          <ProtectedRoute role="worker">
            <WorkerServices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
export default App;
