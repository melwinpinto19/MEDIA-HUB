import React, { useEffect, useState } from "react";
import { EachVideoMeta } from "./index";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import { Loader } from "../../utils";

const ShowVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVideos = async () => {
    try {
      const res = await axios.get("/api/v1/videos/getAllVideos");
      setVideos(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(true);
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
        {videos.map(({ _id, title, ownerData, thumbnail, duration }, index) => (
          <EachVideoMeta
            key={index}
            title={title}
            ownerData={ownerData}
            thumbnail={thumbnail}
            duration={duration}
            _id={_id}
          />
        ))}
        <EachVideoMeta
          title={"abcd"}
          ownerData={{ avatar: "https://i.pravatar.cc/300", username: "abcd" }}
          thumbnail={"https://i.pravatar.cc/300"}
          duration={130}
        />
        <EachVideoMeta
          title={"abcd"}
          ownerData={{ avatar: "https://i.pravatar.cc/300", username: "abcd" }}
          thumbnail={"https://i.pravatar.cc/300"}
          duration={3956}
        />
      </div>
    </>
  );
};

export default ShowVideos;
