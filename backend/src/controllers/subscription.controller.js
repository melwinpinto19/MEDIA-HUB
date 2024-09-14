import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import subscription from "../models/subscription.model.js";

const addSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.body;

  if (!channelId) throw new ApiError(401, "Channel id is required");

  const response = await subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (!response) throw new ApiError(401, "DB ERROR: On adding subscription");

  res
    .status(200)
    .json(new ApiResponse(200, "Subscription was sucessful", response));
});

const removeSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.body;

  if (!channelId) throw new ApiError(401, "Channel id is required");

  const response = await subscription.findOneAndDelete({
    subscriber: req.user?._id,
    channel: channelId,
  });

  if (!response) throw new ApiError(401, "DB ERROR: On deleting subscription");

  res
    .status(200)
    .json(new ApiResponse(200, "Subscription was remove sucessfully"));
});

export { addSubscription, removeSubscription };
