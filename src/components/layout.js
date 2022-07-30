import { Navbar } from "./navbar";

export function Layout({ children }) {
  return (
    <div role="presentation" className="bg-neutral-200">
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
