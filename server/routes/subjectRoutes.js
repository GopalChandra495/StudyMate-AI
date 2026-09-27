const express = require("express");
const Subject = require("../models/Subjects");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================== CREATE SUBJECT ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, difficulty } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const subject = await Subject.create({
      name,
      difficulty,
      userId: req.userId,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== GET ALL SUBJECTS ====================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({
      userId: req.userId,
    });

    res.status(200).json({
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== UPDATE SUBJECT ====================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, difficulty, progress } = req.body;

    const subject = await Subject.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        name,
        difficulty,
        progress,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


// ==================== DELETE SUBJECT ====================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


module.exports = router;