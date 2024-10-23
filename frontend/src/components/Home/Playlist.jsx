import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux"; // Import Redux to access dark mode state
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const PlaylistsComponent = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const formRef = useRef(null);
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/v1/playlist/getAllPlaylists");
        setPlaylists(res.data.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load playlists");
        console.log(error);
      }
    })();
  }, []);

  // Access dark mode state from Redux
  const isDarkMode = useSelector((state) => state.mode.value);

  // Dummy playlist data
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      thumbnail: "https://via.placeholder.com/100",
      name: "My Favorite Songs",
      description: "A collection of my all-time favorite tracks.",
      videoCount: 12,
    },
    {
      id: 2,
      thumbnail: "https://via.placeholder.com/100",
      name: "Coding Tutorials",
      description: "Playlists for learning web development and programming.",
      videoCount: 25,
    },
    {
      id: 3,
      thumbnail: "https://via.placeholder.com/100",
      name: "Workout Mix",
      description: "Pump up your energy with these workout tracks.",
      videoCount: 8,
    },
  ]);

  // Handle playlist form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // check for errors :
    const newError = {
      name: "",
      description: "",
      thumbnail: "",
    };

    if (!name.trim()) {
      newError.name = "Name is required";
    }

    if (!description.trim()) {
      newError.description = "Description is required";
    }

    if (!thumbnail) {
      newError.thumbnail = "Thumbnail is required";
    }

    if (Object.values(newError).some((error) => error !== "")) {
      setFormError(newError);
      return;
    }

    setFormError({});

    try {
      const res = await axios.post(
        "/api/v1/playlist/create-playlist",
        new FormData(formRef.current)
      );

      setPlaylists([...playlists, res.data.data.playlist]);
      toggleForm();
      toast.success("Playlist created successfully");
    } catch (error) {}
  };

  // Handle playlist deletion
  const handleDelete = async (id) => {
    try {
      const res = await axios.post("/api/v1/playlist/delete-playlist", {
        id,
      });
      const updatedPlaylists = playlists.filter(
        (playlist) => playlist._id !== res.data.id
      );
      setPlaylists(updatedPlaylists);
      toast.success("Playlist deleted successfully");
    } catch (error) {
      toast.error("Failed to delete playlist");
    }
  };

  // Toggle the form visibility
  const toggleForm = () => setShowForm(!showForm);

  // Define styles based on dark mode
  const containerStyle = isDarkMode
    ? "bg-slate-900 text-gray-100"
    : "bg-white text-gray-800";
  const inputStyle = isDarkMode
    ? "bg-gray-800 border-gray-700 text-gray-100"
    : "bg-white border-gray-300 text-gray-800";
  const labelStyle = isDarkMode ? "text-gray-300" : "text-gray-700";
  const buttonStyle = isDarkMode
    ? "bg-purple-600 hover:bg-purple-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className={` mx-auto  py-6 px-4 ${containerStyle}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-semibold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Your Playlists
        </h2>
        <button
          className="text-3xl text-blue-600 dark:text-purple-500 hover:text-blue-800 dark:hover:text-purple-700 transition duration-300"
          onClick={toggleForm}
        >
          +
        </button>
      </div>

      {/* Playlist Form (Display in the center of the screen when visible) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`p-6 rounded-lg shadow-md ${containerStyle} min-w-lg mx-auto w-3/5`}
          >
            <h2 className="text-2xl font-semibold mb-4">Create Playlist</h2>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4"
              ref={formRef}
            >
              {/* Playlist Name */}
              <div>
                <label className={`block text-sm font-medium ${labelStyle}`}>
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter playlist name"
                  className={`w-full mt-1 p-3 border rounded-md ${inputStyle}`}
                  name="name"
                />
              </div>
              {formError.name && (
                <p className="text-red-500 text-sm">{formError.name}</p>
              )}

              {/* Playlist Description */}
              <div>
                <label className={`block text-sm font-medium ${labelStyle}`}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter playlist description"
                  className={`w-full mt-1 p-3 border rounded-md ${inputStyle}`}
                  name="description"
                ></textarea>
              </div>
              {formError.description && (
                <p className="text-red-500 text-sm">{formError.description}</p>
              )}

              {/* Playlist Thumbnail */}
              <div>
                <label className={`block text-sm font-medium ${labelStyle}`}>
                  Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className={`w-full mt-1 p-3 border rounded-md ${inputStyle}`}
                  name="thumbnail"
                />
              </div>
              {formError.thumbnail && (
                <p className="text-red-500 text-sm">{formError.thumbnail}</p>
              )}

              {/* Submit Button */}
              <div className="flex gap-1">
                {" "}
                <button
                  type="submit"
                  className={`w-2/4 mt-4 p-3 rounded-md font-semibold ${buttonStyle}`}
                >
                  Create Playlist
                </button>{" "}
                <button
                  className={`w-2/4 mt-4 p-3 rounded-md font-semibold ${buttonStyle} bg-red-600 hover:bg-red-700`}
                  onClick={toggleForm}
                >
                  cancel
                </button>
              </div>
            </form>

            {/* Close form button */}
          </div>
        </div>
      )}

      {/* Display Playlists */}
      <div className="flex flex-col gap-5">
        {!isLoading &&
          playlists.map((playlist) => (
            <PlaylistItem
              key={playlist.id}
              data={playlist}
              onDelete={() => handleDelete(playlist._id)}
            />
          ))}
        {isLoading && (
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton count={5} className="w-full h-40" />
          </SkeletonTheme>
        )}
      </div>
    </div>
  );
};

const PlaylistItem = ({ data, onDelete }) => {
  const { thumbnail, name, description, videos, _id } = data;
  const dark = useSelector((state) => state.mode.value);
  return (
    <div
      className={`${
        dark ? "bg-slate-800" : "bg-white"
      } shadow-md rounded-lg p-4 flex items-center space-x-4`}
    >
      {/* Playlist Thumbnail */}
      <Link to={`/home/playlists/playlist/${_id}`}>
        <img
          src={thumbnail}
          alt={name}
          className=" rounded-lg object-cover w-80 h-40 max-[869px]:w-2/4"
        />
      </Link>

      {/* Playlist Details */}
      <div className="flex-1 max-[869px]:w-2/4">
        <h3
          className={`text-lg font-semibold ${
            dark ? "text-white" : "text-black"
          }  truncate`}
        >
          {name}
        </h3>
        <p
          className={`text-sm ${
            dark ? "text-white" : "text-black"
          } truncate w-96 max-[626px]:w-44 text-wrap`}
        >
          {description}
        </p>
        <p className="text-sm dark:text-gray-400 text-gray-600 mt-1">
          {videos.length} videos
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );
};

export default PlaylistsComponent;
