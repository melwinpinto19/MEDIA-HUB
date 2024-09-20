import React from "react";
import { NavLink } from "react-router-dom";
const HomeLink = ({ text, url, icon }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <NavLink to={url} className="">
        <i className={`fa-solid fa-${icon}`}></i>
      </NavLink>
      <NavLink to={url} className="">
        {text}
      </NavLink>
    </div>
  );
};

export default HomeLink;
