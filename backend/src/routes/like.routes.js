import { Router } from "express";
import verifyJwt from "../middlewares/logout.middleware.js";
import {
  addVideoLike,
  removeVideoLike,
} from "../controllers/like.controller.js";

const router = Router();

router.route("/add-video-like").post(verifyJwt, addVideoLike);
router.route("/remove-video-like").post(verifyJwt, removeVideoLike);

export default router;
