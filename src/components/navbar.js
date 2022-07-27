import { NavLink } from "react-router-dom";
import { Searchbar } from "./searchbar";
import { IoMdHome, IoMdNotifications, IoMdMenu } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
export function Navbar() {
  return (
    <header className="">
      <nav className="shadow-md py-2 mb-2 text-xs fixed w-full bg-white top-0 z-50">
        <menu className="mx-auto max-w-fit text-neutral-500">
          <li role="menuitem" className="inline-block px-3 py-1">
            <NavLink to="/">
              {({ isActive }) => (
                <span
                  className={
                    isActive ? "text-blue-500 transition-all" : undefined
                  }
                >
                  <IoMdHome
                    className={`text-2xl mx-auto ${
                      isActive ? "text-blue-500 transition-all" : undefined
                    }`}
                  />
                  Home
                </span>
              )}
            </NavLink>
          </li>
          <li role="menuitem" className="inline-block px-3 py-1">
            <NavLink to="/friends">
              {({ isActive }) => (
                <span
                  className={
                    isActive ? "text-blue-500 transition-all" : undefined
                  }
                >
                  <FaUsers
                    className={`text-2xl mx-auto ${
                      isActive ? "text-blue-500 transition-all" : undefined
                    }`}
                  />
                  Friends
                </span>
              )}
            </NavLink>
          </li>
          <li role="menuitem" className="inline-block px-3 py-1">
            <NavLink to="/notifications">
              {({ isActive }) => (
                <span
                  className={
                    isActive ? "text-blue-500 transition-all" : undefined
                  }
                >
                  <IoMdNotifications
                    className={`text-2xl mx-auto ${
                      isActive ? "text-blue-500 transition-all" : undefined
                    }`}
                  />
                  Notifications
                </span>
              )}
            </NavLink>
          </li>
          <li role="menuitem" className="inline-block px-3 py-1">
            <NavLink to="/menu">
              {({ isActive }) => (
                <span
                  className={
                    isActive ? "text-blue-500 transition-all" : undefined
                  }
                >
                  <IoMdMenu
                    className={`text-2xl mx-auto ${
                      isActive ? "text-blue-500 transition-all" : undefined
                    }`}
                  />
                  Menu
                </span>
              )}
            </NavLink>
          </li>
        </menu>
      </nav>
      <div role="presentation" className="mx-auto max-w-fit">
        <Searchbar />
      </div>
    </header>
  );
}
