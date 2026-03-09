import { useState } from "react";
import HomeNavbar from "../components/Navbars/HomeNavBar";
import Footer from "../components/Footer/Footer";

const Contact = () => {

  const [form,setForm] = useState({
    name:"",
    email:"",
    message:""
  });

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const handleSubmit = (e)=>{
    e.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <>
     

      <div className="bg-slate-50 min-h-screen py-16 px-6">

        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

          <h1 className="text-3xl font-bold mb-4">
            Contact Us
          </h1>

          <p className="text-gray-600 mb-6">
            If you have questions, feedback, or need support,
            feel free to contact us.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

      
    </>
  );
};

export default Contact;