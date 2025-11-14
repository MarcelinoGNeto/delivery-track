import mongoose, { Schema, models, Document } from "mongoose";

export interface IProduct extends Document{
  userId?: mongoose.Types.ObjectId;
  image?: string;
  name: string;
  description: string;
  price: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    image: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
