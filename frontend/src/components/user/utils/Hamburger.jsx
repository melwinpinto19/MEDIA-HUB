// HamburgerMenu.js
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ListItem from "../profile/ListItem";
import { useSelector } from "react-redux";

const HamburgerMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const dark = useSelector((state) => state.mode.value);

  useEffect(() => {
    if (menuOpen) {
      gsap.to(menuRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
    } else {
      gsap.to(menuRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  return (
    <>
      <div
        className="fixed top-5 left-5 z-50 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div
          className={`w-8 h-1 z-50 ${
            dark ? "bg-white" : "bg-black"
          } my-1 transition-transform ${
            menuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></div>
        <div
          className={`w-8 h-1  z-50 ${
            dark ? "bg-white" : "bg-black"
          } my-1 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
        ></div>
        <div
          className={`w-8 h-1   z-50 ${
            dark ? "bg-white" : "bg-black"
          } my-1 transition-transform ${
            menuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></div>
      </div>

      <nav
        ref={menuRef}
        className="fixed top-0 left-0 h-screen w-1/4 bg-red-800 text-white flex justify-center items-center transform -translate-x-full z-40"
      >
        <h2 className="absolute top-5 text-center text-3xl">MEDIA HUB</h2>
        <ul className="space-y-6 text-center">
          {[
            {
              text: "Home",
              url: "/",
              icon: "home",
            },
            {
              text: "User Profile",
              url: "/profile/",
              icon: "user",
            },
            {
              text: "Change Password",
              url: "/profile/change-password",
              icon: "lock",
            },
            {
              text: "Delete Account",
              url: "/profile/delete-account",
              icon: "trash",
            },
          ].map(({ text, url, icon }, index) => (
            <ListItem text={text} url={url} icon={icon} key={index} />
          ))}
        </ul>
      </nav>
    </>
  );
};

export default HamburgerMenu;
