import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
  const { topic } = req.body;
  const ideas = [
    `AI-powered ${topic} assistant`,
    `Smart ${topic} analyzer`,
    `AI tool that automates ${topic} tasks`,
  ];
  res.json({ ideas });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
