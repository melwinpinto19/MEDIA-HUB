import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import userModel from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);

    // generate token :
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // save token in db:
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "failed to generate access token || refresh token");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  // extracting the form data :
  const { username, password, email, fullname } = req.body;

  console.log({ username, password, email, fullname }, "1");

  // checking if any of the field is empty
  if (
    [username, password, email, fullname].some((each) => each.trim() === "")
  ) {
    throw new ApiError(400, "Please fill all the neccesary fields");
  }

  // checking if user already exists :
  const existedUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) throw new ApiError(409, "username or email already exists");

  console.log({ username, password, email, fullname }, "2");

  // file handling :
  const multerAvaterLocalPath = req.files?.avatar[0]?.path ?? null;
  const multerCoverImageLocalPath = req.files?.coverImage[0]?.path ?? null;

  console.log(multerAvaterLocalPath);

  if (!multerAvaterLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // uplaoding avatar and cover image to cloud :
  const cloudinaryAvatar = await uploadOnCloudinary(multerAvaterLocalPath);
  const cloudinaryCoverImage = await uploadOnCloudinary(
    multerCoverImageLocalPath
  );

  if (!cloudinaryAvatar)
    throw new ApiError(400, "Error in uplaoding avatar file");

  const userResponse = await userModel.create({
    username,
    email,
    fullname,
    avatar: cloudinaryAvatar.url,
    coverImage: cloudinaryCoverImage?.url || "",
    password,
  });

  const createdUser = await userModel
    .findById(userResponse._id)
    .select("-password -refreshToken");

  if (!createdUser) throw new ApiError(500, "Error while registering the user");

  res.status(201).json(createdUser);
});

const loginUser = asyncHandler(async (req, res, next) => {
  // fetch the data :
  const { username, password, email } = req.body;

  // check if the fields are empty :
  if (!username || !email)
    throw new ApiError(400, "Username or password is empty");

  // check if the user exists :
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "user does not exists");
  }

  // validating password :
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(400, "incorrect password");

  // fetching the tokens :
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // sending the cookie and response to the browser :
  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .json(
      new ApiResponse(200, "User logged in successfully", {
        accessToken,
        refreshToken,
        user,
      })
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true } // makes sure the the updated document is returned
  );

  res
    .status(200)
    .clearCookie("accessToken", { htttpOnly: true, secure: true })
    .clearCookie("refreshToken", { htttpOnly: true, secure: true })
    .json(new ApiResponse(200, "User logged Out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    // fetch the refresh token :
    const incomingRefreshToken =
      req.cookies.refreshToken ||
      req.header("Authorization").replace("Bearer ", "");

    // validate the fetched token :
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

    // decode the refresh token :
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await userModel.findById(decodedRefreshToken?._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (user.refreshToken !== incomingRefreshToken)
      throw new ApiError(401, "Refresh token is expired");

    // fetching the tokens :
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    // sending the cookie and response to the browser :
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        accessToken,
        refreshToken,
      });
  } catch (error) {
    throw new ApiError(401, "Error while refreshing the tokens");
  }
});

const changeUserPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  // validate oldpassword :
  const isPasswordValid = await req.user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) throw new ApiError(401, "old password is incorrect");

  console.log("Inside JWT");

  // update password :
  req.user.password = newPassword;
  await req.user.save({ validateBeforeSave: false });

  res
    .status(201)
    .json(new ApiResponse(201, "Password is updated successfully"));
});

const getCurrentUser = asyncHandler((req, res, next) => {
  res.status(200).json({
    user: {
      username: req.user.username,
    },
  });
});

const updateAvatar = asyncHandler(async (req, res, next) => {
  const localAvatarPath = req.files?.avatar[0]?.path;

  if (!localAvatarPath) throw new ApiError(401, "Avatar file is missing");

  const cloudinaryResponse = await uploadOnCloudinary(localAvatarPath);

  if (!cloudinaryResponse) throw new ApiError(401, "Failed to upload the file");

  req.user.avatar = cloudinaryResponse.url;

  await req.user.save({ validateBeforeSave: false });

  res.status(209).json({
    msg: "avatar updated sucessfully",
    url: cloudinaryResponse.url,
  });
});

