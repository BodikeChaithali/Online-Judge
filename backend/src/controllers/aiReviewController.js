import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import ReviewLimit from "../models/reviewLimitModel.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const REVIEW_LIMIT = 3;
const WINDOW_HOURS = 3;

export const generateReview = async (req, res) => {
  try {
    const { code, language, problemTitle, userEmail } = req.body;
    if (!code) {
      return res.status(400).json({
        message: "Code is required",
      });
    }
    if (!userEmail) {
      return res.status(400).json({
        message: "User email is required",
      });
    }
    let limitDoc = await ReviewLimit.findOne({
      userEmail,
    });
    const now = new Date();
    if (!limitDoc) {
      limitDoc = await ReviewLimit.create({
        userEmail,
        count: 0,
        windowStart: now,
      });
    }
    const hoursPassed = (now - limitDoc.windowStart) / (1000 * 60 * 60);
    if (hoursPassed >= WINDOW_HOURS) {
      limitDoc.count = 0;
      limitDoc.windowStart = now;
    }
    if (limitDoc.count >= REVIEW_LIMIT) {
      const nextTime = new Date(
        limitDoc.windowStart.getTime() + WINDOW_HOURS * 60 * 60 * 1000,
      );
      return res.status(429).json({
        message: "AI Review limit reached. Try again later.",
        nextAvailableAt: nextTime,
      });
    }
    limitDoc.count += 1;
    await limitDoc.save();
    const prompt = `You are a Senior Competitive Programming Reviewer.Analyze the solution.Return ONLY valid JSON.
{
  "score": number,
  "correctness": "...",
  "timeComplexity": "...",
  "spaceComplexity": "...",
  "bugs": "...",
  "optimization": "...",
  "codeQuality": "...",
  "finalVerdict": "..."
}
Scoring Guidelines:
100 = Perfect solution.
90-99 = Correct and optimal.
75-89 = Correct but can be improved.
50-74 = Some mistakes.
25-49 = Significant mistakes.
0-24 = Incorrect.

IMPORTANT:
If correctness says the solution is correct,
and bugs says no bugs found,
and complexity is optimal,
then score MUST be at least 90.

Problem:
${problemTitle}

Language:
${language}

Code:
${code}
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    let text = response.text;
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    const review = JSON.parse(text);
    console.log("API called!!");
    return res.json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to generate AI Review",
    });
  }
};
