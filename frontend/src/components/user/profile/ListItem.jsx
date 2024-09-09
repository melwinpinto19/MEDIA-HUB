import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const ListItem = ({ text, url, icon }) => {
  return (
    <li
      className={`w-full h-10 bg-red-500 mb-5 flex justify-between items-center px-4`}
    >
      <i className={`fa-solid fa-${icon}`}></i>
      <NavLink to={url}>{text}</NavLink>
    </li>
  );
};

export default ListItem;
