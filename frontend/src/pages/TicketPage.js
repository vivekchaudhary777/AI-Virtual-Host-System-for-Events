import React from "react";
import api from "../api";
import { useParams } from "react-router-dom";

function TicketPage() {
  const { id } = useParams();

  const buyTicket = async () => {
    await api.post("/tickets/buy", {
      eventId: id,
      userId: "USER_ID_FROM_TOKEN",
      price: 500
    });
    alert("Ticket Purchased");
  };

  return (
    <div className="container">
      <h2>Buy Ticket</h2>
      <button onClick={buyTicket}>Purchase</button>
    </div>
  );
}

export default TicketPage;