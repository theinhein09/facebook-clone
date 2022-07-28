export default function Preview({ children, toggle }) {
  return (
    <div
      className="fixed w-screen h-screen top-0 z-50 bg-black/90 backdrop-blur-sm left-0"
      onClick={toggle}
    >
      <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
}
