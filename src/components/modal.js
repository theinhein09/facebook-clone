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
      className={`fixed w-screen h-screen top-0 z-50  backdrop-blur-sm left-0 ${bgColor}`}
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
