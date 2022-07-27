import { Link } from "react-router-dom";
import { Searchbar } from "./searchbar";
import { IoMdHome, IoMdNotifications, IoMdMenu } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
export function Navbar() {
  return (
    <header>
      <nav className="shadow-md py-2 mb-2 text-sm">
        <menu className="mx-auto max-w-fit">
          <li role="menuitem" className="inline-block px-3 py-1">
            <Link to="/">
              <IoMdHome className="text-2xl mx-auto" />
              Home
            </Link>
          </li>
          <li role="menuitem" className="inline-block px-3 py-1">
            <Link to="/friends">
              <FaUsers className="text-2xl mx-auto" />
              Friends
            </Link>
          </li>
          <li role="menuitem" className="inline-block px-3 py-1">
            <Link to="/notifications">
              <IoMdNotifications className="text-2xl mx-auto" />
              Notifications
            </Link>
          </li>
          <li role="menuitem" className="inline-block px-3 py-1">
            <Link to="/menu">
              <IoMdMenu className="text-2xl mx-auto" />
              Menu
            </Link>
          </li>
        </menu>
      </nav>
      <div role="presentation" className="mx-auto max-w-fit">
        <Searchbar />
      </div>
    </header>
  );
}
