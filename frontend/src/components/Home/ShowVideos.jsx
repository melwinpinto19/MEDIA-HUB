import React, { useEffect, useState } from "react";
import { EachVideoMeta } from "./index";
import axios from "axios";
import { Loader } from "../../utils";
import { shuffleArray } from "../../utils/ArrayUtil";
import { useSelector } from "react-redux";

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

  if (loading) return <Loader />;
  return (
    <>
      <div
        className={`${
          mode ? "bg-slate-900" : "bg-white"
        } flex flex-wrap  gap-5 items-center justify-center  w-full px-2 py-20`}
        style={{ height: "92vh" }}
      >
        {videos.map((data, index) => (
          <EachVideoMeta videoDetails={data} key={Date.now() * Math.random()} />
        ))}
        {videos.map((data, index) => (
          <EachVideoMeta videoDetails={data} key={Date.now() * Math.random()} />
        ))}
      </div>
    </>
  );
};

export default ShowVideos;
