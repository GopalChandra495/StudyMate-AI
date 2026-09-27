const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  generateTopics,
  askTutor,
  generateStudyPlan,
} = require("../services/geminiService");

const router = express.Router();

// Existing AI topic suggestions route
router.post("/topics", authMiddleware, async (req, res) => {
  try {
    const { subject } = req.body;

    if (typeof subject !== "string" || !subject.trim()) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    const topics = await generateTopics(subject.trim());

    return res.status(200).json({
      message: "Topics generated successfully",
      subject: subject.trim(),
      topics,
    });
  } catch (error) {
    console.error("AI Topic Generation Error:", error);

    return res.status(500).json({
      message: "Failed to generate topics",
    });
  }
});

// AI Tutor route
router.post(
  "/tutor",
  (req, res, next) => {
    console.log("POST /api/ai/tutor request received");
    next();
  },
  authMiddleware,
  async (req, res) => {
    console.log("AI Tutor handler started");

    try {
      const { topic, question } = req.body;

      if (typeof topic !== "string" || !topic.trim()) {
        return res.status(400).json({
          message: "Topic is required",
        });
      }

      if (typeof question !== "string" || !question.trim()) {
        return res.status(400).json({
          message: "Question is required",
        });
      }

      if (topic.length > 200 || question.length > 2000) {
        return res.status(400).json({
          message: "Topic or question is too long",
        });
      }

      console.log("Sending question to AI Tutor...");

      const answer = await askTutor(topic.trim(), question.trim());

      console.log("AI Tutor answer received");

      return res.status(200).json({
        message: "Tutor answer generated successfully",
        answer,
      });
    } catch (error) {
      console.error("AI Tutor Error:", error);

      return res.status(500).json({
        message: "Failed to get tutor answer",
      });
    }
  }
);

// Generate a personalized study plan
router.post("/study-plan", authMiddleware, async (req, res) => {
  try {
    const { topics, dailyHours, durationDays, startDate } = req.body;

    // Validate topics
    if (
      !Array.isArray(topics) ||
      topics.length === 0 ||
      topics.length > 20 ||
      !topics.every(
        (topic) =>
          typeof topic === "string" &&
          topic.trim().length > 0 &&
          topic.trim().length <= 200
      )
    ) {
      return res.status(400).json({
        message: "Please provide 1 to 20 valid saved topics",
      });
    }

    // Validate available study hours
    if (
      typeof dailyHours !== "number" ||
      !Number.isFinite(dailyHours) ||
      dailyHours < 1 ||
      dailyHours > 16
    ) {
      return res.status(400).json({
        message: "Daily study hours must be a number between 1 and 16",
      });
    }

    // Validate plan duration
    if (
      !Number.isInteger(durationDays) ||
      durationDays < 1 ||
      durationDays > 30
    ) {
      return res.status(400).json({
        message: "Plan duration must be between 1 and 30 days",
      });
    }

    // Validate start date in YYYY-MM-DD format
    if (
      typeof startDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate)
    ) {
      return res.status(400).json({
        message: "Start date must be in YYYY-MM-DD format",
      });
    }

    const parsedDate = new Date(`${startDate}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== startDate
    ) {
      return res.status(400).json({
        message: "Please provide a valid start date",
      });
    }

    const cleanTopics = topics.map((topic) => topic.trim());

    const plan = await generateStudyPlan(
      cleanTopics,
      dailyHours,
      durationDays,
      startDate
    );

    return res.status(200).json({
      message: "Study plan generated successfully",
      plan,
    });
  } catch (error) {
    console.error("AI Study Plan Generation Error:", error);

    return res.status(500).json({
      message: "Failed to generate study plan",
    });
  }
});

module.exports = router;