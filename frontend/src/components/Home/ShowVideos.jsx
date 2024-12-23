import React, { useEffect, useState } from "react";
import { EachVideoMeta } from "./index";
import axios from "axios";
import { shuffleArray } from "../../utils/ArrayUtil";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ShowVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const mode = useSelector((state) => state.mode.value);
  
  const loadVideos = async () => {
    try {
      const res = await axios.get("/api/v1/videos/getAllVideos");
      const shuffledArr = shuffleArray(res.data.data);
      setVideos(shuffledArr);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <>
      {!loading && (
        <div
          className={`${
            mode ? "bg-slate-950" : "bg-white"
          } flex flex-wrap  gap-5 items-center justify-center  w-full px-2 py-2`}
          style={{ height: "92vh" }}
        >
          {videos.map((data, index) => (
            <EachVideoMeta
              videoDetails={data}
              key={Date.now() * Math.random()}
            />
          ))}
          {videos.map((data, index) => (
            <EachVideoMeta
              videoDetails={data}
              key={Date.now() * Math.random()}
            />
          ))}
        </div>
      )}
      {loading && (
        <div className="flex flex-wrap gap-5 px-2 py-20 justify-center">
          {/* Skeleton items */}
          {Array(15)
            .fill()
            .map((_, index) => (
              <div key={index} className="">
                <SkeletonTheme baseColor="#202020" highlightColor="#444">
                  <Skeleton height={200} width={350} />
                </SkeletonTheme>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default ShowVideos;
