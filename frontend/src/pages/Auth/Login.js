import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const [form,setForm] = useState({
    email:"",
    password:""
  });

  const { loginUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{

    if(user){
      if(user.role === "customer") navigate("/customer/dashboard");
      if(user.role === "worker") navigate("/worker/dashboard");
    }

  },[user,navigate]);

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{
      await loginUser(form);
    }
    catch(err){
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-96">

        <h2 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?
          <Link
            to="/register"
            className="text-indigo-600 font-semibold ml-1 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>

  );

};

export default Login;