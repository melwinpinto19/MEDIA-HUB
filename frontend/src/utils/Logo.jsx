import React from "react";

const Logo = ({ style }) => {
  return (
    <div className={`flex justify-start items-center h-20 w-auto  ${style} z-50`}>
      <h1 className="text-3xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse shadow-lg hover:shadow-purple-500/50 transition-shadow duration-500 ease-in-out w-auto h-auto">
        MEDIA-HUB
      </h1>
    </div>
  );
};

export default Logo;
