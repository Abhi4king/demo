import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from '../config';

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not set in config.ts. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });

export const generateSummary = async (text: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return "Error: GEMINI_API_KEY is not configured in config.ts.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following document content in three concise bullet points:\n\n---\n\n${text}`,
      config: {
        systemInstruction: "You are an expert document summarizer. Provide clear, professional summaries.",
        temperature: 0.5,
      }
    });
    
    return response.text ?? "Summary could not be generated.";
  } catch (error) {
    console.error("Error generating summary:", error);
    if (error instanceof Error) {
        return `Error from Gemini API: ${error.message}`;
    }
    return "An unknown error occurred while generating the summary.";
  }
};