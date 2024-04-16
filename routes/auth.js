import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "../lib/mongo.js";
import User from "../models/user.js";
import authenticateToken from "../middleware.js";

const router = express.Router();

export let tokenBlacklist = [];

router.post("/logout", authenticateToken, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        tokenBlacklist.push(token);

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = await req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();

        const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/userCheck", async (req, res) => {
    try {
        await connectMongoDB();
        const { email } = req.body;

        const user = await User.findOne({ email }).select("_id");

        console.log("User has been checked...user: ", user);

        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        await connectMongoDB();
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
        return res
            .status(401)
            .json({ error: "Authentication failed, User not found" });
        }

        console.log("User has been checked...user: ", user);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
        return res.status(401).json({ error: "Authentication failed" });
        }

        console.log("User password has been checked...password: ", passwordMatch);

        const token = jwt.sign({ id: user._id }, "your-secret-key", {
        expiresIn: "1h",
        });

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;
