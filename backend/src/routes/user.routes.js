import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  deleteUser,
  getUserProfile,
  getUserWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/logout.middleware.js";

// creating an router :
const router = Router();

// specifying routes :
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes :
router.route("/logout").post(verifyJwt, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/get-current-user").post(verifyJwt, getCurrentUser);

router.route("/change-password").post(verifyJwt, changeUserPassword);

router.route("/delete-account").delete(verifyJwt, deleteUser);

router.route("/get-user-profile").post(verifyJwt, getUserProfile);

router
  .route("/update-avatar")
  .post(
    verifyJwt,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    updateAvatar
  );

router
  .route("/update-cover-image")
  .post(
    verifyJwt,
    upload.fields([{ name: "coverImage", maxCount: 1 }]),
    updateCoverImage
  );

router.route("/get-user-watch-history").get(verifyJwt, getUserWatchHistory);

export default router;
