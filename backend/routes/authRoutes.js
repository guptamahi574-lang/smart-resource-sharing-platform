const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, branch, year, password } = req.body;

        // Check required fields
        if (!name || !email || !branch || !year || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            branch,
            year,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                branch: user.branch,
                year: user.year
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                branch: user.branch,
                year: user.year
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
});

router.put("/profile/:id", async (req, res) => {
    try {
        const { name, email, branch, year, about, skills } = req.body;

        if (!name || !email || !branch || !year) {
            return res.status(400).json({
                success: false,
                message: "Name, email, branch and year are required."
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                branch: branch.trim(),
                year: Number(year),
                about: about || "",
                skills: Array.isArray(skills) ? skills : []
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                branch: updatedUser.branch,
                year: updatedUser.year,
                about: updatedUser.about,
                skills: updatedUser.skills
            }
        });

    } catch (error) {
        console.error("Profile update error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered."
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while updating profile."
        });
    }
});

module.exports = router;