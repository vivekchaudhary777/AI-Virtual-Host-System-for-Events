import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white text-center">
      <h1 className="text-5xl font-bold mb-6">🎉 Virtual Event Platform</h1>
      <p className="mb-10 max-w-xl">
        Host, manage and attend virtual events with real-time chat and video.
      </p>

      <div className="flex gap-6">
        <Link to="/login"><button className="px-6 py-3 bg-indigo-600 rounded-xl">Login</button></Link>
        <Link to="/register"><button className="px-6 py-3 bg-purple-600 rounded-xl">Register</button></Link>
        <Link to="/admin">
          <button className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition">
            Admin Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;