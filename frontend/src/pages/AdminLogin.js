import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await api.post("/auth/admin-login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", "admin");

    navigate("/events");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2>Admin Login</h2>
      <input className="border p-2 mr-2 bg-white text-black rounded" onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input className="border p-2 mr-2 bg-white text-black rounded" type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={login} className="bg-indigo-600 text-white px-4 py-2 rounded">Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;