const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensures email is unique in the database
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Student", "Visitor"],
        default: "Student", // Default role if none is provided
    }
});

module.exports = mongoose.model("User", userSchema); // Ensure model name starts with uppercase
