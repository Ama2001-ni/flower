import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ENV_VARS } from "./constant";
import { User } from "./models/user.model";
import Flowers from "./models/flower.model";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use('/temp', express.static(path.join(__dirname, 'temp')));
app.use(
  cors({
    origin: ENV_VARS.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

mongoose.connect(ENV_VARS.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'temp'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });



app.post("/login", async (req, res) => {
  // get data from req.body
  const { password, username } = req.body
  console.log(password, username)
  try {
    // username or email
    if (!username) {
      return res
        .status(400)
        .json({ message: "username  is required" });
    }

    // find the user
    const userDB = await User.findOne({
      $or: [{ username }]
    })
    if (!userDB) {
      return res
        .status(400)
        .json({ message: "user does not exist" });
    }

    if (password !== userDB.password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const loggedInUser = await User.findById(userDB._id).select(
      "-password"
    );
    res.status(200).json({ user: loggedInUser, login: true, message: "User logged In Successfully" });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', login: false, error: err.message });
  }
})

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  // validation - not empty
  if (
    [username, email, password].some((field) => field?.trim() === "")
  ) {
    return res
      .status(400)
      .json({ message: "All fields are Required" });
  }

  // check if user already exists: username,email
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    return res
      .status(400)
      .json({ message: "User already exist" });
  }

  // create user object - create entry in db
  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password  field from response
  const createdUser = await User.findById(user._id).select(
    "-password"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json({ message: "Something went wrong while registering the user" });
  }

  return res
    .status(201)
    .json({ user: createdUser, register: true, message: "User registered successfully" });
})

app.post('/add-flower', upload.single('image'), async (req, res) => {
  try {
    const { title, price, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const encodedFilename = encodeURIComponent(req.file.filename);
    const imageUrl = `http://localhost:8000/temp/${encodedFilename}`;

    // Create new flower
    const newflower = new Flowers({
      image: imageUrl,
      contentType: req.file.mimetype,
      title,
      price,
      description,
    });
    await newflower.save();

    res.status(200).json({ message: 'Flower added successfully', Flower: newflower });
  } catch (err) {
    res.status(500).json({ message: 'Error adding Flower', error: err.message });
  }
});

app.get("/get-all-flowers", async (req, res) => {
  const Flower = await Flowers.find();
  return res
    .status(200)
    .json({ data: Flower, status: true, });
})

app.post('/get-all-purchased-flowers', async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user by userId and populate their boughtFlower
    const user = await User.findById(userId).populate('boughtFlowers');
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the Flower the user has bought
    res.json({ message: 'User Flower retrieved successfully', Flowers: user.boughtFlowers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

app.post('/buy-flower', async (req, res) => {
  const { userId, flowerIds } = req.body; // Allow `flowerIds` to be an array
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate that flowerIds is an array
    if (!Array.isArray(flowerIds) || flowerIds.length === 0) {
      return res.status(400).json({ message: 'Invalid flowerIds. Must be a non-empty array.' });
    }

    // Find all flowers matching the provided IDs
    const flowers = await Flowers.find({ _id: { $in: flowerIds } });

    // Ensure all flower IDs exist
    const validFlowerIds = flowers.map(flower => flower._id.toString());
    const invalidFlowerIds = flowerIds.filter(id => !validFlowerIds.includes(id));
    if (invalidFlowerIds.length > 0) {
      return res.status(404).json({ message: 'Some flowers not found', invalidFlowerIds });
    }

    // Filter out already bought flowers
    const newFlowerIds = flowerIds.filter(id => !user.boughtFlowers.includes(id));
    if (newFlowerIds.length === 0) {
      return res.status(400).json({ message: 'All these flowers have already been bought by the user' });
    }

    // Add new flowers to the user's bought flowers
    user.boughtFlowers.push(...newFlowerIds);

    // Save the updated user document
    await user.save();

    // Return the updated user information along with the bought flowers
    const updatedUser = await User.findById(userId).populate('boughtFlowers');
    res.json({
      message: 'Flowers bought successfully',
      user: updatedUser,
      newFlowerIds
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(ENV_VARS.PORT, () => {
  console.log(`Server is running on http://localhost:${ENV_VARS.PORT}`);
});

