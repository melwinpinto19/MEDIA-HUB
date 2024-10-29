import videoModel from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import userModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";

const getVideosSearchResults = asyncHandler(async (req, res, next) => {
  const { query } = req.body;

  if (!query) throw new ApiError(400, "Query does not exists");

  // fetching videos based on query :
  const videos = await videoModel.find({
    $or: [
      { title: { $regex: query, $options: "i" } }, // Case-insensitive regex search for title
      { description: { $regex: query, $options: "i" } }, // Case-insensitive regex search for description
    ],
  });

  // fetching the matched users:
  const users = await userModel.find({
    username: { $regex: query, $options: "i" },
  });

  // fetching the video titles & usernames:
  const videoTitles = videos.map((video) => video.title);
  const usernames = users.map((each) => each.username);

  res.status(200).json({ data: [...videoTitles, ...usernames] });
});

const publishVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const video = await videoModel.findById(id); // get video by id

  if (!video) throw new ApiError(404, "Video not found");
  if (video.isPublished) throw new ApiError(400, "Video already published");
  video.isPublished = true;
  await video.save();
  res.status(200).json({ data: video });
});

const createVideo = asyncHandler(async (req, res, next) => {
  const { title, description, isPublished } = req.body;

  // check for data existence :
  if (!title || !description)
    throw new ApiError(400, "Missing required fields");

  // video file upload :
  const localVideoFilePath = req.files?.videoFile[0]?.path;

  if (!localVideoFilePath) throw new ApiError(400, "Video file is required");

  const cloudinaryVideo = await uploadOnCloudinary(localVideoFilePath);

  if (!cloudinaryVideo) throw new ApiError(500, "Error in uploading video");

  // thumbnail upload :
  const localThumbnailPath = req.files?.thumbnail[0]?.path;

  if (!localThumbnailPath) throw new ApiError(400, "Video file is required");

  const cloudinaryThumbnail = await uploadOnCloudinary(localThumbnailPath);

  if (!cloudinaryThumbnail) throw new ApiError(500, "Error in uploading video");

  const video = await videoModel.create({
    title,
    description,
    videoFile: cloudinaryVideo.url,
    thumbnail: cloudinaryThumbnail.url,
    isPublished: isPublished ? true : false,
    owner: req.user._id,
    duration: cloudinaryVideo.duration,
  });

  res.status(201).json({ data: video, msg: "Video uploaded sucessfully" });
});

const getAllVideos = asyncHandler(async (req, res, next) => {
  const videos = await videoModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerData",
      },
    },
    {
      $addFields: {
        ownerData: {
          $arrayElemAt: ["$ownerData", 0],
        },
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "subscriber",
        as: "subscriptions",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        subscriptions: {
          $size: "$subscriptions",
        },
        subscribers: {
          $size: "$subscribers",
        },
      },
    },
    {
      $project: {
        ownerData: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        isPublished: 1,
        subscriptions: 1,
        subscribers: 1,
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        views: 1,
      },
    },
  ]);

  res.status(200).json({ data: videos });
});

const getSearchedVideos = asyncHandler(async (req, res, next) => {
  const { query } = req.body;
  console.log(query);

  const videos = await videoModel.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } }, // Case-insensitive regex search for title
          { description: { $regex: query, $options: "i" } }, // Case-insensitive regex search for description
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerData",
      },
    },
    {
      $addFields: {
        ownerData: {
          $arrayElemAt: ["$ownerData", 0],
        },
      },
    },

    {
      $project: {
        ownerData: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        isPublished: 1,
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  res.status(200).json({ data: videos });
});

const getVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  if (!id) throw new ApiError(401, "Video id is required");

  const video = await videoModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerData",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "subscriber",
        as: "subscriptions",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        ownerData: {
          $arrayElemAt: ["$ownerData", 0],
        },
        subscriptions: {
          $size: "$subscriptions",
        },
        subscribers: {
          $size: "$subscribers",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
        likes: {
          $size: "$likes",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [req.user?._id, "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        ownerData: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        isPublished: 1,
        _id: 1,
        subscriptions: 1,
        subscribers: 1,
        isSubscribed: 1,
        createdAt: 1,
        updatedAt: 1,
        views: 1,
        likes: 1,
        isLiked: 1,
      },
    },
  ]);

  if (!video.length) throw new ApiError(404, "Video not found");

  res.status(200).json(video[0]);
});

const addViews = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log(id);

  if (!id) throw new ApiError(401, "Video id is required");

  const video = await videoModel.findOneAndUpdate(
    { _id: id },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) throw new ApiError(404, "Video not found");

  // add watch history:
  if (!req.user.watchHistory.includes(id)) req.user.watchHistory.push(id);

  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({ data: "success" });
});

const editVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(401, "Video id is required");

  console.log(req.body);
  const {
    editVideo,
    editThumbnail,
    title,
    description,
    publish: isPublished,
  } = req.body;

  const cloudinaryVideoPath = "",
    cloudinaryThumbnailPath = "";

  if (editVideo) {
    const localPath = req.files?.videoFile[0]?.path;

    if (!localPath) throw new ApiError(400, "Video file is required");

    cloudinaryVideoPath = await uploadOnCloudinary(localPath);
  }

  if (editThumbnail) {
    const localPath = req.files?.thumbnail[0]?.path;

    if (!localPath) throw new ApiError(400, "thumbnail file is required");

    cloudinaryThumbnailPath = await uploadOnCloudinary(localPath);
  }

  const getVideo = await videoModel.findOne({ _id: id });

  const editedVideo = await videoModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title: title || getVideo?.title,
        description: description || getVideo?.description,
        isPublished: isPublished || getVideo?.isPublished,
        videoFile: cloudinaryVideoPath?.url || getVideo?.videoFile,
        thumbnail: cloudinaryThumbnailPath?.url || getVideo?.thumbnail,
      },
    },
    { new: true }
  );

  res.status(200).json({ data: editedVideo });
});

export {
  getVideosSearchResults,
  createVideo,
  getAllVideos,
  publishVideo,
  getSearchedVideos,
  getVideo,
  addViews,
  editVideo,
};
