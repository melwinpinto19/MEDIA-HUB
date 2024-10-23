import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import { useParams } from "react-router";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { Form } from "react-router-dom";
import { login } from "../../redux/authSlice";

const EditVideo = () => {
  const { id } = useParams();
  const isDarkMode = useSelector((state) => state.mode.value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(`/api/v1/videos/getVideo`, { id });
        setTitle(res.data.title);
        setDescription(res.data.description);
        setIsPublished(res.data.isPublished);
        setLoading(false);
      } catch (error) {}
    })();
  }, []);

  // State for video details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  // Toggles for editing thumbnail and video
  const [editThumbnail, setEditThumbnail] = useState(false);
  const [editVideo, setEditVideo] = useState(false);

  //   form ref:
  const formRef = useRef(null);

  // Dark mode styles
  const baseClasses = isDarkMode
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-gray-900 border-gray-300";

  if (loading) {
    return (
      <div
        className={`h-full grid place-items-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } transition-colors duration-300`}
      >
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["black"]}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <div
        className={`max-w-xl mx-auto shadow-lg p-6 rounded-lg ${baseClasses}`}
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Video</h2>

        {/* Title Field */}
        <form action="" encType="multipart/form-data" ref={formRef}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${baseClasses} border-solid ${
                isDarkMode ? "border-white" : "border-black"
              } border-2 outline-none`}
              placeholder="Enter video title"
              name="title"
            />
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${baseClasses} ${
                isDarkMode ? "border-white" : "border-black"
              } border-2 outline-none`}
              rows="4"
              placeholder="Enter video description"
              name="description"
            />
          </div>

          {/* Toggle for Editing Thumbnail */}
          <div className="flex items-center mb-4">
            <label className="mr-2">Edit Thumbnail</label>
            <Switch
              checked={editThumbnail}
              onChange={setEditThumbnail}
              className={`${
                editThumbnail ? "bg-blue-600" : "bg-gray-400"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable editing thumbnail</span>
              <span
                className={`${
                  editThumbnail ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>

          {/* Thumbnail Upload (conditionally enabled) */}
          {editThumbnail && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className={`w-full px-4 py-2 rounded-lg ${baseClasses}`}
                name="thumbnail"
              />
            </div>
          )}

          {/* Toggle for Editing Video */}
          <div className="flex items-center mb-4">
            <label className="mr-2">Edit Video</label>
            <Switch
              checked={editVideo}
              onChange={setEditVideo}
              className={`${
                editVideo ? "bg-blue-600" : "bg-gray-400"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable editing video</span>
              <span
                className={`${
                  editVideo ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>

          {/* Video Upload (conditionally enabled) */}
          {editVideo && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className={`w-full px-4 py-2 rounded-lg ${baseClasses}`}
                name="videoFile"
              />
            </div>
          )}

          {/* Publish Status Toggle */}
          <div className="flex items-center mb-4">
            <label className="mr-2">Publish Status</label>
            <Switch
              checked={isPublished}
              onChange={setIsPublished}
              className={`${
                isPublished ? "bg-green-600" : "bg-gray-400"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Toggle publish status</span>
              <span
                className={`${
                  isPublished ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>

          {/* Save Button */}
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
            onClick={(e) => {
              e.preventDefault();

              const form = new FormData(formRef.current);

              form.append("publish", isPublished);
              form.append("editThumbnail", editThumbnail);
              form.append("editVideo", editVideo);

              console.log("form", form);

              // handle save logic here
              console.log({
                title,
                description,
                thumbnail,
                video,
                isPublished,
              });
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVideo;
