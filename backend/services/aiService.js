const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Generates an AI reply for event-related questions.
 * @param {Object} eventDetails - { title, description, price }
 * @param {string} userMessage - The user's question
 */
async function generateAIReply(eventDetails, userMessage) {
  // Initialize with your API Key from environment variables
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // 'gemini-1.5-flash' is the most stable wide-release model
    // You can also try 'gemini-2.0-flash' for newer features
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI Event Assistant.
      
      Event Details:
      Title: ${eventDetails.title}
      Description: ${eventDetails.description}
      Price: ${eventDetails.price}

      User Question:
      ${userMessage}

      Instructions:
      Answer clearly based ONLY on the details provided. 
      If info is not available, say so politely.
    `;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    if (error.message.includes("404") || error.message.includes("not found")) {
      console.error("MODEL ERROR: The specified model was not found. Try 'gemini-1.5-flash' or check your project permissions in Google AI Studio.");
    } else {
      console.error("GEMINI API ERROR:", error.message);
    }
    return "I'm sorry, I'm having trouble accessing the event details right now.";
  }
}

// Optional helper to check which models your key can actually see
async function listAvailableModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // This uses a direct fetch as the SDK's listModels can sometimes vary by version
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com{process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Available Models:", data.models.map(m => m.name));
  } catch (e) {
    console.error("Could not list models:", e.message);
  }
}

module.exports = { generateAIReply, listAvailableModels };
