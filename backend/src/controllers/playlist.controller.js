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
    // matching the playlist :
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    // populating videos :
    {
      $lookup: {
        from: "videos",
        localField: "videos",
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
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        foreignField: "_id",
        as: "videos",
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

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  if (!req.body.playlistId) throw new ApiError(401, "Playlist id is required");
  if (!req.body.videoId) throw new ApiError(401, "Video id is required");

  const playlist1 = await playlistModel.findOne({ _id: req.body.playlistId });

  if (playlist1.videos.includes(req.body.videoId)) {
    throw new ApiError(401, "Video already in playlist");
  }

  const playlist = await playlistModel.findOneAndUpdate(
    { _id: req.body.playlistId },
    { $push: { videos: req.body.videoId } },
    { new: true }
  );

  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.status(200).json({ data: playlist });
});

const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
  if (!req.body.playlistId) throw new ApiError(401, "Playlist id is required");
  if (!req.body.videoId) throw new ApiError(401, "Video id is required");

  const playlist = await playlistModel.findOneAndUpdate(
    { _id: req.body.playlistId },
    { $pull: { videos: req.body.videoId } },
    { new: true }
  );

  if (!playlist) throw new ApiError(404, "Playlist not found"); // playlist not found

  res.status(200).json({ data: playlist });
});

const getAllPlaylists = asyncHandler(async (req, res) => {
  const playlists = await playlistModel.find({ owner: req.user._id });
  res.status(200).json({ data: playlists });
});

export {
  createPlaylist,
  getAllPlaylists,
  deletePlaylist,
  getPlaylist,
  addVideoToPlaylist,
  deleteVideoFromPlaylist
};
