import dotenv from 'dotenv';
import express from 'express';
import OpenAI from "openai";
import { connectMongoDB } from '../lib/mongo.js';
import authenticateToken from "../middleware.js";
import Prompt from '../models/prompt.js';
import Response from '../models/response.js';

    dotenv.config();

    const router = express.Router();
    const openai = new OpenAI();
    

    router.get('/', (req, res) => {
        res.send(`Hello, this is the Ai Route make sure your key is in the .env`);
    })

    router.post('/create', async (req, res) => { // http://localhost:4000/ai/create
        
        const { question } = req.body;
            
        const prompt = `Answer this question only if it's relates to a country or
                        place and give facts about that country or place including
                        metrics that would be beneficial for a tourist and someone
                        in search of an holiday destination:
                        ` + question;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100,
            });


            await connectMongoDB();

            const answer = response.choices[0];

            res.status(201).json({ response: answer });
        } catch (error) {
            console.error('Error calling OpenAI ChatGPT:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

    router.post("/create/protected", authenticateToken ,async (req, res) => { // http://localhost:4000/ai/create/protected
        const { question } = req.body;

        const prompt =
            `Answer this question only if it's relates to a country or
                            place and give facts about that country or place including
                            metrics that would be beneficial for a tourist and someone
                            in search of an holiday destination:
                            ` + question;
        
        await Prompt.create({ user:  req.user.id ,  prompt });

        try {
            const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
            });

            await connectMongoDB();

            const answer = response.choices[0];

            await Response.create({ user: req.user.id, prompt, answer: answer.message.content});

            res.status(201).json({ response: answer });
        } catch (error) {
            console.error("Error calling OpenAI ChatGPT:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.get('/get/response/byUser',authenticateToken, async (req, res) => { // http://localhost:4000/ai/get/response/byuser
        const user = req.user.id;

        try {
            await connectMongoDB();

            const responses = await Response.find({ user });

            res.status(200).json(responses);
        } catch (error) {
            //console.log(error);
            res.status(500).json(error);
        }
    })

    export default router;