const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const Bookmark = require("./models/Bookmark");
const connectDB = require("./db/connect");

// middleware
app.use(cors());
app.use(express.json());

// Get all the bookmark
app.get("/bookmarks", async (req, res) => {
    const data = await Bookmark.find();
    res.json(data);
});

// Create a bookmark
app.post("/bookmarks", async (req, res) => {
    const data = await req.body;
    await Bookmark.create(data);
    res.json(data);
});

// Delete a bookmark
app.delete("/bookmarks/:id", async (req, res) => {
    const id = req.params.id;
    await Bookmark.findByIdAndDelete(id);
    res.json({ id });
})

// Update a bookmark
app.update("/bookmarks/:id", async (req, res) => {
    const id = req.params.id;
    const data = await req.body;
    await Bookmark.findByIdAndUpdate(id, data);
    res.json(data);
})

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
