import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMdNotifications } from "react-icons/io";
import { SearchBtn } from "./searchbar";
import {
  useUserContextState,
  useUserContextUpdater,
} from "../contexts/user-context";
import logo from "../assets/images/logo.png";
import { FiLogOut } from "react-icons/fi";
import { useBoolean } from "../hooks";
import { Auth } from "../firebase/authentication";
import { User } from "./user";
import { Image } from "./image";
import { Users } from "../firebase/firestore";
import { useEffect } from "react";
import { NAV_LINKS } from "../utils";

export function Navbar() {
  const { user } = useUserContextState();
  const setUser = useUserContextUpdater();
  const [account, { toggle }] = useBoolean(false);

  useEffect(() => {
    const unsubscribe = Users.getRealtimeCurrentUser(setUser);
    return () => typeof unsubscribe === "function" && unsubscribe();
  }, [setUser]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex w-full bg-white px-5 shadow-md">
        <section className="flex w-1/6 items-center gap-2">
          <div className="h-10 w-10 flex-none">
            <Link to="/">
              <img src={logo} alt="logo" width={40} height={40} />
            </Link>
          </div>
          <SearchBtn />
        </section>
        <menu className="flex flex-grow justify-center text-neutral-500">
          {NAV_LINKS.map(({ label, Icon, to }) => (
            <li key={label} role="menuitem" className="inline-block px-3 py-1">
              <NavLink to={to}>
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`mx-auto text-2xl ${
                        isActive ? "text-blue-500 transition-all" : undefined
                      }`}
                    />
                    <span
                      className={
                        isActive ? "text-blue-500 transition-all" : undefined
                      }
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </menu>
        <section className="flex w-1/6 items-center justify-end">
          <button className="mr-2 h-10 w-10 flex-none rounded-full bg-neutral-200">
            <IoMdNotifications className="mx-auto text-2xl" />
          </button>
          <button onClick={toggle} className="h-10 w-10 flex-none">
            <Image
              publicId={user.profileUrl}
              transform={{ type: "profile-pic", width: 40, height: 40 }}
            />
          </button>
        </section>
      </nav>
      <AccountSettings account={account} user={user} />
    </>
  );
}

function AccountSettings({ account, user }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await Auth.signOut();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <menu
      className={`fixed right-3 z-50 mt-2 w-72 rounded-md bg-white p-2 shadow-2xl ring-1 ring-neutral-200 ${
        account ? "block" : "hidden"
      }`}
    >
      <li
        role="menuitem"
        className="mt-1 mb-3 w-full rounded-md shadow-lg ring-1 ring-neutral-100 transition-all hover:bg-neutral-100"
      >
        <User user={user} />
      </li>
      <button
        role="menuitem"
        className="my-1 flex w-full items-center gap-4 rounded-md py-2 pl-2 text-left text-sm text-neutral-700 transition-all hover:bg-neutral-100"
        onClick={handleLogout}
      >
        <div
          role="presentation"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300 text-2xl"
        >
          <FiLogOut className="text-neutral-700" />
        </div>
        Log Out
      </button>
    </menu>
  );
}
