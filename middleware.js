import jwt from "jsonwebtoken";
import { tokenBlacklist } from "./routes/auth.js";

export default function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    //console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

        
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, "your-secret-key", (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.status(403).json({ error: "Forbidden" });
        }

        console.log("Token verified successfully. Decoded payload:", decoded);
        req.user = decoded;
        next();
    });
}


//To make request with token just copy the token you get from sign in and add it to the header
// with the key: `authorization` and Value: `Bearer <token>` or just use the autorisation section
// in Postman and put the token in the Bearer section
