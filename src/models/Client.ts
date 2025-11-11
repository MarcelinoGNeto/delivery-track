import mongoose, { Schema, models } from "mongoose";

const ClientSchema = new Schema(
  {
    name: { type: String, required: true },
    cpf: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

export default models.Client || mongoose.model("Client", ClientSchema);
