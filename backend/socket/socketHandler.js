const Message = require("../models/Message");
const Poll = require("../models/Poll");
const Analytics = require("../models/Analytics");
const Event = require("../models/Event");
const { generateAIReply } = require("../services/aiService");

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // ========================================
    // JOIN EVENT ROOM
    // ========================================
    socket.on("join-room", async ({ roomId }) => {
      try {
        socket.join(roomId);

        // Send chat history
        const history = await Message.find({ eventId: roomId })
          .sort({ createdAt: 1 });

        socket.emit("chat-history", history);

      } catch (error) {
        console.error("Join room error:", error);
      }
    });

    // ========================================
    // SEND MESSAGE (CHAT + AI + ANALYTICS)
    // ========================================
    socket.on("send-message", async ({ roomId, message }) => {
      try {

        // 1️⃣ Save user message
        const userMsg = await Message.create({
          eventId: roomId,
          sender: "user",
          text: message
        });

        // Emit to room
        io.to(roomId).emit("receive-message", userMsg);

        // 2️⃣ Log chat analytics
        await Analytics.create({
          eventId: roomId,
          action: "chat"
        });

        // 3️⃣ Fetch event details for AI context
        const eventDetails = await Event.findById(roomId);

        if (!eventDetails) {
          return;
        }

        // 4️⃣ Generate AI reply
        const aiReplyText = await generateAIReply(eventDetails, message);

        // 5️⃣ Save AI reply
        const botMsg = await Message.create({
          eventId: roomId,
          sender: "AI Assistant",
          text: aiReplyText
        });

        // Emit AI response
        io.to(roomId).emit("receive-message", botMsg);

      } catch (error) {
        console.error("Chat AI error:", error);
      }
    });

    // ========================================
    // POLL VOTING (REAL-TIME + ANALYTICS)
    // ========================================
    socket.on("vote", async ({ pollId, optionIndex }) => {
      try {

        const poll = await Poll.findById(pollId);
        if (!poll) return;

        if (!poll.options[optionIndex]) return;

        // Increment vote
        poll.options[optionIndex].votes += 1;
        await poll.save();

        // Log poll analytics
        await Analytics.create({
          eventId: poll.eventId,
          action: "poll"
        });

        // Emit updated poll to event room
        io.to(poll.eventId.toString()).emit("poll-updated", poll);

      } catch (error) {
        console.error("Poll voting error:", error);
      }
    });

    // ========================================
    // DISCONNECT
    // ========================================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};