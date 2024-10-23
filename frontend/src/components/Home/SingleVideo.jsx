import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { Loader } from "../../utils";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { getFormatFromDiff } from "../../utils/DateUtil";
import { Comments, EachVideoMeta } from "./index";
import { shuffleArray } from "../../utils/ArrayUtil";

const PlaylistModal = ({ playlists = [], isOpen, onClose, videoId }) => {
  if (!isOpen) return null; // Return null if the modal is not open

  const addToPlaylist = async (playlistId) => {
    try {
      const response = await axios.post("/api/v1/playlist/add-video", {
        playlistId,
        videoId,
      });
      toast.success("Video is added sucessfully to the playlist");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg p-6 relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-600 dark:text-gray-200 hover:text-gray-900"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Modal Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Select a Playlist
          </h2>

          {/* Playlist List */}
          <div className="space-y-4">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <div>
                  {/* Playlist Name */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {playlist.name}
                  </h3>

                  {/* Truncated Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate overflow-ellipsis w-80">
                    {playlist.description}
                  </p>
                </div>

                {/* Plus Icon */}
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => addToPlaylist(playlist._id)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const App = ({ videoId }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/v1/playlist/getAllPlaylists");
        setPlaylists(response.data.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const [playlists, setPlaylists] = useState([]);

  return (
    <div className="">
      {/* Button to open the modal */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        onClick={() => setModalOpen(true)}
      >
        Add to playlist
      </button>

      {/* Modal */}
      <PlaylistModal
        playlists={playlists}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        videoId={videoId}
      />
    </div>
  );
};

const SingleVideo = () => {
  // Access dark mode state from Redux
  const isDarkMode = useSelector((state) => state.mode.value);
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState({});
  const { id } = useParams();
  const [timeSinceUploaded, setTimeSinceUploaded] = useState({});
  const [flag, setFlag] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videos, setVideos] = useState([]);

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
  }, [id]);

  // Define styles based on dark mode
  const containerStyle = isDarkMode
    ? "bg-slate-950 text-gray-200"
    : "bg-white text-gray-800";
  const videoInfoStyle = isDarkMode ? "text-gray-300" : "text-gray-700";
  const buttonStyle = isDarkMode
    ? "bg-blue-700 text-white hover:bg-blue-800"
    : "bg-blue-500 text-white hover:bg-blue-600";
  const borderStyle = isDarkMode ? "border-gray-700" : "border-gray-300";

  // load side bar videos :

  const loadVideos = async () => {
    try {
      const res = await axios.get("/api/v1/videos/getAllVideos");
      const shuffledArr = shuffleArray(res.data.data);
      setVideos(shuffledArr);
      setVideosLoading(false);
    } catch (error) {
      setVideosLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full flex">
      <div className={`w-2/4 mt-1 p-4 ${containerStyle} overflow-auto `} style={{maxHeight:"92vh"}}>
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
        <div className="flex items-center justify-between">
          {" "}
          <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
          <App videoId={videoData._id} />
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
          <span className={`text-sm leading-relaxed ${videoInfoStyle}`}>
            <p>Description: </p>
            {videoData.description}
          </span>
        </div>

        <Comments videoId={videoData._id} />
      </div>
      <div
        className="w-2/4  flex gap-5 justify-center flex-wrap mt-1 overflow-auto p-3 pt-10"
        style={{ maxHeight: "92vh" }}
      >
        {videos.map((videoData) => (
          <EachVideoMeta videoDetails={videoData} key={Date.now()} />
        ))}
      </div>
    </div>
  );
};

export default SingleVideo;
