import express from "express";
import upload from "../config/multer.js";
import {
  deleteCertificates,
  deleteProject,
  getAllCategories,
  getAllCertificates,
  getAllProjects,
  getInfo,
  sendMessageToAdmin,
  uploadCertificate,
  uploadProject,
} from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.post(
  "/upload-project",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "imageUrl", maxCount: 1 },
  ]),
  uploadProject
);

adminRouter.post(
  "/upload-certificates",
  upload.single("image"),
  uploadCertificate
);
adminRouter.get("/get-all-projects", getAllProjects);
adminRouter.post("/delete-project/:id", deleteProject);
adminRouter.get("/get-info", getInfo);
adminRouter.get("/get-category", getAllCategories);
adminRouter.get("/get-all-certificates", getAllCertificates);
adminRouter.post("/delete-certificate/:id", deleteCertificates);
adminRouter.post("/send-message", sendMessageToAdmin);

export default adminRouter;
