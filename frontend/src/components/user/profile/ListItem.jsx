import React, { useRef } from "react";
import { NavLink } from "react-router-dom";

const ListItem = ({ text, url, icon, listRef, index }) => {
  return (
    <li
      className={` text-white mb-5 w-full justify-center items-center px-4 flex gap-4`}
      ref={(el) => (listRef.current[index] = el)}
    >
      <NavLink to={url} className="text-2xl hover:text-gray-400">
        <i className={`fa-solid fa-${icon}`}></i>
      </NavLink>

      <NavLink to={url} className="text-2xl hover:text-gray-400 max-[768px]:hidden">
        {text}
      </NavLink>
    </li>
  );
};

export default ListItem;
