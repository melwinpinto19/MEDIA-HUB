import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";

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
    thumbnail: localThumbnailPath.url,
  });

  res.status(200).json(new ApiResponse(200, "Playlist was created", playlist));
});
