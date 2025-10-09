const admin = require("../src/firebaseAdmin");

const authenticateFirebase = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No or invalid authorization header" });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Unauthorized" });
    }
};

module.exports = authenticateFirebase;