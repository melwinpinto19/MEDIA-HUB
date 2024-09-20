import React, { useRef } from "react";
import { NavLink } from "react-router-dom";

const ListItem = ({ text, url, icon, listRef, index }) => {
  return (
    <li
      className={` text-white mb-5 w-full justify-center items-center px-4 flex gap-4`}
      ref={(el) => (listRef.current[index] = el)}
    >
      <i className={`fa-solid fa-${icon}`}></i>
      <NavLink to={url} className="text-2xl hover:text-gray-400">
        {text}
      </NavLink>
    </li>
  );
};

export default ListItem;
