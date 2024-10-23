import React from "react";
import { HomeSearch } from "./index";
import { Logo } from "../../utils";
import { useSelector } from "react-redux";

const Navbar = () => {
  const dark = useSelector((state) => state.mode.value);
  return (
    <nav className={`${dark ? "bg-black" : "bg-white"} px-1 py-3 shadow-md`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Logo />
        </div>

        {/* Search Bar */}
        <HomeSearch />

        {/* User Profile Section */}
        <div className="flex items-center space-x-4"></div>
      </div>

      {/* Search Bar for Mobile */}
      <div className="mt-4 md:hidden">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>
    </nav>
  );
};

export default Navbar;
