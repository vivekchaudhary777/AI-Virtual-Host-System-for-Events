import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold mb-6"
      >
        Virtual Event Platform 🚀
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-300 mb-10"
      >
        Host, Join and Experience Events in Real-Time
      </motion.p>

      <div className="flex gap-6">

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/events">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition">
              Browse Events
            </button>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/create">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg transition">
              Create Event
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default Dashboard;