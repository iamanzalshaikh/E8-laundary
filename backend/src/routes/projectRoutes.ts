import express from "express";
import { 
  getMyProjects, 
  updateProjectStatus, 
  getProjectById 
} from "../controllers/projectController.js";
import isAuth, { isAdmin } from "../middleware/auth.middleware.js";

const router: express.Router = express.Router();

router.get("/", isAuth, getMyProjects);
router.get("/:id", isAuth, getProjectById);
router.patch("/:id/status", isAuth, isAdmin, updateProjectStatus);

export default router;
