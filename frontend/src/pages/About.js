import HomeNavbar from "../components/Navbars/HomeNavBar";
import Footer from "../components/Footer/Footer";

const About = () => {
  return (
    <>
     

      <div className="bg-slate-50 min-h-screen py-16 px-6">

        <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow">

          <h1 className="text-3xl font-bold mb-4">
            About Our Platform
          </h1>

          <p className="text-gray-700 mb-4">
            Smart Local Service Intelligence Platform connects customers with
            trusted local professionals. Our goal is to simplify how people
            find reliable services such as plumbing, electrical work,
            appliance repair, and home maintenance.
          </p>

          <p className="text-gray-700 mb-6">
            The platform uses intelligent analysis to understand user problems,
            categorize service needs, and recommend the best possible solutions
            or workers available nearby.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            Our Mission
          </h2>

          <p className="text-gray-700 mb-6">
            To make local services accessible, transparent, and reliable by
            combining technology, intelligent recommendations, and verified
            professionals.
          </p>

          <h2 className="text-xl font-semibold mb-2">
            Key Features
          </h2>

          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>AI-based issue analysis</li>
            <li>Trusted worker recommendations</li>
            <li>Service request management</li>
            <li>Admin verification for workers</li>
            <li>Secure login and authentication</li>
          </ul>

        </div>

      </div>

      
    </>
  );
};

export default About;