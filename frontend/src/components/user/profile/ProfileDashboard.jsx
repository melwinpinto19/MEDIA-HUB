import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListItem from "./ListItem";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { login } from "../../../redux/authSlice";
import { useDispatch } from "react-redux";
import { BallTriangle } from "react-loader-spinner";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // initial check up to see if the user is logged in or not
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post("/api/v1/users/get-current-user");
        setIsLoggedIn(true);
        dispatch(login(res.data.user));
      } catch (error) {
        navigate("/login");
        isLoggedIn(false);
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
      <div className="h-screen w-1/4  bg-gray-900">
        <h1 className="text-3xl  text-center text-white mt-4">MEDIA-HUB</h1>
        <ul className="w-full mt-10">
          <ListItem text="Profile" url="/profile/" icon="user" />
          <ListItem
            text="Change password"
            url="/profile/change-password"
            icon="lock"
          />

          <ListItem
            text="Delete account"
            url="/profile/delete-account"
            icon="remove"
          />
        </ul>
      </div>
      <div className="h-screen w-3/4 bg-slate-300">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileDashboard;
