import WorkerNavBar from "../../components/Navbars/WorkerNavbar";

const WorkerDashboard = () => {

  return (

    <div className="min-h-screen bg-gray-100">

      <WorkerNavBar />

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-6">
          Worker Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold">My Services</h2>
            <p className="text-gray-600 mt-2">
              Manage the services you offer.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold">Bookings</h2>
            <p className="text-gray-600 mt-2">
              View customer booking requests.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold">Ratings</h2>
            <p className="text-gray-600 mt-2">
              Check feedback from customers.
            </p>
          </div>

        </div>

      </div>

    </div>

  );

};

export default WorkerDashboard;