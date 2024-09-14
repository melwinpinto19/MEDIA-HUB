import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Login, Register } from "./components/user";
import {
  ProfileDashboard,
  UserInfo,
  ChangePassword,
  UserProfile,
} from "./components/user/profile";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { login, logout } from "./redux/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteAccount from "./components/user/profile/DeleteUser";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>

      <Route path="/profile/" element={<ProfileDashboard />}>
        <Route path="" element={<UserInfo authRequired={true} />}></Route>
        <Route path="change-password" element={<ChangePassword />}></Route>
        <Route path="delete-account" element={<DeleteAccount />}></Route>
      </Route>

      {/* <Route path="/dummy" element={<HomePage />}></Route> */}

      <Route path="/user/:username" element={<UserProfile />}></Route>
    </>
  )
);

function App() {
  const dark = useSelector((state) => state.mode.value);

  return (
    <>
      <ToastContainer autoClose={2000} theme={`${dark ? "dark" : "light"}`} />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
