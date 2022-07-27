import { Link } from "react-router-dom";
import { Searchbar } from "./searchbar";

export function Navbar() {
  return (
    <nav className="shadow-md py-2 mb-2 text-sm">
      <menu className="mx-auto max-w-fit">
        <li role="menuitem" className="inline-block px-3 py-1">
          <Link to="/">Home</Link>
        </li>
        <li role="menuitem" className="inline-block px-3 py-1">
          <Link to="/friends">Friends</Link>
        </li>
        <li role="menuitem" className="inline-block px-3 py-1">
          <Link to="/notifications">Notifications</Link>
        </li>
        <li role="menuitem" className="inline-block px-3 py-1">
          <Link to="/menu">Menu</Link>
        </li>
        <Searchbar />
      </menu>
    </nav>
  );
}
