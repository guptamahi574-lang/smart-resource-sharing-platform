const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        branch: {
            type: String,
            required: true
        },

        year: {
            type: Number,
            required: true
        },
         
        about: {
    type: String,
    default: "",
    maxlength: 500
},

skills: {
    type: [String],
    default: []
},
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;