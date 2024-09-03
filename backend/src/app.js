import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/user.routes.js";

const app = express();

// it provides the restriction for requests of URL
app.use(cors({ origin: process.env.ORIGIN }));

// Controls the maximum request body size (post request)
app.use(express.json({ limit: "16kb" }));

// for get request encoding
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// for static assets :
app.use(express.static("public"));

app.use(cookieParser());

// specifying routers:
app.use("/api/v1/users", router);
// /api/v1/users is the main route and the routers router like /register /login are appneded at the back

export default app;