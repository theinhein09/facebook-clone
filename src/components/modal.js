import { useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, toggle }) {
  const modalRef = useRef(document.getElementById("modal"));

  function handleClick(evt) {
    if (evt.target === evt.currentTarget) {
      toggle();
    }
  }
  return createPortal(
    <div
      className="fixed w-screen h-screen top-0 z-50 bg-black/90 backdrop-blur-sm left-0"
      onClick={handleClick}
    >
      {children}
    </div>,
    modalRef.current
  );
}
