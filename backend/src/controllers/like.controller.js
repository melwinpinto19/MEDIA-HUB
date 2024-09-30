import likeModel from "../models/like.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addVideoLike = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) throw new ApiError(401, "Video id is required");

  const like = await likeModel.create({
    video: id,
    likedBy: req.user._id,
  });

  res.status(200).json(new ApiResponse(200, "Like was successful", like));
});

const removeVideoLike = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) throw new ApiError(401, "Video id is required");

  const like = await likeModel.findOneAndDelete({
    video: id, // video id
    likedBy: req.user._id, // user id
  });

  res.status(200).json(new ApiResponse(200, "Like was successful", like));
});

export { addVideoLike, removeVideoLike };
