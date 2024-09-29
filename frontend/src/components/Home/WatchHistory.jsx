import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../../utils";
import axios from "axios";
import { getFormatFromDiff, getUTCFormatFromDiff } from "../../utils/DateUtil";
import { Link } from "react-router-dom";

const WatchHistory = ({ videos = [] }) => {
  const isDarkMode = useSelector((state) => state.mode.value); // Access dark mode from Redux
  const user = useSelector((state) => state.auth.user);

  // Define styles based on dark mode
  const containerStyle = isDarkMode ? "bg-gray-900" : "bg-white";
  const thumbnailStyle = isDarkMode ? "border-gray-700" : "border-gray-300";
  const titleStyle = isDarkMode ? "text-gray-100" : "text-gray-800";
  const descriptionStyle = isDarkMode ? "text-gray-400" : "text-gray-600";

  const dateStr = (createdAt) => {
    const { days, months, years } = getUTCFormatFromDiff(createdAt);
    return years
      ? `${years} years ago`
      : months
      ? `${months} months ago`
      : `${days} days ago`;
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${containerStyle} mt-20`}>
      <h2 className={`text-2xl font-bold mb-4 ${titleStyle}`}>Watch History</h2>
      <div
        className="flex overflow-x-auto space-x-4 py-4 w-full"
        style={{
          scrollBehavior: "smooth", // Smooth scrolling for supported browsers
          scrollbarWidth: "thin",
        }}
      >
        {videos.map((video, index) => (
          <div
            key={index}
            className="min-w-[250px] flex-shrink-0 rounded-lg overflow-hidden shadow-md"
          >
            {/* Thumbnail */}
            <Link to={`/home/videos/video/${video._id}`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className={`w-full h-40 object-cover border ${thumbnailStyle}`}
              />
            </Link>

            {/* Video Details */}
            <div className="p-2">
              <h3 className={`text-lg font-semibold ${titleStyle}`}>
                {video.title}
              </h3>
              <h3 className={` font-semibold ${titleStyle}`}>
                {video.ownerData.username === user.username
                  ? "You"
                  : video.ownerData.username}
              </h3>
              <p className={`text-sm ${descriptionStyle}`}>
                Views: {video.views}
              </p>{" "}
              <p className={`text-sm ${descriptionStyle}`}>
                Uploaded: {dateStr(video.createdAt)}{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage with dummy data
const WatchHistoryPage = () => {
  // const videoData = [
  //   {
  //     title: "Sample Video 1",
  //     description: "This is a sample video description.",
  //     views: "2,300",
  //     uploadDate: "1 week ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   {
  //     title: "Sample Video 2",
  //     description: "Another interesting video description.",
  //     views: "1,800",
  //     uploadDate: "3 days ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   {
  //     title: "Sample Video 3",
  //     description: "Yet another video description.",
  //     views: "3,500",
  //     uploadDate: "5 days ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   {
  //     title: "Sample Video 1",
  //     description: "This is a sample video description.",
  //     views: "2,300",
  //     uploadDate: "1 week ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   {
  //     title: "Sample Video 2",
  //     description: "Another interesting video description.",
  //     views: "1,800",
  //     uploadDate: "3 days ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   {
  //     title: "Sample Video 3",
  //     description: "Yet another video description.",
  //     views: "3,500",
  //     uploadDate: "5 days ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   {
  //     title: "Sample Video 2",
  //     description: "Another interesting video description.",
  //     views: "1,800",
  //     uploadDate: "3 days ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   {
  //     title: "Sample Video 3",
  //     description: "Yet another video description.",
  //     views: "3,500",
  //     uploadDate: "5 days ago",
  //     thumbnail:
  //       "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/56602cb76240433b043903943a13d42c?_a=AQAEuiZ", // Replace with actual thumbnail URL
  //   },
  //   // Add more video data as needed
  // ];
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/v1/users/get-user-watch-history");

        setVideos(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4">
      <WatchHistory videos={videos} />
    </div>
  );
};

export default WatchHistoryPage;
