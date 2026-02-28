import React, { useState, useEffect } from "react";
import socket from "../socket";
import { useParams } from "react-router-dom";

function ChatRoom() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join-room", { roomId: id });

    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    socket.on("receive-message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("chat-history");
    };
  }, [id]);

  const send = () => {
    socket.emit("send-message", { roomId: id, message: text });
    setText("");
  };

  return (
    <div className="p-10">
      <h2>Chat</h2>
      <div className="border p-4 h-64 overflow-y-scroll mb-3">
        {messages.map((m,i)=><p key={i}><b>{m.sender}:</b> {m.text}</p>)}
      </div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        className="border p-2 mr-2 bg-white text-black rounded"
      />
      <button onClick={send} className="bg-purple-600 text-white px-4 py-2 rounded">Send</button>
    </div>
  );
}

export default ChatRoom;