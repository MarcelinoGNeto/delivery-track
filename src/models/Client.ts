import mongoose, { Schema, Document, models } from "mongoose";

export interface IClient extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  address?: string;
}

const ClientSchema = new Schema<IClient>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
  },
  { timestamps: true }
);

const Client = models.Client || mongoose.model<IClient>("Client", ClientSchema);
export default Client;