const updateCoverImage = asyncHandler(async (req, res, next) => {
  const localCoverImagePath = req.files?.coverImage[0]?.path;

  if (!localCoverImagePath) throw new ApiError(401, "Avatar file is missing");

  const cloudinaryResponse = await uploadOnCloudinary(localCoverImagePath);

  if (!cloudinaryResponse) throw new ApiError(401, "Failed to upload the file");

  req.user.coverImage = cloudinaryResponse.url;

  await req.user.save({ validateBeforeSave: false });

  res.status(209).json({
    msg: "cover image updated sucessfully",
    url: cloudinaryResponse.url,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const isPasswordCorrect = await req.user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Password is incorrect");

  await userModel.findByIdAndDelete(req.user._id);

  res
    .status(200)
    .cookie("accessToken", null, { httpOnly: true, secure: true })
    .cookie("refreshToken", null, { httpOnly: true, secure: true })
    .json(new ApiResponse(200, "User deleted successfully", { user: null }));
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.body;

  if (!username) throw new ApiError(400, "Username does not exists");

  const response = await userModel.aggregate([
    // filtering the users:
    { $match: { username: username } },
    // getting the count of subscribers :
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    // getting the count of subscriptions :
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        avatar: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        coverImage: 1,
        fullname: 1,
        email: 1,
        isSubscribed: 1,
        _id: 1,
      },
    },
  ]);

  if (!response.length) throw new ApiError(400, "User does not exists");

  res.status(200).json(response[0]);
});

const getUserWatchHistory = asyncHandler(async (req, res, next) => {
  console.log(req.user._id);

  const response = await userModel.aggregate([
    { $match: { _id: req.user._id } }, // fetching the current user
    // getting videos from watch history
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        pipeline: [
          {
            // populating the owner data
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
              _id: 1,
              title: 1,
              description: 1,
              thumbnail: 1,
              ownerData: 1,
              views: 1,
              createdAt: 1,
            },
          },
        ],
        as: "watchHistory",
      },
    },
    {
      $project: {
        watchHistory: 1,
      },
    },
  ]);

  console.log(response);

  res.status(200).json(response[0].watchHistory);
});

const getUserDashboard = asyncHandler(async (req, res, next) => {
  // const response = await userModel.aggregate([
  //   {
  //     $match: { username: req.user.username }, // Match the current user
  //   },
  //   // Subscriber count
  //   {
  //     $lookup: {
  //       from: "subscriptions",
  //       let: { userId: "$_id" }, // Use 'let' to pass _id
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: { $eq: ["$channel", "$$userId"] }, // Match subscriptions where channel matches userId
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "users",
  //             localField: "subscriber", // Match subscriber field
  //             foreignField: "_id",
  //             as: "subscriber",
  //           },
  //         },
  //         {
  //           $addFields: {
  //             subscriber: { $arrayElemAt: ["$subscriber", 0] }, // Get the first subscriber
  //           },
  //         },
  //       ],
  //       as: "subscribers", // Output to 'subscribers'
  //     },
  //   },
  //   // Get the user's videos array
  //   {
  //     $lookup: {
  //       from: "videos",
  //       localField: "_id",
  //       foreignField: "owner", // Match videos where 'owner' is user _id
  //       as: "videos",
  //     },
  //   },
  //   {
  //     $addFields: { videosSize: { $size: "$videos" } }, // Calculate the size of the videos array
  //   },
  // ]);

  const response = await userModel.aggregate([
    {
      $match: { username: req.user.username }, // Match the current user
    },
    // Subscribers :
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscribers.subscriber",
        foreignField: "_id",
        as: "subscribers",
      },
    },
    // videos :
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },

    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        videosCount: { $size: "$videos" },
        viewsCount: { $sum: "$videos.views" },
      },
    },
  ]);

  // If response is empty or undefined, send a suitable message
  if (!response || response.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  // res.status(200).json(response[0]); // Send the first document of the response
  res.status(200).json(response[0]);
});

export {
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
  getUserDashboard,
};
