import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    api.get("/events").then(res => setEvents(res.data));
  }, []);

  const deleteEvent = async (id) => {
    await api.delete(`/events/${id}`);
    setEvents(events.filter(e => e._id !== id));
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl mb-6">All Events</h2>

      {events.map(event => (
        <div key={event._id} className="border p-4 mb-4 rounded">
          <h3 className="font-bold">{event.title}</h3>
          <p>{event.description}</p>
          <p>₹ {event.price}</p>

          <div className="flex gap-3 mt-3">
            <Link to={`/chat/${event._id}`}><button className="bg-green-600 text-white px-3 py-1 rounded">Chat</button></Link>
            <Link to={`/video/${event._id}`}><button className="bg-blue-600 text-white px-3 py-1 rounded">Video</button></Link>
            <Link to={`/tickets/${event._id}`}><button className="bg-pink-600 text-white px-3 py-1 rounded">Ticket</button></Link>

            {role === "admin" && (
              <button onClick={() => deleteEvent(event._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Events;