import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import playlistModel from "../models/playlist.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    throw new ApiError(401, "Playlist name & description is required");

  const localThumbnailPath = req.files?.thumbnail[0]?.path;

  if (!localThumbnailPath) {
    throw new ApiError(401, "Thumbnail is required");
  }

  const uploadedThumbnail = await uploadOnCloudinary(localThumbnailPath);
  if (!uploadedThumbnail) {
    throw new ApiError(401, "Thumbnail upload failed");
  }

  const playlist = await playlistModel.create({
    name,
    owner: req.user._id,
    description,
    thumbnail: uploadedThumbnail.url,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Playlist was created", { playlist: playlist }));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log(id);

  if (!id) throw new ApiError(401, "Playlist id is required");

  const playlist = await playlistModel.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });

  res.status(200).json({ id: playlist._id });
});

const getPlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log(id);

  if (!id) throw new ApiError(401, "Playlist id is required");

  const playlist = await playlistModel.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
        owner: mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
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
              views: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        thumbnail: 1,
        videos: 1,
      },
    },
  ]);

  console.log(playlist);

  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.status(200).json({ data: playlist[0] });
});

const getAllPlaylists = asyncHandler(async (req, res) => {
  const playlists = await playlistModel.find({ owner: req.user._id });
  res.status(200).json({ data: playlists });
});

export { createPlaylist, getAllPlaylists, deletePlaylist, getPlaylist };
