const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();

// Signup route handler
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User already exists"
            });
        }

        // Secured password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }
        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Return success response
        return res.status(200).json({
            success: true,
            msg: "User created successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'User registration failed, please try again later'
        });
    }
};

// Login route handler
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: 'Please provide both email and password'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'User is not registered'
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // Password matches, generate JWT token
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "3d" // Token expires in 3 days
            });

            const userResponse = user.toObject();
            userResponse.password = undefined;
            userResponse.token = token;

            // Set cookie with token
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days in milliseconds
                httpOnly: true // Cookie cannot be accessed via client-side scripts
            };
            res.cookie("token", token, options);

            // Respond with success
            return res.status(200).json({
                success: true,
                token,
                msg: 'User logged in successfully'
            });
        } else {
            // Password does not match
            return res.status(403).json({
                success: false,
                msg: 'Invalid password'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Login failed, please try again later"
        });
    }
};
