import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState({ value: "", toggle: false });
  const [newPassword, setNewPassword] = useState({ value: "", toggle: false });

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      if (!oldPassword.value || !newPassword.value) {
        toast.error("All fields are required");
        return;
      }
      await axios.post("/api/v1/users/change-password/", {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Change Your Password
        </h2>
        <form onSubmit={changePassword} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="oldPassword"
              className="text-sm font-semibold text-gray-600"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                type={oldPassword.toggle ? "text" : "password"}
                name="oldPassword"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800"
                value={oldPassword.value}
                onChange={(e) =>
                  setOldPassword({ ...oldPassword, value: e.target.value })
                }
                placeholder="Enter your old password"
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
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
                  }`}
                ></i>
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="newPassword"
              className="text-sm font-semibold text-gray-600"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={newPassword.toggle ? "text" : "password"}
                name="newPassword"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800"
                value={newPassword.value}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, value: e.target.value })
                }
                placeholder="Enter your new password"
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
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
                  }`}
                ></i>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
