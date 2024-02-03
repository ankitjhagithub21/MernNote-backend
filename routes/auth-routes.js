const express = require('express');
const authRoutes = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');





authRoutes.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email Already Exist"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({
            success: true,
            message: "Registration Successful"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        console.log(error);
    }
});

authRoutes.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const isExist = await User.findOne({ email });
        if (!isExist) {
            return res.status(404).json({
                success: false,
                message: "Email not exist."
            });
        }
        const isMatch = await bcrypt.compare(password, isExist.password); // Await the bcrypt.compare function

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong Password"
            });
        }
        const token = jwt.sign({ id: isExist._id, username: isExist.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const user = {
            id:isExist._id,
            username:isExist.username
        }
        res.status(200).json({
            success: true,
            message: "Login Successful.",
            user,
            token,

        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


authRoutes.get("/user", verifyToken, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



module.exports = authRoutes;
