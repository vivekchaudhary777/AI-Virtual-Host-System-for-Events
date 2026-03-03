import React, { useEffect, useState } from "react";
import api from "../api";
import Poll from "../components/Poll";
import { useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    api.get(`/poll/${id}`).then(res => {
      setPoll(res.data);
    });
  }, [id]);

  return (
    <div className="p-10">
      <h2 className="text-3xl mb-6">Event Details</h2>

      {poll && <Poll poll={poll} />}
    </div>
  );
}

export default EventDetails;