import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { Loader } from "../../utils";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { getFormatFromDiff } from "../../utils/DateUtil";

const SingleVideo = () => {
  // Access dark mode state from Redux
  const isDarkMode = useSelector((state) => state.mode.value);
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState({});
  const { id } = useParams();
  const [timeSinceUploaded, setTimeSinceUploaded] = useState({});
  const [flag, setFlag] = useState(true);

  // subscription stuff :
  const [subscribed, setSubscribed] = useState(null);

  const subscribe = async () => {
    try {
      await axios.post("/api/v1/subscription/add-subscription", {
        channelId: videoData.ownerData._id,
      });
      await loadVideoData();
    } catch (error) {
      toast.error("Failed to add subscription");
    }
  };
  const unsubscribe = async () => {
    try {
      await axios.post("/api/v1/subscription/remove-subscription", {
        channelId: videoData.ownerData._id,
      });
      await loadVideoData();
    } catch (error) {
      toast.error("Failed to remove subscription");
    }
  };

  // likes stuff :

  const [liked, setLiked] = useState(false);

  const addVideoLike = async () => {
    try {
      const res = await axios.post("/api/v1/likes/add-video-like", {
        id,
      });
      loadVideoData();
      setLiked(true);
    } catch (error) {}
  };

  const removeVideoLike = async () => {
    try {
      const res = await axios.post("/api/v1/likes/remove-video-like", {
        id,
      });
      loadVideoData();
      setLiked(false);
    } catch (error) {}
  };

  const addViews = async () => {
    try {
      await axios.post("/api/v1/videos/add-views", {
        id,
      });
    } catch (error) {
      console.log("Failed to add views");
    }
    setFlag(false);
  };

  const loadVideoData = async () => {
    try {
      const res = await axios.post("/api/v1/videos/getVideo", {
        id,
      });

      setVideoData(res.data);
      setLoading(false);
      setSubscribed(res.data.isSubscribed);
      setLiked(res.data.isLiked);
      const { days, months, years } = getFormatFromDiff(res.data.createdAt);
      setTimeSinceUploaded({ days, months, years });
      if (flag) addViews();
    } catch (error) {
      toast.error("Failed to load video data");
    }
  };

  useEffect(() => {
    loadVideoData();
  }, []);

  // Define styles based on dark mode
  const containerStyle = isDarkMode
    ? "bg-gray-900 text-gray-200"
    : "bg-white text-gray-800";
  const videoInfoStyle = isDarkMode ? "text-gray-300" : "text-gray-700";
  const buttonStyle = isDarkMode
    ? "bg-blue-700 text-white hover:bg-blue-800"
    : "bg-blue-500 text-white hover:bg-blue-600";
  const borderStyle = isDarkMode ? "border-gray-700" : "border-gray-300";

  if (loading) return <Loader />;

  return (
    <div className={`max-w-6xl mt-14 p-4 ${containerStyle} `}>
      {/* Video Player */}
      <div className=" mb-4">
        <video
          controls
          src={videoData.videoFile}
          className="h-96 w-full object-cover object-center rounded-lg shadow-lg max-[640px]:h-48"
          poster={videoData.thumbnail}
          autoPlay
        />
      </div>

      {/* Video Information */}
      <div className="">
        {" "}
        <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
      </div>

      <div className="flex justify-between items-center mb-4 gap-6 ">
        <div>
          <span className={`text-sm ${videoInfoStyle}`}>
            {timeSinceUploaded.years
              ? `${timeSinceUploaded.years} year${
                  timeSinceUploaded.years > 1 ? "s" : ""
                } ago`
              : timeSinceUploaded.months
              ? `${timeSinceUploaded.months} month${
                  timeSinceUploaded.months > 1 ? "s" : ""
                } ago`
              : `${timeSinceUploaded.days} day${
                  timeSinceUploaded.days > 1 ? "s" : ""
                } ago`}
          </span>
          <span className={`text-sm ${videoInfoStyle} ml-7`}>
            {" "}
            {videoData.views > 0
              ? `${videoData.views} views`
              : "No views yet"}{" "}
          </span>
        </div>
      </div>
      <div className="mb-3 text-1xl bg-gray-700 rounded-full px-3 py-1 w-24">
        <i
          className={`fa-solid fa-thumbs-up ${liked ? "text-blue-600" : ""}`}
          onClick={liked ? removeVideoLike : addVideoLike}
        ></i>{" "}
        {videoData.likes} likes
      </div>

      {/* Channel Info */}
      <div className="flex justify-between items-start">
        <div className="flex  mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-400 mr-4">
            {" "}
            <img
              src={videoData.ownerData.avatar}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>{" "}
          <div>
            <h2 className="text-lg font-bold">
              {videoData.ownerData.username}
            </h2>
            <p className={`text-sm ${videoInfoStyle}`}>
              {videoData.subscribers} subscribers
            </p>
          </div>
        </div>
        <button
          className={` px-4 py-2 mt-2 ${
            subscribed ? "bg-blue-800" : "bg-red-600 "
          } text-white rounded-lg shadow-md  transition duration-300`}
          onClick={subscribed ? unsubscribe : subscribe}
        >
          {`${subscribed ? "unsubscribe" : "subscribe"}`}
        </button>
      </div>

      {/* Video Description */}
      <div className={`border-t pt-4 ${borderStyle}`}>
        <p className={`text-sm leading-relaxed ${videoInfoStyle}`}>
          <p>Description: </p>
          {videoData.description}
        </p>
      </div>
    </div>
  );
};

export default SingleVideo;
