import express from "express";
import isAuth, { isAdmin } from "../middleware/auth.middleware.js";
import {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

const router: express.Router = express.Router();

router.get("/", isAuth, getPackages);
router.post("/", isAuth, isAdmin, createPackage);
router.patch("/:id", isAuth, isAdmin, updatePackage);
router.delete("/:id", isAuth, isAdmin, deletePackage);

export default router;
