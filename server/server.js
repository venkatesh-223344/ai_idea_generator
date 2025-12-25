import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:5000", // Optional, for including your app on openrouter.ai rankings.
    "X-Title": process.env.SITE_NAME || "AI Idea Generator", // Optional. Shows in rankings on openrouter.ai.
  }
});

app.post("/generate", async (req, res) => {
  try {
    const { businessType } = req.body;
    if (!businessType) {
      return res.status(400).json({ error: "Business Type is required" });
    }

    const prompt = `For a "${businessType}" business, generate:
    1. 10 Business Ideas
    2. 10 Marketing Ideas
    3. 10 Content Ideas

    Return the result strictly as a valid JSON object with the following structure:
    {
      "businessIdeas": ["idea 1", "idea 2", ...],
      "marketingIdeas": ["idea 1", "idea 2", ...],
      "contentIdeas": ["idea 1", "idea 2", ...]
    }
    Do not add any markdown formatting like \`\`\`json. Just the raw JSON string.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "mistralai/mistral-7b-instruct:free", // Free model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const aiText = completion.choices[0].message.content;

      let resultJson;
      try {
        resultJson = JSON.parse(aiText);
      } catch (e) {
        // Fallback if AI wraps in markdown, common with some models
        const match = aiText.match(/\{[\s\S]*\}/);
        if (match) {
          resultJson = JSON.parse(match[0]);
        } else {
          console.error("Failed to parse AI response text:", aiText); // Log the raw text for debugging
          throw new Error("Failed to parse AI response");
        }
      }

      res.json(resultJson);

    } catch (apiError) {
      console.error("OpenRouter API Error:", apiError);

      // If it's a rate limit error, pass it to the frontend
      if (apiError.status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
      }

      // Pass other API errors with their message
      return res.status(apiError.status || 500).json({
        error: apiError.message || "Failed to generate ideas via OpenRouter."
      });
    }

  } catch (error) {
    console.error("Error generating ideas:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

