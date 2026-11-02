
require("dotenv").config();
const mongoose = require("mongoose");
const Experience = require("./models/experience");

const stories = [
    {
        title: "My First Internship Journey",
        category: "Internships",
        description: "My journey of finding and learning from my first internship.",
        fullStory: "Every first step teaches us something new. Start learning skills, build projects, and keep applying for opportunities.",
        authorName: "Aditya Sharma",
        branch: "CSE",
        year: "4th Year"
    },
    {
        title: "Preparing for Placement Season",
        category: "Placements",
        description: "Lessons I learned while preparing for placements.",
        fullStory: "Consistent practice, revising core subjects, solving coding problems, and mock interviews helped me prepare better.",
        authorName: "Sneha Verma",
        branch: "CST",
        year: "4th Year"
    },
    {
        title: "Making the Most of College",
        category: "College Life",
        description: "How I explored college activities and made new connections.",
        fullStory: "College is not only about classes. Participate in clubs, meet people, explore activities, and learn from new experiences.",
        authorName: "Rohan Mehta",
        branch: "CSD",
        year: "3rd Year"
    },
    {
        title: "From Beginner to Building Projects",
        category: "Skills & Learning",
        description: "How small coding steps helped me start building projects.",
        fullStory: "I started with programming basics and gradually applied what I learned in small projects. Practice and patience matter.",
        authorName: "Priya Singh",
        branch: "CST",
        year: "4th Year"
    },
    {
        title: "Building My First Portfolio",
        category: "Skills & Learning",
        description: "My experience creating a portfolio to showcase my work.",
        fullStory: "A portfolio can showcase projects, skills, and learning progress. Start simple and improve it as you build more projects.",
        authorName: "Karan Patel",
        branch: "CSE",
        year: "3rd Year"
    },
    {
        title: "Finding My Place in College",
        category: "College Life",
        description: "What helped me feel more involved in college life.",
        fullStory: "Trying new activities, talking to classmates, and joining communities helped me discover new interests.",
        authorName: "Neha Jain",
        branch: "CST",
        year: "4th Year"
    }
];

async function seedExperiences() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        for (const story of stories) {
            await Experience.updateOne(
                { title: story.title },
                { $setOnInsert: story },
                { upsert: true }
            );
        }

        console.log("Sample stories added successfully!");
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedExperiences();
