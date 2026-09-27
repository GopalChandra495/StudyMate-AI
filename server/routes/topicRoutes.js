const express = require("express");
const Topic = require("../models/Topics");
const Subject = require("../models/Subjects");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==================== CREATE TOPIC ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, subjectId, difficulty } = req.body;

    if (!title || !subjectId) {
      return res.status(400).json({
        message: "Title and subjectId are required",
      });
    }

    const subject = await Subject.findOne({
      _id: subjectId,
      userId: req.userId,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    const topic = await Topic.create({
      title,
      difficulty: difficulty || "Medium",
      subjectId,
      userId: req.userId,
    });

    res.status(201).json({
      message: "Topic created successfully",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==================== GET TOPICS ====================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const topics = await Topic.find({
      userId: req.userId,
    }).populate("subjectId", "name");

    res.status(200).json({
      topics,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==================== UPDATE TOPIC ====================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, difficulty, completed } = req.body;

    const topic = await Topic.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        title,
        difficulty,
        completed,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    res.status(200).json({
      message: "Topic updated successfully",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==================== DELETE TOPIC ====================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    res.status(200).json({
      message: "Topic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;