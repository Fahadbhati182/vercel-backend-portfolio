import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  dateIssued: { type: Date, required: true },
  issuer: { type: String },
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
