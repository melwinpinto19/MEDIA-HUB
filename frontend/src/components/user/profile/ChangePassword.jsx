import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState({ value: "", toggle: false });
  const [newPassword, setNewPassword] = useState({ value: "", toggle: false });
  const [loading, setLoading] = useState(false);

  // Get dark mode state from Redux store
  const darkMode = useSelector((state) => state.mode.value);

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      if (!oldPassword.value || !newPassword.value) {
        toast.error("All fields are required");
        return;
      }
      setLoading(true);
      await axios.post("/api/v1/users/change-password/", {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      });
      setLoading(false);
      setOldPassword({ value: "", toggle: false });
      setNewPassword({ value: "", toggle: false });
      toast.success("Password changed successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to change password");
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`shadow-lg rounded-lg p-8 w-full max-w-md ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Change Your Password
        </h2>
        <form onSubmit={changePassword} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="oldPassword"
              className={`text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Old Password
            </label>
            <div className="relative">
              <input
                type={oldPassword.toggle ? "text" : "password"}
                name="oldPassword"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-gray-100 text-gray-800"
                }`}
                value={oldPassword.value}
                onChange={(e) =>
                  setOldPassword({ ...oldPassword, value: e.target.value })
                }
                placeholder="Enter your old password"
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                onClick={() =>
                  setOldPassword({
                    ...oldPassword,
                    toggle: !oldPassword.toggle,
                  })
                }
              >
                <i
                  className={`fa-solid fa-eye${
                    oldPassword.toggle ? "-slash" : ""
                  } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                ></i>
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="newPassword"
              className={`text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={newPassword.toggle ? "text" : "password"}
                name="newPassword"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-gray-100 text-gray-800"
                }`}
                value={newPassword.value}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, value: e.target.value })
                }
                placeholder="Enter your new password"
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                onClick={() =>
                  setNewPassword({
                    ...newPassword,
                    toggle: !newPassword.toggle,
                  })
                }
              >
                <i
                  className={`fa-solid fa-eye${
                    newPassword.toggle ? "-slash" : ""
                  } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                ></i>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors duration-300 ${
              loading
                ? "bg-gray-400"
                : darkMode
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white`}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
