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

// Start server
const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
