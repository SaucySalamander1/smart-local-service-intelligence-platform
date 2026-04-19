// frontend/src/App.js
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayouts";

// Public pages
import Home from "./pages/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Auth/AdminLogin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import BecomeWorker from "./pages/BecomeWorker";
import CostEstimation from "./pages/CostEstimation";
import Breakdown from "./pages/Breakdown";
import Warranty from "./pages/Warranty";
import Dispute from "./pages/Dispute";
import AdminDispute from "./pages/AdminDispute";

// AI pages (full screen, no public layout)
import AIChat from "./pages/AIChat";
import ResultPage from "./pages/ResultPage";
import PostJob from "./pages/PostJob";

//Job pages
import MyJobs from "./pages/Customer/MyJobs";
import JobDetail from "./pages/Customer/JobDetail";
import AdminJobs from "./pages/Admin/AdminJobs";

// Dashboard pages
import CustomerDashboard from "./pages/Customer/Dashboard";
import CustomerProfile from "./pages/Customer/Profile";
import BrowseWorkers from "./pages/Customer/BrowseWorkers";
import WorkerProfile from "./pages/WorkerProfile";
import WorkerDashboard from "./pages/Worker/Dashboard";
import WorkerServices from "./pages/Worker/Services";
import WorkerJobs from "./pages/Worker/Jobs";
import WorkerJobDetail from "./pages/Worker/JobDetail";
import AdminDashboard from "./pages/Admin/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ── PUBLIC LAYOUT ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/services" element={<Services />} />
        <Route path="/become-worker" element={<BecomeWorker />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/estimate" element={<CostEstimation />} />
        <Route path="/breakdown" element={<Breakdown />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/dispute" element={<Dispute />} />
        <Route path="/admin-dispute" element={<AdminDispute />} />
      </Route>

      {/* ── AI PAGES (full screen) ── */}
      <Route path="/ai-chat" element={<AIChat />} />
      <Route path="/ai/result" element={<ResultPage />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/emergency-workers" element={<PostJob />} />

      {/* ── CUSTOMER ── */}
      <Route path="/customer/dashboard"
        element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/browse-workers"
        element={<ProtectedRoute role="customer"><BrowseWorkers /></ProtectedRoute>} />
      <Route path="/customer/profile" 
        element={<CustomerProfile />} />
      <Route path="/customer/my-jobs"
        element={<ProtectedRoute role="customer"><MyJobs /></ProtectedRoute>}/>
      <Route path="/customer/jobs/:id"
        element={<ProtectedRoute role="customer"><JobDetail /></ProtectedRoute>}/>

      {/* ── WORKER PROFILE (public) ── */}
      <Route path="/worker-profile/:workerId" element={<WorkerProfile />} />

      {/* ── WORKER ── */}
      <Route path="/worker/dashboard"
        element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/worker/jobs"
        element={<ProtectedRoute role="worker"><WorkerJobs /></ProtectedRoute>} />
      <Route path="/worker/job-detail/:id"
        element={<ProtectedRoute role="worker"><WorkerJobDetail /></ProtectedRoute>} />
      <Route path="/worker/services"
        element={<ProtectedRoute role="worker"><WorkerServices /></ProtectedRoute>} />

      {/* ── ADMIN ── */}
      <Route path="/admin/dashboard"
        element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

      <Route path="/admin/jobs"
        element={<ProtectedRoute role="admin"><AdminJobs /></ProtectedRoute>}/>

    
    </Routes>
  );
}

export default App;