import React, { useState, useEffect } from "react";
import { HomeLink } from "./index";
import { Outlet } from "react-router";
import { ThemeToggler } from "../user/utils";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, Logo } from "../../utils";
import { getCurrrentDate } from "../../utils/DateUtil";
import { toast } from "react-toastify";
import { Navbar } from "./index";

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
    const { hours, minutes } = getCurrrentDate();
    if (hours > 22)
      toast.info("Bed Time", { position: "top-center", autoClose: 500 });
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
        className={`w-full h-screen ${
          isDarkMode ? "bg-slate-950" : "bg-white"
        }`}
      >
        <Navbar />
        <ThemeToggler />
        {/* <Logo style="fixed left-2 " /> */}
        <div
          className={`w-full ${
            isDarkMode ? "bg-slate-950" : "bg-white"
          } overflow-auto`}
          style={{ height: "92vh" }}
        >
          <Outlet />
        </div>
        <div
          className="w-screen fixed bottom-0 flex items-center justify-center gap-7"
          style={{ height: "8vh", background: "#48CFCB" }}
        >
          <HomeLink text="search" url="/home" icon="magnifying-glass" />
          <HomeLink text="create video" url="/home/create-video" icon="plus" />
          <HomeLink text="playlists" url="/home/playlist" icon="list" />
          <HomeLink text="Profile" url="/profile" icon="user" />
          <HomeLink text="videos" url="/home/videos" icon="video" />
          <HomeLink
            text="Watch History"
            url="/home/watch-history"
            icon="clock-rotate-left"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
