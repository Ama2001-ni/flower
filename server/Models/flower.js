import mongoose from "mongoose";
const flowerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

const Flowers = mongoose.model("Flower", flowerSchema);

export default Flowers;
