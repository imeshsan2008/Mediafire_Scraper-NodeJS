const express = require("express");
const cors = require("cors");
const chromium = require("chrome-aws-lambda");

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

app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.get("/scrape", async (req, res) => {
  try {
    const targetUrl = req.query.target_url;

    if (!targetUrl) return res.status(400).json({ message: "Invalid URL" });

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Navigate to the target URL
    await page.goto(targetUrl, { waitUntil: "networkidle2" });

    // Extract the title of the page
    const title = await page.title();

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
