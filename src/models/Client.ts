import mongoose, { Schema, Document, models } from "mongoose";

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true }
);

const Client = models.Client || mongoose.model<IClient>("Client", ClientSchema);
export default Client;
