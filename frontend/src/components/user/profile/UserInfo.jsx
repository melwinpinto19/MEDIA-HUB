import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, login } from "../../../redux/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const mode = useSelector((state) => state.mode.value); // Get dark or light mode from Redux
  const [avatar, setAvatar] = useState(user?.avatar);
  const [coverImage, setCoverImage] = useState(user?.coverImage);
  const avatarFormRef = useRef(null);
  const coverImageFormRef = useRef(null);

  const refreshUser = async () => {
    try {
      const res = await axios.post("/api/v1/users/get-current-user");
      const user = await axios.post("/api/v1/users/get-user-profile", {
        username: res?.data?.user?.username,
      });
      dispatch(login(user.data));
    } catch (error) {
      navigate("/login");
    }
  };

  // Upload profile photo:
  const updateAvatar = async () => {
    try {
      const res = await axios.post(
        "/api/v1/users/update-avatar",
        avatarFormRef.current
      );
      setAvatar(res?.data?.url);
      toast.success("Avatar updated successfully");
      refreshUser();
    } catch (error) {
      toast.error("Failed to update avatar");
    }
  };

  // Upload cover photo:
  const updateCoverImage = async () => {
    try {
      const res = await axios.post(
        "/api/v1/users/update-cover-image",
        coverImageFormRef.current
      );
      setCoverImage(res?.data?.url);
      toast.success("Cover Image updated successfully");
      refreshUser();
    } catch (error) {
      toast.error("Failed to update cover image");
    }
  };

  // Logging out the user and redirecting to /login
  const logoutUser = async () => {
    try {
      const res = await axios.post("/api/v1/users/logout");
      toast.success("Logged out successfully");
      setTimeout(() => {
        dispatch(logout());
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div
      className={`w-full mx-auto shadow-lg overflow-hidden ${
        mode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div
        className="relative h-64 bg-cover bg-center "
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <form
          encType="multipart/form-data"
          ref={coverImageFormRef}
          className="p-5 absolute right-0 bottom-0"
        >
          <label
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            htmlFor="cover"
          >
            Change cover
          </label>
          <input
            type="file"
            name="coverImage"
            id="cover"
            hidden
            onChange={updateCoverImage}
          />
        </form>
      </div>

      {/* Profile Image Section */}
      <div className="relative">
        <div className="absolute -top-16 left-6">
          <img
            src={avatar}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
          />
          <form
            encType="multipart/form-data"
            ref={avatarFormRef}
            className="mt-4"
          >
            <label
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
              htmlFor="profile"
            >
              Change Profile
            </label>
            <input
              type="file"
              name="avatar"
              id="profile"
              hidden
              onChange={updateAvatar}
            />
          </form>
        </div>
        <div className="ml-40 mt-8">
          <h2 className="text-2xl font-semibold">{user?.fullname}</h2>
          <p className={`text-gray-600 ${mode ? "text-gray-300" : ""}`}>
            {user?.username}
          </p>
        </div>
      </div>

      {/* Subscriber Count and Buttons */}
      <div className="mt-10 p-6 flex justify-between items-center">
        <div>
          <p className={`${mode ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-bold text-lg">{user?.subscribersCount}</span>{" "}
            Subscribers
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
            Edit Profile
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            onClick={logoutUser}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
