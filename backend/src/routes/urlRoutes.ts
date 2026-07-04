import express from "express";
import {
  createShortUrl,
  redirectUrl,
  verifyPassword,
  getAnalytics,
  getMyLinks,
    deleteLink,
} from "../controllers/urlController";
import { authenticateUser } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/create", authenticateUser, createShortUrl);
router.get("/my-links", authenticateUser, getMyLinks);
router.post("/verify-password", verifyPassword);
router.get("/:id/analytics", authenticateUser, getAnalytics);
router.get("/:shortCode", redirectUrl);
router.delete("/:id", authenticateUser, deleteLink);

export default router;