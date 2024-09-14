import { Router } from "express";
import verifyJwt from "../middlewares/logout.middleware.js";
import {
  addSubscription,
  removeSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/add-subscription").post(verifyJwt, addSubscription);

router.route("/remove-subscription").post(verifyJwt, removeSubscription);

export default router;
