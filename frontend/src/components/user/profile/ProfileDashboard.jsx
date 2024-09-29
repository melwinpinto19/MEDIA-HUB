import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { login } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import HamburgerMenu from "../utils/Hamburger";
import { ThemeToggler } from "../utils";
import { Loader } from "../../../utils";
import { toast } from "react-toastify";
import { getCurrrentDate } from "../../../utils/DateUtil";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dark = useSelector((state) => state.mode.value);
  const userExists = useSelector((state) => state.auth.isLoggedIn);

  // initial check up to see if the user is logged in or not
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

  if (!isLoggedIn) return <Loader type={1} />;

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
