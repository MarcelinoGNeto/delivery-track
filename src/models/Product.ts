import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    image: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Product || mongoose.model("Product", ProductSchema);
