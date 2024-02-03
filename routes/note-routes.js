const express = require('express');
const Note = require('../models/note');
const verifyToken = require('../middlewares/verifyToken');
const noteRoutes = express.Router()


noteRoutes.post("/add", verifyToken, async (req, res) => {
    try {
        const { title,desc } = req.body;

        // Access user ID from the middleware
        const userId = req.user.id;

        const note = new Note({
            title,
            desc,
            user:userId, // Associate the product with the user
        });

        await note.save();
        res.status(201).json({
            success: true,
            message: "Note added.",
            note
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
noteRoutes.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;

        // Assuming you have a Mongoose model named "Note"
        const note = await Note.findByIdAndDelete(noteId);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found.",
            });
        }
        const updatedNotes = await Note.find({ user: userId });

        res.status(200).json({
            success: true,
            message: "Note deleted.",
            notes:updatedNotes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
noteRoutes.put("/update/:id", verifyToken, async (req, res) => {
    try {
        const { title, desc } = req.body;
        const noteId = req.params.id;
        const userId = req.user.id
        // Validate request body
        if (!title || !desc) {
            return res.status(400).json({
                success: false,
                message: "Title and desc are required.",
            });
        }

        // Assuming you have a Mongoose model named "Note"
        const note = await Note.findByIdAndUpdate(
            noteId,
            { title, desc },
            { new: true } 
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found.",
            });
        }
        const updatedNotes = await Note.find({ user: userId });

        res.status(200).json({
            success: true,
            message: "Note updated.",
            notes:updatedNotes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

noteRoutes.get("/", verifyToken, async (req, res) => {
    try {
        // Access user ID from the middleware
        const userId = req.user.id;

        // Fetch products associated with the user
        const userNotes = await Note.find({ user: userId });

        res.status(200).json({
            success: true,
            notes: userNotes,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = noteRoutes