import React from "react";
import { BallTriangle, ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";

const Loader = ({ type = 0 }) => {
  const dark = useSelector((state) => state.mode.value);
  return (
    <div
      className={`grid place-items-center w-full h-screen ${
        dark ? "bg-gray-900" : "bg-white"
      }`}
    >
      {type === 0 ? (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      ) : (
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#4fa94d"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      )}
    </div>
  );
};

export default Loader;
