import { NavLink } from "react-router-dom";
import { IoMdHome, IoMdNotifications, IoMdMenu } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { Searchbar } from "./searchbar";
import { useUserContextState } from "../contexts/user-context";
export function Navbar() {
  const { user } = useUserContextState();
  return (
    <nav className="shadow-md fixed w-full bg-white top-0 z-50 flex">
      <section className="flex items-center w-1/6">
        <h1 className="text-3xl">f</h1>
        <Searchbar />
      </section>
      <menu className="flex-grow text-neutral-500 flex justify-center">
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
      <section className="w-1/6 px-3 flex items-center justify-end">
        <button className="bg-neutral-200 w-10 h-10 rounded-full mr-2">
          A
        </button>
        <button className="bg-neutral-200 w-10 h-10 rounded-full mr-2">
          A
        </button>
        <button className="bg-neutral-200 w-10 h-10 rounded-full mr-2">
          A
        </button>
        <button className="bg-neutral-200 w-10 h-10 rounded-full">
          <img
            src={user.profileUrl}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-[100%] object-center aspect-square"
          />
        </button>
      </section>
    </nav>
  );
}
