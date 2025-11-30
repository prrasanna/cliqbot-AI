import { GoogleGenAI, Type } from "@google/genai";
import type { Message, LeadInfo, Suggestion } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Assume this variable is pre-configured, valid, and accessible in the execution context.
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});


/**
 * Helper to detect quota errors (429 Resource Exhausted)
 */
const isQuotaError = (error: any) => {
  const msg = error?.message || JSON.stringify(error);
  return (
    msg.includes('429') || 
    msg.includes('quota') || 
    msg.includes('RESOURCE_EXHAUSTED') ||
    error?.status === 429 ||
    error?.code === 429
  );
};

/**
 * Sends a message to the chat model.
 */
export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string
): Promise<string> => {
  try {
    // We filter the history to ensure valid roles and content
    // We exclude the very last message if it matches 'newMessage' to prevent duplication 
    // because chat.sendMessage takes the new message as an argument.
    const validHistory = history
      .filter(msg => msg.content && msg.content !== newMessage) 
      .slice(-10) // Keep context window manageable
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: validHistory,
      config: {
        systemInstruction: "You are a helpful, professional AI assistant integrated into Zoho Cliq. You help users qualify leads, schedule meetings, and manage CRM data. Keep responses concise and business-oriented.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm having trouble connecting right now.";
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("Gemini API Quota Exceeded (Chat).");
      return "I'm currently experiencing high traffic. Please try again in a moment.";
    }
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};

/**
 * Analyzes the conversation to extract Lead Information in JSON format.
 */
export const analyzeLeadData = async (
  history: Message[]
): Promise<Partial<LeadInfo> | null> => {
  try {
    const conversationText = history.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const prompt = `Analyze the conversation below and extract lead information into a JSON object.
Conversation:
${conversationText}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            company: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            score: { type: Type.NUMBER, description: "Lead score from 0 to 100 based on interest level" },
            status: { type: Type.STRING, enum: ['New', 'Qualified', 'Negotiation', 'Closed'] },
            summary: { type: Type.STRING, description: "A 2 sentence summary of the lead's needs" }
          },
          required: ["score", "status", "summary"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<LeadInfo>;
    }
    return null;

  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("Gemini API Quota Exceeded (Lead Analysis) - Skipping background task.");
      return null;
    }
    console.error("Lead Analysis Error:", error);
    return null;
  }
};

/**
 * Generates quick reply suggestions based on context.
 */
export const getSmartSuggestions = async (
  lastMessage: string
): Promise<Suggestion[]> => {
  try {
    const prompt = `Based on the last message: "${lastMessage}", provide 3 short, relevant follow-up actions. Return ONLY a JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              action: { type: Type.STRING }
            },
            required: ["label", "action"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Suggestion[];
    }
    return [];
  } catch (error) {
    if (isQuotaError(error)) {
      console.warn("Gemini API Quota Exceeded (Suggestions) - Skipping.");
      return [];
    }
    console.error("Suggestion Error:", error);
    return [];
  }
};
