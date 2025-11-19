import mongoose, { Schema } from "mongoose";


const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  overview: { type: String, required: true },
  technologies: [{ type: String, required: true }],
  category: { type: String, required: true },
  githubLink: { type: String, required: true },
  liveLink: { type: String, required: true },
  imageUrl: { type: String, required: true },
  logoUrl: { type: String, required: true },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
