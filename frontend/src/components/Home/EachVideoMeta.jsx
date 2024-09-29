import React from "react";
import { Link } from "react-router-dom";
import { getFormatFromDiff } from "../../utils/DateUtil";

const VideoCard = ({ videoDetails }) => {
  const { _id, title, thumbnail, ownerData, duration, views, createdAt } =
    videoDetails;

  const { days, months, years } = getFormatFromDiff(createdAt);

  // Convert duration to hours, minutes, seconds
  const formatDuration = () => {
    const hrs = Math.floor(duration / 3600);
    const mins = Math.floor((duration % 3600) / 60);
    const secs = (duration % 60).toPrecision(2);
    return `${hrs > 0 ? `${hrs}:` : ""}${mins}:${
      secs < 10 ? `0${secs}` : secs
    }`;
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm">
      {/* Thumbnail section */}
      <div className="relative">
        <Link to={`/home/videos/video/${_id}`}>
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-40 object-cover"
          />
        </Link>
        {/* Duration overlay */}
        <div className="absolute right-2 bottom-2 bg-black bg-opacity-75 text-sm px-2 py-1 rounded">
          {formatDuration()}
        </div>
      </div>

      {/* Video info section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <img
            src={ownerData.avatar}
            alt="Channel avatar"
            className="h-8 w-8 rounded-full"
            loading="lazy"
          />
          <p className="text-sm font-light">{ownerData.username}</p>
        </div>

        {/* Views */}
        <div className="mt-4 text-sm">
          <p>
            {years
              ? `${years} years ago`
              : months
              ? `${months} months ago`
              : `${days} days ago`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;