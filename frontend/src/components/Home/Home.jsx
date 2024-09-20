import React, { useState, useEffect } from "react";
import { HomeLink } from "./index";
import { Outlet } from "react-router";
import { ThemeToggler } from "../user/utils";
import { BallTriangle } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, Logo } from "../../utils";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userExists = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.mode.value);

  useEffect(() => {
    if (userExists) {
      setIsLoggedIn(true);
      return;
    }
    (async () => {
      try {
        const res = await axios.post("/api/v1/users/get-current-user");
        const user = await axios.post("/api/v1/users/get-user-profile", {
          username: res?.data?.user?.username,
        });
        setIsLoggedIn(true);
        dispatch(login(user.data));
      } catch (error) {
        navigate("/login");
        setIsLoggedIn(false);
      }
    })();
  }, []);

  if (!isLoggedIn) {
    return <Loader type={1} />;
  }
  return (
    <>
      <div
        className={`w-full h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <ThemeToggler />
        <Logo style="fixed left-2" />
        <div
          className={`w-full ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          } overflow-auto`}
          style={{ height: "92vh" }}
        >
          <Outlet />
        </div>
        <div
          className="w-screen  flex items-center justify-center gap-5"
          style={{ height: "8vh", background: "#48CFCB" }}
        >
          <HomeLink text="search" url="/home" icon="magnifying-glass" />
          <HomeLink text="create video" url="/home/create-video" icon="plus" />
          <HomeLink text="playlists" url="/home/playlist" icon="list" />
          <HomeLink text="Profile" url="/profile" icon="user" />
          <HomeLink text="videos" url="/home/videos" icon="video" />
        </div>
      </div>
    </>
  );
};

export default Home;
