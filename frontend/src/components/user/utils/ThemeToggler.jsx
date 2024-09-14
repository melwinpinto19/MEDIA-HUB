import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../../../redux/modeSlice";

const ThemeToggler = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.mode.value);

  const styles = {
    bgCss: isDark
      ? "bg-gray-800 text-white border-gray-600"
      : "bg-gray-200 text-gray-800 border-gray-400",
    text: isDark ? "🌙 Dark Mode" : "☀️ Light Mode",
  };

  const handleToggle = () => {
    dispatch(toggleMode());
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full border-2 fixed top-4 right-4 ${styles.bgCss} transition duration-300 z-40`}
    >
      {styles.text}
    </button>
  );
};

export default ThemeToggler;
