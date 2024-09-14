import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const ListItem = ({ text, url, icon }) => {
  return (
    <li
      className={` text-white mb-5 w-full justify-center items-center px-4 flex gap-4`}
    >
      <i className={`fa-solid fa-${icon}`}></i>
      <NavLink to={url} className="text-2xl hover:text-gray-400">
        {text}
      </NavLink>
    </li>
  );
};

export default ListItem;
