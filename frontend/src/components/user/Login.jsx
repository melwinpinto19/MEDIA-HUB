import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/authSlice";
import { toast } from "react-toastify";
import { ThemeToggler } from "./utils";
import HamburgerMenu from "./utils/Hamburger";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dark = useSelector((state) => state.mode.value);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.post("/api/v1/users/login", formData);
        console.log(res);
        toast.success("Logged in successfully");
        setTimeout(() => {
          res?.status >= 200 && res?.status <= 300
            ? navigate("/profile")
            : null;
        }, 3000);
      } catch (error) {
        toast.error("Failed to login");
        console.log(error);
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        dark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <ThemeToggler />
      <div
        className={`p-8 rounded-lg shadow-lg max-w-md w-full ${
          dark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold text-center ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              className={`block font-semibold ${
                dark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-2 p-3 w-full rounded-lg border ${
                errors.email
                  ? "border-red-500"
                  : dark
                  ? "border-gray-700"
                  : "border-gray-300"
              } focus:outline-none ${
                dark
                  ? "focus:border-indigo-500 bg-gray-700 text-white"
                  : "focus:border-indigo-500 bg-gray-100 text-gray-900"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`block font-semibold ${
                dark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-2 p-3 w-full rounded-lg border ${
                errors.username
                  ? "border-red-500"
                  : dark
                  ? "border-gray-700"
                  : "border-gray-300"
              } focus:outline-none ${
                dark
                  ? "focus:border-indigo-500 bg-gray-700 text-white"
                  : "focus:border-indigo-500 bg-gray-100 text-gray-900"
              }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className={`block font-semibold ${
                dark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-2 p-3 w-full rounded-lg border ${
                errors.password
                  ? "border-red-500"
                  : dark
                  ? "border-gray-700"
                  : "border-gray-300"
              } focus:outline-none ${
                dark
                  ? "focus:border-indigo-500 bg-gray-700 text-white"
                  : "focus:border-indigo-500 bg-gray-100 text-gray-900"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              dark
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            Login
          </button>
        </form>
        <p
          className={`text-sm text-center mt-4 ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Don't have an account?{" "}
          <Link
            className={`${
              dark
                ? "text-indigo-500 hover:underline"
                : "text-indigo-600 hover:underline"
            }`}
            to="/register"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
