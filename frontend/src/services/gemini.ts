import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in .env");
}

const ai = new GoogleGenAI({
  apiKey: apiKey
});

export async function generateItinerary(
  destination: string,
  duration: number,
  preferences: string
) {
  const model = "gemini-3.1-pro-preview";

  const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination}.
User preferences: ${preferences}.
Include daily activities, recommended hotels, and local dining spots.
Format the response in Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return "Failed to generate itinerary. Please try again.";
  }
}