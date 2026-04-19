import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CostEstimation from "./pages/CostEstimation";
import Breakdown from "./pages/Breakdown";
import Warranty from "./pages/Warranty";
import Dispute from "./pages/Dispute";
import AdminDispute from "./pages/AdminDispute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/estimate" element={<CostEstimation />} />
        <Route path="/breakdown" element={<Breakdown />} />
        <Route path="/review" element={<SystemReview />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/dispute" element={<Dispute />} />
        <Route path="/admin-dispute" element={<AdminDispute />} />
      </Routes>
    </Router>
  );
}

export default App;