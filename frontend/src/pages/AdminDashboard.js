import React, { useEffect, useState } from "react";
import api from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function AdminDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/analytics").then(res => {
      const formatted = res.data.map(item => ({
        name: item._id,
        count: item.count
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="p-10">
      <div className="card max-w-4xl mx-auto">
        <h2 className="text-3xl mb-6">Platform Analytics</h2>

        <BarChart width={600} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" />
        </BarChart>
      </div>
    </div>
  );
}

export default AdminDashboard;