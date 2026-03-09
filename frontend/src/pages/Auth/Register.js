import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    role:"customer",
    certifications:""
  });

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      const res = await register(form);

      alert(res.message);

      navigate("/login");

    }catch(err){

      alert(err.response?.data?.message || "Register failed");

    }
  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">

      <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 w-96 text-white">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/90 text-black focus:ring-2 focus:ring-cyan-300"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/90 text-black focus:ring-2 focus:ring-cyan-300"
          />

          <select
            name="role"
            onChange={handleChange}
            className="p-3 rounded-lg bg-white text-black"
          >
            <option value="customer">Customer</option>
            <option value="worker">Worker</option>
          </select>

          {form.role === "worker" && (

            <input
              name="certifications"
              placeholder="Certifications / Skills"
              onChange={handleChange}
              className="p-3 rounded-lg bg-white/90 text-black animate-fadeIn"
            />

          )}

          <button
            type="submit"
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold p-3 rounded-lg transition transform hover:scale-105"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-5 text-sm">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 font-semibold underline hover:text-cyan-200"
          >
            Login
          </Link>
        </p>

      </div>

    </div>

  );

};

export default Register;