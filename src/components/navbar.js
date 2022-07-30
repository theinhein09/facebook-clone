import { NavLink, useNavigate } from "react-router-dom";
import { IoMdHome, IoMdNotifications, IoMdMenu } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { Searchbar } from "./searchbar";
import { useUserContextState } from "../contexts/user-context";
import logo from "../assets/images/logo.png";
import { RiSettings5Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { useBoolean } from "../hooks";
import { auth } from "../firebase/authentication";
import { User } from "./user";
import { Image } from "./image";
export function Navbar() {
  const { user } = useUserContextState();
  const [account, { toggle }] = useBoolean(false);
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await auth._signOut();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <nav className="shadow-md fixed w-full bg-white top-0 z-50 flex px-5">
        <section className="flex items-center w-1/6 gap-2">
          <div className="w-10 h-10 flex-none">
            <img src={logo} alt="logo" width={40} height={40} />
          </div>
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
            <IoMdNotifications className="text-2xl mx-auto" />
          </button>
          <button onClick={toggle} className="w-10 h-10 flex-none">
            <Image
              publicId={user.profileUrl}
              transform={{ type: "profile-pic", width: 40, height: 40 }}
            />
          </button>
        </section>
      </nav>
      <menu
        className={`right-3 mt-16 fixed p-2 bg-white ring-1 ring-neutral-200 rounded-md shadow-2xl z-50 ${
          account ? "block" : "hidden"
        }`}
      >
        <li
          role="menuitem"
          className="text-left w-full py-2 pr-28 pl-2 text-sm text-neutral-700 rounded-md my-1 hover:bg-neutral-100 transition-all flex gap-4 items-center cursor-pointer shadow-lg ring-1 ring-neutral-100"
          onClick={() => navigate("/user")}
        >
          <User user={user} />
        </li>
        <li
          role="menuitem"
          className="text-left w-full py-2 pr-28 pl-2 text-sm text-neutral-700 rounded-md my-1 hover:bg-neutral-100 transition-all flex gap-4 items-center cursor-pointer"
        >
          <div
            role="presentation"
            className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-2xl "
          >
            <RiSettings5Fill className="text-neutral-700" />
          </div>
          Settings
        </li>
        <li
          role="menuitem"
          className="text-left w-full py-2 pr-28 pl-2 text-sm text-neutral-700 rounded-md my-1 hover:bg-neutral-100 transition-all flex gap-4 items-center cursor-pointer"
          onClick={handleLogout}
        >
          <div
            role="presentation"
            className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-2xl"
          >
            <FiLogOut className="text-neutral-700" />
          </div>
          Log Out
        </li>
      </menu>
    </>
  );
}
