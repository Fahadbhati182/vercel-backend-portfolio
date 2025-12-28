import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Project from "../models/project.model.js";
import Certificate from "../models/certificate.model.js";
import { sendEmail } from "../config/nodemailer.js";

const ADMIN_EMAIL = "fahadbhati3600@gmail.com";
const ADMIN_PASSWORD = "FAHADBHATI948798";

export const uploadProject = async (req, res) => {
  let logoLocalPath;
  let imageLocalPath;
  let uploadedLogo;
  let uploadedImage;

  try {
    const {
      email,
      password,
      title,
      description,
      overview,
      technologies,
      category,
      githubLink,
      liveLink,
    } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email != ADMIN_EMAIL || password != ADMIN_PASSWORD) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    if (
      [title, description, overview, githubLink, liveLink].some(
        (field) => !field
      )
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Accept technologies as array or comma-separated string or JSON string
    let techs = technologies;
    if (techs) {
      if (typeof techs === "string") {
        try {
          // try parse JSON first
          techs = JSON.parse(techs);
        } catch (e) {
          // fallback to comma split
          techs = techs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        }
      }
      if (!Array.isArray(techs)) {
        return res.status(400).json({
          message: "Technologies must be an array or comma-separated string",
        });
      }
    }

    const reqFiles = req.files;

    if (
      !reqFiles ||
      !reqFiles["logo"] ||
      !reqFiles["imageUrl"] ||
      !reqFiles["logo"][0] ||
      !reqFiles["imageUrl"][0]
    ) {
      return res
        .status(400)
        .json({ message: "Logo and imageUrl files are required" });
    }

    logoLocalPath = reqFiles["logo"][0].path;
    imageLocalPath = reqFiles["imageUrl"][0].path;

    // Upload to Cloudinary; set folder to keep things organized
    uploadedLogo = await cloudinary.uploader.upload(logoLocalPath, {
      folder: "portfolio/projects",
    });
    uploadedImage = await cloudinary.uploader.upload(imageLocalPath, {
      folder: "portfolio/projects",
    });

    // Remove local files (non-blocking safety)
    try {
      if (logoLocalPath) await fs.promises.unlink(logoLocalPath);
    } catch (e) {
      console.warn(
        "Failed to remove logo local file:",
        logoLocalPath,
        e.message
      );
    }
    try {
      if (imageLocalPath) await fs.promises.unlink(imageLocalPath);
    } catch (e) {
      console.warn(
        "Failed to remove image local file:",
        imageLocalPath,
        e.message
      );
    }

    const newProject = await Project.create({
      title,
      description,
      overview,
      technologies: techs,
      category,
      githubLink,
      liveLink,
      imageUrl: uploadedImage.secure_url,
      logoUrl: uploadedLogo.secure_url,
    });

    if (!newProject) {
      return res.status(500).json({ message: "Internal Server error" });
    }

    return res.status(201).json({
      success: true,
      message: "Project uploaded successfully",
      data: newProject,
    });
  } catch (error) {
    // If any Cloudinary upload succeeded and the other failed, try to rollback the uploaded resource

    console.error("uploadProject error:", error);
    return res
      .status(500)
      .json({ message: "Error uploading project", error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const allProjects = await Project.find({});

    return res.status(200).json({
      success: true,
      message: "All projects fetched successfully",
      data: allProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching projects",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id } = req.params;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email != ADMIN_EMAIL || password != ADMIN_PASSWORD) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Project id not found",
      });
    }

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting project",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Project.distinct("category");

    return res.status(200).json({
      success: true,
      message: "Unique categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};

export const getInfo = async (req, res) => {
  try {
    const projects = await Project.find({});
    const certificates = await Certificate.find({});

    const info = {
      projects: projects.length,
      certificates: certificates.length,
    };

    return res.status(200).json({
      success: true,
      message: "info fetched successfully",
      data: info,
    });
  } catch (error) {
    console.error("Error fetching informations:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching Fahad's informations",
      error: error.message,
    });
  }
};

export const uploadCertificate = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    const { name, issuer, dateIssued } = req.body;

    if (!name || !dateIssued) {
      return res
        .status(400)
        .json({ message: "Certificate name and dateIssued are required" });
    }

    const filePath = req.file?.path;

    let imageUrl;
    if (filePath) {
      const uploadRes = await cloudinary.uploader.upload(filePath);
      imageUrl = uploadRes.secure_url;
    }

    try {
      if (filePath) await fs.promises.unlink(filePath);
    } catch (e) {
      console.warn("Failed to remove image local file:", filePath, e.message);
    }
    const newCertificate = await Certificate.create({
      name,
      dateIssued: dateIssued,
      issuer: issuer,
      url: imageUrl,
    });
    return res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      newCertificate,
    });
  } catch (error) {
    console.error("uploadCertificate error:", error);
    return res
      .status(500)
      .json({ message: "Error uploading certificate", error: error.message });
  }
};

export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({});
    return res.status(200).json({
      success: true,
      message: "certificates  fetched successfully",
      data: certificates,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};

export const deleteCertificates = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email != ADMIN_EMAIL || password != ADMIN_PASSWORD) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Project id not found",
      });
    }

    const deleted = await Certificate.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting  Certificate",
      error: error.message,
    });
  }
};

export const sendMessageToAdmin = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    sendEmail(name, email, subject, message);
    return res.status(200).json({
      success: true,
      message: "Thanks! Your message has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while sending   message",
      error: error.message,
    });
  }
};
