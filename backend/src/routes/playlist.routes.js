import { Router } from "express";
import verifyJwt from "../middlewares/logout.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPlaylist,
  getAllPlaylists,
  deletePlaylist,
  getPlaylist,
  addVideoToPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

// routes :

router
  .route("/create-playlist")
  .post(
    verifyJwt,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    createPlaylist
  );

router.get("/getAllPlaylists", verifyJwt, getAllPlaylists);

router.route("/delete-playlist").post(verifyJwt, deletePlaylist);

router.get("/playlists/:id", verifyJwt, getPlaylist);

router.post("/add-video", verifyJwt, addVideoToPlaylist);

export default router;
