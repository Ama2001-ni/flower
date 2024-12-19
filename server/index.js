import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import * as ENV from "./config.js"; // Adjust the import as per your file structure
import { User } from "./Models/UserModel.js";
import Flower from "./Models/flower.js"; // Ensure Flower model is correctly imported

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=PostITCluster`;
mongoose
  .connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "temp"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Register User
app.post("/registerUser", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ user, message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration." });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    res.status(200).json({
      user: { ...user.toObject(), password: undefined },
      message: "Login successful.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Flower
app.post("/add-flower", upload.single("image"), async (req, res) => {
  try {
    const { title, price, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const encodedFilename = encodeURIComponent(req.file.filename);
    const imageUrl = `http://localhost:${ENV_VARS.PORT}/temp/${encodedFilename}`;

    const newFlower = new Flower({
      image: imageUrl,
      contentType: req.file.mimetype,
      title,
      price,
      description,
    });
    await newFlower.save();

    res
      .status(200)
      .json({ message: "Flower added successfully", flower: newFlower });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding flower", error: err.message });
  }
});

// Get all Flowers
app.get("/get-all-flowers", async (req, res) => {
  try {
    const flowers = await Flower.find();
    res.status(200).json({ data: flowers, status: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching flowers." });
  }
});

// Start server
const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
