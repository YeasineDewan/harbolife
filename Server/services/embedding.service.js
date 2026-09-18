import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates vector embeddings for a given text using Google Gemini or OpenAI.
 * @param {string} text - The input text to embed.
 * @returns {Promise<number[]>} The vector embedding array.
 */
export const getEmbedding = async (text) => {

  if (!text || typeof text !== "string" || text.trim() === "") {
    throw new Error("Text must be a non-empty string");
  }

  if (process.env.GEMINI_API_KEY) {
    const modelsToTry = ["text-embedding-004", "gemini-embedding-001"];
    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.embedContent(text);
        if (result && result.embedding && result.embedding.values) {
          return result.embedding.values;
        }
      } catch (error) {
        console.error(`Error generating embedding with Gemini (${modelName}):`, error.message);
      }
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      if (response && response.data && response.data[0] && response.data[0].embedding) {
        return response.data[0].embedding;
      }
    } catch (error) {
      console.error("Error generating embedding with OpenAI:", error.message);
    }
  }

  throw new Error("No configured or valid API Key (GEMINI_API_KEY or OPENAI_API_KEY) found to generate embeddings.");
};

/**
 * Calculates the cosine similarity between two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Cosine similarity score (between -1 and 1)
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};