import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

  const [form,setForm] = useState({
    email:"",
    password:""
  });

  const { loginAdmin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{

    if(user && user.role === "admin"){
      navigate("/admin/dashboard");
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

      await loginAdmin(form);

      navigate("/admin/dashboard");

    }catch(err){

      alert(err.message || "Admin login failed");

    }

  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-96">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Admin Panel
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            onChange={handleChange}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-gray-700"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-gray-700"
          />

          <button
            type="submit"
            className="bg-gray-800 text-white p-3 rounded-lg hover:bg-black transition transform hover:scale-105"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  );

};

export default AdminLogin;