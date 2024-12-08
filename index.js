const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:8000",
  "https://tiktok-video-downloader-api.vercel.app/",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
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

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the target URL
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    // Wait for the page to load completely (you can wait for specific elements if needed)
    await page.waitForSelector("title"); // Example: wait for the title element

    // Extract the title of the page
    const title = await page.title();

    // Close the browser
    await browser.close();

    return res.status(200).json({ message: "success", title });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching the webpage" });
  }
});

app.get("*", async (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.listen(5000, () => {
  console.log("SERVER IS RUNNING AT PORT 5000");
});
