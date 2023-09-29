import express from "express";
import { Deta } from "deta";
import path from "path";
import multer from "multer";
import { spaceFetch, spaceHole, spacePush } from "./controllers/deta.js";
import { configDotenv } from "dotenv";

const app = express();
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));
const port = process.env.PORT || 8080;
// Configure Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

//environment variables
configDotenv({
  path: "./config.env",
});

// Initialize with a Project Key
const deta = Deta(process.env.DETA_PROJECT_KEY);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "All Systems Normal" });
});

app.get(
  "/fetch/:surfdrive/:surffile",
  (req, res, next) => {
    req.deta = deta;
    next();
  },
  spaceFetch
);

app.post(
  "/upload/:surfdrive",
  (req, res, next) => {
    req.deta = deta;
    next();
  },
  upload.single("image"),
  spacePush
);

app.get(
  "/delete/:surfdrive/:surffile",
  (req, res, next) => {
    req.deta = deta;
    next();
  },
  spaceHole
);

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`Server running on ${port}`);
});
