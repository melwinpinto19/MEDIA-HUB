import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import ListItem from "./ListItem";
import axios from "axios";
import { login } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { BallTriangle } from "react-loader-spinner";
import HamburgerMenu from "../utils/Hamburger";
import { ThemeToggler } from "../utils";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dark = useSelector((state) => state.mode.value);

  // initial check up to see if the user is logged in or not
  useEffect(() => {
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

  if (!isLoggedIn)
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

  return (
    <div className="h-screen w-full flex">
      {alert}
      <ThemeToggler />
      <HamburgerMenu />
      <div
        className={`h-screen w-full ${dark ? "bg-gray-800" : "bg-slate-300 "}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileDashboard;
