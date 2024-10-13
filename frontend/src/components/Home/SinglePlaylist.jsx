import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import { useParams } from "react-router";
import { EachVideoMeta } from "./index";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SinglePlaylist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null); // State to store playlist data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Access dark mode state from Redux
  const isDarkMode = useSelector((state) => state.mode.value);

  // Fetch playlist details from backend when component mounts
  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const response = await axios.get(
          `/api/v1/playlist/playlists/${playlistId}` // Replace with your API
        );
        setPlaylist(response.data.data);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching playlist details", error);
        setLoading(false);
      }
    };
    fetchPlaylistDetails();
  }, [playlistId]);

  const formatDuration = (duration) => {
    const hrs = Math.floor(duration / 3600);
    const mins = Math.floor((duration % 3600) / 60);
    const secs = (duration % 60).toPrecision(2);
    return `${hrs > 0 ? `${hrs}:` : ""}${mins}:${
      secs < 10 ? `0${secs}` : secs
    }`;
  };

  // Styles based on dark mode
  const containerStyle = isDarkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-900";

  // Skeleton for loading state
  if (loading) {
    return (
      <div className={`p-6 ${containerStyle} my-20`}>
        <Skeleton height={40} width={300} /> {/* Playlist Name */}
        <Skeleton height={20} width={500} className="mt-4" />{" "}
        {/* Description */}
        <Skeleton height={20} width={100} className="mt-2" />{" "}
        {/* Video Count */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={200} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen ${containerStyle} py-20 bg-slate-950`}>
      {/* Playlist Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between ">
        <div>
          <h2 className="text-4xl font-bold mb-2">{playlist?.name}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {playlist?.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {playlist?.videos.length} videos
          </p>
        </div>
        {/* Playlist Thumbnail */}
        <div className="mt-4 md:mt-0">
          <Link to={`/home/playlists/playlist/${playlist?._id}`}>
            <img
              src={playlist?.thumbnail}
              alt="Playlist Thumbnail"
              className="rounded-lg shadow-lg w-full md:w-80 h-44 object-cover"
            />
          </Link>
        </div>
      </div>
      <div className="text-2xl font-semibold">Your Videos</div>
      {/* Videos Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlist?.videos.map((video) => (
          <div
            key={video._id}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <Link to={`/home/videos/video/${video._id}`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover object-center"
              />
            </Link>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2 truncate">{video.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {video.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {video.views} views • {formatDuration(video.duration)} •{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePlaylist;
