import authenticateToken from "../middleware.js";
import express from "express";

    const router = express.Router();

    router.get("/protected-route", authenticateToken, (req, res) => {

        // This code will be executed only if the token is verified
        let specialMessage = `This is the user ID that accessed the route` + " " + req.user.id;

        res.json({ specialMessage, message: "You are authorized!" });
    });

    export default router;