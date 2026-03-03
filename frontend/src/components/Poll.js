import React, { useEffect, useState } from "react";
import socket from "../socket";

function Poll({ poll }) {
  const [currentPoll, setCurrentPoll] = useState(poll);

  useEffect(() => {
    socket.on("poll-updated", (updatedPoll) => {
      if (updatedPoll._id === poll._id) {
        setCurrentPoll(updatedPoll);
      }
    });

    return () => socket.off("poll-updated");
  }, [poll._id]);

  const vote = (index) => {
    socket.emit("vote", {
      pollId: currentPoll._id,
      optionIndex: index
    });
  };

  return (
    <div className="card mt-6">
      <h3 className="text-xl mb-4">{currentPoll.question}</h3>

      {currentPoll.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => vote(i)}
          className="button-primary w-full mt-2"
        >
          {opt.text} ({opt.votes})
        </button>
      ))}
    </div>
  );
}

export default Poll;