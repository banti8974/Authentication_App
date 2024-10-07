const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware
exports.auth = (req, res, next) => {
    try {
        // Extract JWT token from the header, body, or cookies
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: 'Token is missing',
            });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                msg: 'Token is invalid',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Something went wrong while verifying the token',
        });
    }
};

// Authorization middleware for Student role
exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({
                success: false,
                msg: 'This is a protected route for Students',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'User role is not matching',
        });
    }
};

// Authorization middleware for Admin role
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                msg: 'This is a protected route for Admins',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'User role is not matching',
        });
    }
};
