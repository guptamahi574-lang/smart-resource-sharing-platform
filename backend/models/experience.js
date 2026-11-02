
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        studentName: {
            type: String,
            required: true,
            trim: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        }
    },
    { timestamps: true }
);

const experienceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        fullStory: {
            type: String,
            default: ""
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        authorName: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            default: ""
        },
        year: {
            type: String,
            default: ""
        },
        feedback: {
            type: [feedbackSchema],
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
