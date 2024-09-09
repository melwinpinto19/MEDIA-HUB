import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Alert({ type = "info", message }) {
  const refer = useRef();
  const alertStyles = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
  };

  const iconStyles = {
    success: (
      <lord-icon
        src="https://cdn.lordicon.com/cgzlioyf.json"
        trigger="hover"
        className="w-10 h-10"
      ></lord-icon>
    ),
    error: (
      <lord-icon
        src="https://cdn.lordicon.com/usownftb.json"
        trigger="hover"
        className="w-10 h-10"
      ></lord-icon>
    ),
    warning: (
      <lord-icon
        src="https://cdn.lordicon.com/usownftb.json"
        trigger="hover"
        className="w-10 h-10"
      ></lord-icon>
    ),
    info: (
      <lord-icon
        src="https://cdn.lordicon.com/ygvjgdmk.json"
        trigger="hover"
        className="w-10 h-10"
      ></lord-icon>
    ),
  };

  useGSAP(() => {
    gsap.to(refer.current, {
      x: -150,
      duration: 1,
    });
  });

  return (
    <div
      className={`flex items-center gap-10 p-4 border-l-4 rounded-sm shadow-lg max-w-lg mx-auto fixed top-10 right-6 ${alertStyles[type]} w-96`}
      role="alert"
      ref={refer}
    >
      {iconStyles[type]}
      <div>
        <p className="font-semibold text-lg">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
        <p>{message}</p>
      </div>
    </div>
  );
}
