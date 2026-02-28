import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, admin }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;

  if (admin && role !== "admin") {
    return <Navigate to="/events" />;
  }

  return children;
}

export default ProtectedRoute;