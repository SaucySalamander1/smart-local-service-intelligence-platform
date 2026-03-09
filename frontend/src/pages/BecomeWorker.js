import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/Navbars/HomeNavBar";
import Footer from "../components/Footer/Footer";

const BecomeWorker = () => {

  const navigate = useNavigate();

  const handleApply = ()=>{
    navigate("/register");
  };

  return (
    <>
      

      <div className="bg-slate-50 min-h-screen py-16 px-6">

        <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow">

          <h1 className="text-3xl font-bold mb-4">
            Become a Worker
          </h1>

          <p className="text-gray-600 mb-6">
            Join our platform and connect with customers looking for
            reliable professionals in their area.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            Benefits
          </h2>

          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Access to local customers</li>
            <li>Flexible work opportunities</li>
            <li>Verified professional platform</li>
            <li>Grow your service business</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            How It Works
          </h2>

          <ol className="list-decimal pl-6 text-gray-700 space-y-1">
            <li>Register as a worker</li>
            <li>Submit certifications</li>
            <li>Admin reviews your profile</li>
            <li>Get approved and start receiving jobs</li>
          </ol>

          <button
            onClick={handleApply}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Apply as Worker
          </button>

        </div>

      </div>

      
    </>
  );
};

export default BecomeWorker;