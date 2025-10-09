const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Bookmark = require("./models/Bookmark");
const connectDB = require("./db/connect");

// init firebase-admin (require your file which runs initializeApp)
require("./src/firebaseAdmin");

const authenticateFirebase = require("./middleware/authenticateFirebase");


// middleware
app.use(cors());
app.use(express.json());
// All routes require authentication
app.use(authenticateFirebase);

// Get all the bookmark
app.get("/bookmarks", async (req, res) => {
    try {
        const data = await Bookmark.find({ ownerUid: req.user.uid });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a bookmark
app.post("/bookmarks", async (req, res) => {
    try {
        const { title, url } = req.body;
        const created = await Bookmark.create({
            title,
            url,
            ownerUid: req.user.uid,
        });
        res.json(created);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a bookmark
app.delete("/bookmarks/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const ownerUid = req.user.uid;
        await Bookmark.findByIdAndDelete({ _id: id, ownerUid });
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a bookmark
app.patch("/bookmarks/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const ownerUid = req.user.uid;
        const data = req.body;
        const updated = await Bookmark.findOneAndUpdate(
            { _id: id, ownerUid },
            data,
            { new: true }
        );
        if (!updated) {
            return res
                .status(404)
                .json({ error: "Bookmark not found or unauthorized" });
        }
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
