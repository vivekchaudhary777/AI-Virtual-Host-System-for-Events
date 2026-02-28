import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const register = async () => {
    await api.post("/auth/register", form);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4">Register</h2>
        <input className="border p-2 mr-2 bg-white text-black rounded" placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
        <input className="border p-2 mr-2 bg-white text-black rounded" placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
        <input type="password" className="border p-2 mr-2 bg-white text-black rounded" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})} />
        <button onClick={register} className="bg-purple-600 text-white px-4 py-2 rounded">Register</button>
      </div>
    </div>
  );
}

export default Register;