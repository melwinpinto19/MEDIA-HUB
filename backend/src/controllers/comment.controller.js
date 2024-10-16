import mongoose from "mongoose";
import commentModel from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(401, "Video id is required");

  const comments = await commentModel
    .find({ video: videoId })
    .populate("owner");

  res.status(200).json({ data: comments });
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError("Video Id is required");

  const comment = await commentModel.create({
    content: req.body.content,
    video: videoId,
    owner: req.user._id,
  });

  if (!comment) throw new ApiError("DB ERROR: On adding comment");

  res.status(200).json(new ApiResponse(200, "Comment was successful", comment));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) throw new ApiError(401, "Comment id is required");

  const comment = await commentModel.findOneAndUpdate(
    { _id: commentId, owner: req.user._id },
    { content: req.body.content },
    { new: true }
  );
  if (!comment) throw new ApiError(401, "Comment not found");

  res.status(200).json({ data: comment });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) throw new ApiError(401, "Comment id is required");

  const comment = await commentModel.findOneAndDelete({
    _id: videoId,
    owner: req.user._id,
  });
  if (!comment) throw new ApiError(401, "Comment not found");
  res.status(200).json({ data: "success" });
});

export { getVideoComments, addComment, updateComment, deleteComment };
