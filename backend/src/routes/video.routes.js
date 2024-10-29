import { Router } from "express";
import {
  getVideosSearchResults,
  createVideo,
  getAllVideos,
  getSearchedVideos,
  getVideo,
  addViews,
  editVideo,
} from "../controllers/video.controller.js";
import verifyJwt from "../middlewares/logout.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/search").post(verifyJwt, getVideosSearchResults);

router.route("/create-video").post(
  verifyJwt,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

router.route("/getAllVideos").get(verifyJwt, getAllVideos);

router.route("/getSearchedVideos").post(verifyJwt, getSearchedVideos);

router.route("/getVideo").post(verifyJwt, getVideo);

router.route("/add-views").post(verifyJwt, addViews);

router.route("/edit-video/:id").post(verifyJwt, editVideo);

export default router;
