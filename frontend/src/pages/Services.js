import HomeNavbar from "../components/Navbars/HomeNavBar";
import Footer from "../components/Footer/Footer";

const services = [
  {
    name:"Plumbing",
    description:"Fix leaks, pipe issues, and water system problems."
  },
  {
    name:"Electrical",
    description:"Electrical repairs, wiring, and installations."
  },
  {
    name:"AC Repair",
    description:"Air conditioning maintenance and repair services."
  },
  {
    name:"Home Cleaning",
    description:"Professional house cleaning services."
  },
  {
    name:"Painting",
    description:"Interior and exterior painting for homes."
  },
  {
    name:"Appliance Repair",
    description:"Repair washing machines, refrigerators, ovens, etc."
  }
];

const Services = () => {
  return (
    <>
      

      <div className="bg-slate-50 py-16 px-6 min-h-screen">

        <h1 className="text-3xl font-bold text-center">
          Available Services
        </h1>

        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service,index)=>(
            <div
              key={index}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {service.name}
              </h3>

              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}

        </div>

      </div>

      
    </>
  );
};

export default Services;