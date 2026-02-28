import React, { useState } from "react";
import api from "../api";
import { Navigate } from "react-router-dom";

function CreateEvent() {
  const role = localStorage.getItem("role");
  const [form, setForm] = useState({});

  if (role !== "admin") return <Navigate to="/" />;

  const create = async () => {
    await api.post("/events", form);
    alert("Event Created");
  };

  return (
    <div className="p-10">
      <h2>Create Event</h2>
      <input className="border p-2 mr-2 bg-white text-black rounded" placeholder="Title" onChange={e => setForm({...form, title:e.target.value})} />
      <input className="border p-2 mr-2 bg-white text-black rounded" placeholder="Description" onChange={e => setForm({...form, description:e.target.value})} />
      <input className="border p-2 mr-2 bg-white text-black rounded" placeholder="Price" onChange={e => setForm({...form, price:e.target.value})} />
      <button onClick={create} className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
    </div>
  );
}

export default CreateEvent;