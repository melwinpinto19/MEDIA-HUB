import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Loader } from "../../utils";
import axios from "axios";
import { EachVideoMeta } from ".";

const VideoSearchResults = () => {
  const { query } = useParams();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  const loadVideos = async () => {
    try {
      const res = await axios.post(`/api/v1/videos/getSearchedVideos`, {
        query,
      });
      setVideos(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      console.log(error);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [query]);

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

export default VideoSearchResults;
