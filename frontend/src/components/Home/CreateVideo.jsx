import axios from "axios";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { toast } from "react-toastify";

const CreateVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publish, setPublish] = useState(false);
  const formRef = useRef(null);
  const [resLoading, setResLoading] = useState(false);

  // Error state for input validation
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    videoFile: "",
    thumbnail: "",
  });

  // Access dark mode state from Redux
  const isDarkMode = useSelector((state) => state.mode.value);

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files);
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      title: "",
      description: "",
      videoFile: "",
      thumbnail: "",
    };

    if (!title) {
      newErrors.title = "Title is required";
      valid = false;
    }
    if (!description) {
      newErrors.description = "Description is required";
      valid = false;
    }
    if (!videoFile) {
      newErrors.videoFile = "Video file is required";
      valid = false;
    }
    if (!thumbnail) {
      newErrors.thumbnail = "Thumbnail image is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const createVideo = async () => {
    // Implement logic to create the video
    try {
      setResLoading(true);
      const formData = new FormData(formRef.current);
      const res = await axios.post("/api/v1/videos/create-video", formData);
      console.log(res);
      setResLoading(false);
      toast.success(res.data.msg);
    } catch (error) {
      setResLoading(false);
      toast.error("Failed to upload the video");
      console.log(error);
      
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      // If all inputs are valid, process the video data here (e.g., upload to server)
      console.log({
        videoFile,
        thumbnail,
        title,
        description,
        publish,
      });

      createVideo();
    } else {
      console.log("Form is invalid");
    }
  };

  // Define styles for dark and light modes
  const containerStyle = isDarkMode
    ? "bg-slate-950 text-gray-300"
    : "bg-white text-gray-700";
  const inputStyle = isDarkMode
    ? "bg-gray-700 text-gray-300 border-gray-600"
    : "bg-white text-gray-700 border-gray-300";
  const labelStyle = isDarkMode ? "text-gray-300" : "text-gray-700";
  const buttonStyle = isDarkMode
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <div
      className={`flex justify-center items-center w-full ${containerStyle} `}
      style={{ minHeight: "92vh" }}
    >
      <div
        className={`w-5/6 mx-auto p-6 shadow-md rounded-lg ${containerStyle}`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload Your Video
        </h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          ref={formRef}
        >
          {/* Title */}
          <div className="mb-4">
            <label
              className={`block text-sm font-bold mb-2 ${labelStyle}`}
              htmlFor="title"
            >
              Video Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputStyle}`}
              name="title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              className={`block text-sm font-bold mb-2 ${labelStyle}`}
              htmlFor="description"
            >
              Video Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows="4"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputStyle}`}
              name="description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">{errors.description}</p>
            )}
          </div>

          {/* Video File */}
          <div className="mb-4">
            <label
              className={`block text-sm font-bold mb-2 ${labelStyle}`}
              htmlFor="videoFile"
            >
              Video File
            </label>
            <input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputStyle}`}
              name="videoFile"
            />
            {errors.videoFile && (
              <p className="text-red-500 text-sm mt-2">{errors.videoFile}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="mb-4">
            <label
              className={`block text-sm font-bold mb-2 ${labelStyle}`}
              htmlFor="thumbnail"
            >
              Thumbnail Image
            </label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputStyle}`}
              name="thumbnail"
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-2">{errors.thumbnail}</p>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="mb-6">
            <label className={`inline-flex items-center ${labelStyle}`}>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={publish}
                value={publish ? "true" : "false"}
                onChange={(e) => setPublish(e.target.checked)}
                name="isPublished"
              />
              <span className="ml-2">Publish Video</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`w-full p-3 rounded-lg font-bold transition duration-300 ${
                resLoading ? "bg-gray-500" : buttonStyle
              }`}
            >
              {resLoading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVideo;
