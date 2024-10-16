import {
  addComment,
  deleteComment,
  updateComment,
  getVideoComments,
} from "../controllers/comment.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/logout.middleware.js";

const router = Router();

router.post("/add-comment/:videoId", verifyJWT, addComment);

router.delete("/delete-comment/:videoId", verifyJWT, deleteComment);

router.patch("/update-comment/:commentId", verifyJWT, updateComment);

router.get("/get-video-comments/:videoId", verifyJWT, getVideoComments);

export default router;
