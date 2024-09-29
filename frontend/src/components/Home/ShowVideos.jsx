import React, { useEffect, useState } from "react";
import { EachVideoMeta } from "./index";
import axios from "axios";
import { Loader } from "../../utils";
import { shuffleArray } from "../../utils/ArrayUtil";

const ShowVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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
        className="bg-slate-900 flex flex-wrap content-start gap-5 items-center justify-center  w-full px-12 py-20"
        style={{ height: "92vh" }}
      >
        {videos.map((data, index) => (
          <EachVideoMeta videoDetails={data} key={Date.now() * Math.random()} />
        ))}
      </div>
    </>
  );
};

export default ShowVideos;
