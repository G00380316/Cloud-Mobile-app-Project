import axios from "axios";
import dotenv from "dotenv";
import express from "express";

//Webscraping
import * as cheerio from "cheerio";

import { connectMongoDB } from "../lib/mongo.js";
import Destination from "../models/destinations.js";

const router = express.Router();

dotenv.config();

router.get("/", (req, res) => {
    res.send(`Hello, this is the Top Destination Route`);
});

router.post("/webscrape", async (req, res) => { // http://localhost:4000/top/webscrape
    try {
        // Fetched the HTML of the page I want to scrape
        const { data } = await axios.get(process.env.SCRAPE_URL);

        // Load the HTML I fetched in the previous line
        const $ = cheerio.load(data);

        let topDestinations = [];

        $("h2").each(async (idx, el) => {

        const destination = { image: "", title: "", description: "" };

        destination.title = $(el).text().trim();

        const $image = $(el).next().children("p img");
        //console.log($image);

        if ($image.length > 0) {
            destination.image = $image.attr("src");
        }

        let $nextElement = $(el).next();
        //console.log($nextElement);

        while ($nextElement.length > 0 && !$nextElement.is("ul")) {
            destination.description += $nextElement.text().trim();
            $nextElement = $nextElement.next();
        }

        destination.description = destination.description;

            topDestinations.push(destination);
            console.log(destination.image)
            await Destination.create({image: destination.image, title: destination.title, description: destination.description})
        });

        //console.log(topDestinations);

        res.status(201).json({
            response: topDestinations,
            message: "Scraping completed successfully!",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/topdes", async (req, res) => {
    try {

        connectMongoDB();

        const destinations = await Destination.find();

        res.status(200).json(destinations);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
})

//  destination.description = $(el).find("p").text().trim();
//destination.description = $(el).children("p").text();

export default router;
