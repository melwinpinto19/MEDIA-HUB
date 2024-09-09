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
    </>
  )
);

function App() {
  const dispatch = useDispatch();

  // initial checking to see if the user is already logged in or not :
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post("/api/v1/users/get-current-user");
        res.status >= 200 && res.status <= 300
          ? dispatch(login(res.data.user))
          : "";
      } catch (error) {}
    })();
  }, []);
  return (
    <>
      <ToastContainer autoClose={2000} theme="dark" />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
