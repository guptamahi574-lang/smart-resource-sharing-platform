
const express = require("express");
const mongoose = require("mongoose");
const Experience = require("../models/experience");

const router = express.Router();

// Get all stories
router.get("/", async (req, res) => {
    try {
        const stories = await Experience.find().sort({
            createdAt: -1
        });

        const result = stories.map((story) => {
            const ratings = story.feedback || [];

            const averageRating = ratings.length
                ? ratings.reduce((sum, item) => sum + item.rating, 0) /
                  ratings.length
                : 0;

            return {
                ...story.toObject(),
                averageRating: Number(averageRating.toFixed(1)),
                totalRatings: ratings.length
            };
        });

        res.json({
            success: true,
            stories: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Stories load nahi ho paayi."
        });
    }
});

// Add a new story
router.post("/", async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            fullStory,
            authorName,
            branch,
            year
        } = req.body;

        if (!title || !category || !description || !authorName) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing hain."
            });
        }

        const story = await Experience.create({
            title,
            category,
            description,
            fullStory,
            authorName,
            branch,
            year
        });

        res.status(201).json({
            success: true,
            story
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Story save nahi ho paayi."
        });
    }
});

// Add or update rating and feedback
router.put("/:id/feedback", async (req, res) => {
    try {
        const { studentId, rating, comment } = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid story ID."
            });
        }

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Valid student ID required hai."
            });
        }

        if (!Number.isInteger(Number(rating)) ||
            Number(rating) < 1 ||
            Number(rating) > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating 1 se 5 stars ke beech honi chahiye."
            });
        }

        const story = await Experience.findById(req.params.id);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story nahi mili."
            });
        }

        const User = require("../models/user");
        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student account nahi mila."
            });
        }

        const existingFeedback = story.feedback.find(
            (item) => item.studentId.toString() === studentId
        );

        if (existingFeedback) {
            existingFeedback.rating = Number(rating);
            existingFeedback.comment = comment || "";
            existingFeedback.studentName = student.name;
        } else {
            story.feedback.push({
                studentId,
                studentName: student.name,
                rating: Number(rating),
                comment: comment || ""
            });
        }

        await story.save();

        const ratings = story.feedback;
        const averageRating = ratings.reduce(
            (sum, item) => sum + item.rating, 0
        ) / ratings.length;

        res.json({
            success: true,
            message: "Feedback save ho gaya.",
            averageRating: Number(averageRating.toFixed(1)),
            totalRatings: ratings.length,
            feedback: ratings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Feedback save nahi ho paaya."
        });
    }
});

module.exports = router;
