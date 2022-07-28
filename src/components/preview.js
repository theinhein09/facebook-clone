import Modal from "./modal";

export default function Preview({ children, toggle }) {
  return (
    <Modal toggle={toggle}>
      <div>
        <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          {children}
        </div>
      </div>
    </Modal>
  );
}
