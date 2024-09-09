import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";

export default function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Please enter your password to confirm.");
      return;
    }

    try {
      setLoading(true);
      // Send DELETE request with the user's password
      const res = await axios.delete("/api/v1/users/delete-account", {
        data: { password },
      });

      toast.success("Your account has been deleted successfully.");
      setTimeout(() => {
        dispatch(logout());
        navigate("/login"); // Example redirect after deletion
      }, 2000);

      console.log(res);
      // Optionally, log out the user or redirect them
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete the account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Delete Account
        </h2>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Enter your password to confirm account deletion.
        </p>
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:border-red-500 bg-gray-100 text-gray-800"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleDeleteAccount}
          className={`w-full mt-6 py-3 rounded-lg font-semibold transition duration-300 ${
            loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          } text-white`}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
