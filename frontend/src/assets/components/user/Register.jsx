import axios from "axios";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const [errors, setErrors] = useState({});
  const formRef = useRef();

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

    // Username validation
    if (!formData.fullname) {
      newErrors.fullname = "Fullname is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Avatar validation
    if (!formData.avatar) {
      newErrors.avatar = "Avatar is required";
    }

    // Cover Image validation
    if (!formData.coverImage) {
      newErrors.coverImage = "Cover image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar" || name === "coverImage") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData(formRef.current);
        const res = await axios.post("/api/v1/users/register", formData);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mt-6"
          method="post"
          encType="multipart/form-data"
          ref={formRef}
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-2 p-3 w-full rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-indigo-500`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-2 p-3 w-full rounded-lg border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-indigo-500`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Fullname
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={`mt-2 p-3 w-full rounded-lg border ${
                errors.fullname ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-indigo-500`}
              placeholder="Enter your fullname"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-2 p-3 w-full rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-indigo-500`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Avatar</label>
            <label className="block bg-indigo-600 text-white py-2 px-4 rounded-lg text-center cursor-pointer hover:bg-indigo-700 transition duration-300">
              Upload Avatar
              <input
                type="file"
                name="avatar"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {errors.avatar && (
              <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
            )}
            {formData.avatar && (
              <p className="text-sm text-gray-600 mt-1">
                {formData.avatar[0]?.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold">
              Cover Image
            </label>
            <label className="block bg-indigo-600 text-white py-2 px-4 rounded-lg text-center cursor-pointer hover:bg-indigo-700 transition duration-300">
              Upload Cover Image
              <input
                type="file"
                name="coverImage"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {errors.coverImage && (
              <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
            )}
            {formData.coverImage && (
              <p className="text-sm text-gray-600 mt-1">
                {formData.coverImage[0]?.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link className="text-indigo-600 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
