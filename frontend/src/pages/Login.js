import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    navigate("/events");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-xl mb-4">Login</h2>
        <input className="border p-2 mr-2 bg-white text-black rounded" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="border p-2 mr-2 bg-white text-black rounded" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="bg-indigo-600 text-white px-4 py-2 rounded">Login</button>
      </div>
    </div>
  );
}

export default Login;