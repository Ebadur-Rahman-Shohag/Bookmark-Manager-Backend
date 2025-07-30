const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Bookmark = require("./models/Bookmark");
const connectDB = require("./db/connect");

// middleware
app.use(cors());
app.use(express.json());

// Get all the bookmark
app.get("/bookmarks", async (req, res) => {
    try {
        const data = await Bookmark.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a bookmark
app.post("/bookmarks", async (req, res) => {
    try {
        const data = req.body;
        const created = await Bookmark.create(data);
        res.json(created);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a bookmark
app.delete("/bookmarks/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await Bookmark.findByIdAndDelete(id);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a bookmark
app.patch("/bookmarks/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updated = await Bookmark.findByIdAndUpdate(id, data, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const url = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
const start = async (url) => {
    try {
        await connectDB(url);
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start(url);
