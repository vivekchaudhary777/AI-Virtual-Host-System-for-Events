const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// LangChain will automatically use tracing and other config from process.env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let model = null;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: GEMINI_API_KEY,
  });
}

/**
 * Generate AI host response using Gemini 1.5 Flash via LangChain.
 * Fallbacks to scripted responses if API key is missing.
 */
const generateHostResponse = async (userPrompt, context = "", history = "") => {
  if (!model) {
    return getFallbackResponse(userPrompt, context, history);
  }

  try {
    const prompt = `
      You are the AI Virtual Host of a virtual event platform. You are engaging, helpful, and love to chat with attendees.
      
      EVENT KNOWLEDGE:
      ${context}

      CONVERSATION HISTORY:
      ${history}

      CURRENT USER QUESTION: "${userPrompt}"
      
      INSTRUCTIONS:
      1. Use the CONVERSATION HISTORY to maintain continuity. If the user says "tell me more," refer to what was just discussed.
      2. Answer questions DIRECTLY using the EVENT KNOWLEDGE.
      3. Be conversational. Don't just give facts; wrap them in a friendly host persona.
      4. ALWAYS end with a short, relevant follow-up question to keep the user engaged (e.g., "Would you like to know about the next speaker as well?").
      5. Keep the total response under 80 words.
    `;

    const response = await model.invoke(prompt);
    return response.content;
  } catch (error) {
    console.error("LangChain Gemini Error:", error.message);
    return getFallbackResponse(userPrompt, context, history);
  }
};

/**
 * Basic fallback messages if AI is unavailable.
 */
const getFallbackResponse = (prompt, context = "", history = "") => {
  const p = prompt.toLowerCase();
  
  // Basic memory-like check for fallbacks
  if (p.includes("more") || p.includes("elaborate") || p.includes("detail")) {
    return "I'd love to tell you more! Is there a specific part of the event or a certain speaker you're curious about?";
  }
  
  // Extract fields from context string if possible
  const getField = (field) => {
    if (!context) return null;
    const parts = context.split(`${field}:`);
    if (parts.length > 1) return parts[1].split(".")[0].trim();
    return null;
  };

  const title = getField("Event");
  const desc = getField("Description");
  const date = getField("Date");

  if (p.includes("desc") || p.includes("about") || p.includes("what is")) {
    if (desc) return `This event, "${title}", is ${desc}. It's going to be an amazing session!`;
    return "This event is a specialized session for our attendees. We're excited to have you here!";
  }
  
  if (p.includes("schedule") || p.includes("when") || p.includes("time") || p.includes("start")) {
    if (date) return `The event starts on ${date}. Make sure to join on time!`;
    return "The event schedule is available. We have a full lineup starting soon.";
  }

  if (p.includes("speaker") || p.includes("who")) {
    return `We have world-class speakers for "${title || 'this event'}". Stay tuned for their sessions!`;
  }

  if (p.includes("join") || p.includes("how to")) {
    return "To join a session, simply stay in this room or navigate to the 'Live' tab when it's time!";
  }
  
  return "I'm here to help you navigate the event! Feel free to ask about the schedule, booths, or speakers.";
};

module.exports = { generateHostResponse };
