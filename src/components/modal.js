import { useRef } from "react";
import { createPortal } from "react-dom";

export function Modal({ children, toggle, bgColor }) {
  const modalRef = useRef(document.getElementById("modal"));

  function handleClick(evt) {
    if (evt.target === evt.currentTarget) {
      typeof toggle === "function" && toggle();
    }
  }
  return createPortal(
    <div
      className={`fixed top-0 left-0 z-50 h-screen  w-screen backdrop-blur-sm ${bgColor}`}
      onClick={handleClick}
    >
      {children}
    </div>,
    modalRef.current
  );
}

Modal.defaultProps = {
  bgColor: "bg-black/90",
};
