import Dialog from "./dialog";
import Modal from "./modal";

export default function Preview({ children, toggle }) {
  return (
    <Modal toggle={toggle}>
      <Dialog>{children}</Dialog>
    </Modal>
  );
}
