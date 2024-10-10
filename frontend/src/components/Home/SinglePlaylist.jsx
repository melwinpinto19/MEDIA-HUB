import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import { useParams } from "react-router";

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
          `/api/v1/playlist/playlists/${playlistId}`
        ); // Replace with your API
        setPlaylist(response.data.data);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching playlist details", error);
        setLoading(false);
      }
    };
    fetchPlaylistDetails();
  }, [playlistId]);

  // Styles based on dark mode
  const containerStyle = isDarkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-900";

  // Skeleton for loading state
  if (loading) {
    return (
      <div className={`p-6 ${containerStyle} my-20`}>
        <Skeleton height={40} width={200} /> {/* Playlist Name */}
        <Skeleton height={20} width={400} className="mt-4" />{" "}
        {/* Description */}
        <Skeleton height={20} width={100} className="mt-2" />{" "}
        {/* Video Count */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={150} />
          ))}
        </div>
      </div>
    );
  }

  // Render the playlist data once loaded
  return (
    <div className={`p-6 min-h-screen ${containerStyle} my-20`}>
      {/* Playlist Info */}
      <h2 className="text-3xl font-bold mb-2">{playlist?.name}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {playlist?.description}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {playlist?.videoCount} videos
      </p>

      {/* Videos */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlist?.videos.map((video) => (
          <VideoItem
            key={video._id}
            thumbnail={video.thumbnail}
            title={video.title}
          />
        ))}
      </div>
    </div>
  );
};

// Component to display each video in the playlist
const VideoItem = ({ thumbnail, title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      {/* Video Thumbnail */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-32 object-cover rounded-lg mb-2"
      />
      {/* Video Title */}
      <h3 className="text-lg font-bold dark:text-gray-300">{title}</h3>
    </div>
  );
};

export default SinglePlaylist;
