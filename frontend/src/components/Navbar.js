import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-black text-white">
      <Link to="/" className="font-bold">Virtual Events</Link>

      <div className="flex gap-4">
        <Link to="/events">Events</Link>

        {role === "admin" && <Link to="/create">Create</Link>}

        {localStorage.getItem("token") ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;