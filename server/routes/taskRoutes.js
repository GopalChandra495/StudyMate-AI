const express = require("express");
const Task = require("../models/Task");
const Topic = require("../models/Topics");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==================== CREATE TASK ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      topicId,
    } = req.body;

    if (!title || !dueDate || !topicId) {
      return res.status(400).json({
        message: "Title, dueDate and topicId are required",
      });
    }

    const topic = await Topic.findOne({
      _id: topicId,
      userId: req.userId,
    });

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    const task = await Task.create({
      title,
      description: description || "",
      priority: priority || "Medium",
      dueDate,
      topicId,
      userId: req.userId,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==================== GET ALL TASKS ====================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
    })
      .populate("topicId", "title")
      .sort({ dueDate: 1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==================== UPDATE TASK ====================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      completed,
    } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        title,
        description,
        priority,
        dueDate,
        completed,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// ==================== DELETE TASK ====================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;