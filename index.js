const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Enable CORS with specific options
app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.get("/scrape", async (req, res) => {
  try {
    const targetUrl = req.query.target_url;

    if (!targetUrl) return res.status(400).json({ message: "Invalid URL" });

    const response = await axios.get(targetUrl);

    const $ = cheerio.load(response.data);

    const link = $(".popsok").attr("href");

    return res.status(200).json({ mesage: "success", link });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error" });
  }
});

app.get("*", async (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.listen(5000, () => {
  console.log("SERVER IS RUNNING AT PORT 5000");
});
