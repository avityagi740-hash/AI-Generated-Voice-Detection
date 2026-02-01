
import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVoiceSample = async (
  base64Audio: string,
  mimeType: string,
  language: Language
): Promise<DetectionResult> => {
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are an expert audio forensic engineer specializing in detecting synthetic media and Deepfakes.
    Your task is to analyze the provided audio sample and determine if it is AI-generated (synthetic) or Human-generated.
    
    The audio is in ${language}.
    
    Look for:
    1. AI Artifacts: Lack of breathing sounds, unnatural pauses, robotic cadence, consistent background "floor" noise, phrase repetition patterns, or metallic resonance.
    2. Human Cues: Micro-fluctuations in pitch, emotional inflection, natural breath intakes, dental/plosive sounds that vary naturally, and slight stumbles or colloquial timing.
    
    Respond strictly in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio,
          },
        },
        {
          text: `Analyze this audio sample in ${language}. Provide a detailed classification, confidence score (0-100), and explanation.`
        }
      ],
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: {
            type: Type.STRING,
            description: "Either AI_GENERATED or HUMAN_GENERATED"
          },
          confidenceScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 indicating certainty"
          },
          explanation: {
            type: Type.STRING,
            description: "Detailed breakdown of the findings"
          },
          linguisticCues: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific linguistic markers observed"
          },
          audioArtifacts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Technical audio anomalies or natural characteristics found"
          }
        },
        required: ["classification", "confidenceScore", "explanation", "linguisticCues", "audioArtifacts"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("Empty response from AI model.");
  
  return JSON.parse(resultText) as DetectionResult;
};
