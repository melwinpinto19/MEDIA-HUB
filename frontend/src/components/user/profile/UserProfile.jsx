import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { BallTriangle } from "react-loader-spinner";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { ThemeToggler } from "../utils";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const mode = useSelector((state) => state.mode.value);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [subscribeToggle, setSubscribeToggle] = useState(false);

  const loadProfile = async () => {
    try {
      const user = await axios.post("/api/v1/users/get-user-profile", {
        username: username,
      });
      setLoading(false);
      setProfileData(user.data);
      setSubscribeToggle(user.data.isSubscribed);
    } catch (error) {
      toast.error("Something went wrong");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const subscribe = async () => {
    try {
      await axios.post("/api/v1/subscription/add-subscription", {
        channelId: profileData._id,
      });
      await loadProfile();
    } catch (error) {
      toast.error("Failed to add subscription");
    }
  };
  const unsubscribe = async () => {
    try {
      await axios.post("/api/v1/subscription/remove-subscription", {
        channelId: profileData._id,
      });
      await loadProfile();
    } catch (error) {
      toast.error("Failed to add subscription");
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center w-full h-screen">
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
      </div>
    );
  }
  return (
    <div
      className={`w-full h-screen shadow-lg overflow-hidden ${
        mode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <ThemeToggler />
      {/* Cover Image Section */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${profileData.coverImage})` }}
      ></div>

      {/* Profile Image and Username Section */}
      <div className="relative">
        <div className="absolute -top-16 left-6">
          <img
            src={profileData.avatar}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
          />
        </div>
        <div className="ml-40 mt-8">
          <h2 className="text-2xl font-semibold">{profileData.username}</h2>
          <p className="text-gray-500">{profileData.email}</p>
          <p className="text-gray-500">{profileData.fullname}</p>
        </div>
      </div>

      {/* Subscriber Count and Buttons */}
      <div className="mt-10 p-6 flex justify-between items-center">
        <div className="flex gap-4">
          <p className={`${mode ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-bold text-lg">
              {profileData.subscribersCount}
            </span>{" "}
            Subscribers
          </p>
          <p className={`${mode ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-bold text-lg">
              {profileData.subscribedToCount}
            </span>{" "}
            Subscribed channels
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 ${
              subscribeToggle ? "bg-blue-800" : "bg-red-600 "
            } text-white rounded-lg shadow-md  transition duration-300`}
            onClick={subscribeToggle ? unsubscribe : subscribe}
          >
            {`${subscribeToggle ? "unsubscribe" : "subscribe"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
