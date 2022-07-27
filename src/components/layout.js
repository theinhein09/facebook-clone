import { Navbar } from "./navbar";
import { Searchbar } from "./searchbar";

export function Layout({ children }) {
  return (
    <div role="presentation" className="bg-neutral-200">
      <Navbar />
      <div role="presentation" className="mx-auto max-w-fit pt-20">
        <Searchbar />
      </div>
      <main>{children}</main>
    </div>
  );
}
