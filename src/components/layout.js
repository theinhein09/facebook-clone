import { Navbar } from "./navbar";
import { Searchbar } from "./searchbar";

export function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div role="presentation" className="mx-auto max-w-fit mt-8">
        <Searchbar />
      </div>
      <main>{children}</main>
    </>
  );
}
