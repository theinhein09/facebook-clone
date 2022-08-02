import { BiUser } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { useUserContextState } from "../contexts/user-context";
import { useBoolean } from "../hooks";
import { Image } from "./image";
import Preview from "./preview";
import { CloudinaryUploadWidget } from "./cloudinary-upload-widget";

export function ProfileHeader({ user, actionsBar }) {
  const { user: currentUser } = useUserContextState();
  const [profilePicMenu, { toggle: toggleProfilePicMenu }] = useBoolean(false);
  const [viewProfilePic, { toggle: toggleViewProfilePic }] = useBoolean(false);

  return (
    <>
      <section className="mx-auto w-full bg-white shadow">
        <div className="mx-auto h-56 max-w-6xl bg-gradient-to-t from-black to-neutral-300 md:h-96 md:rounded-b-xl"></div>
        <div className="mx-auto -mt-7 flex max-w-6xl items-end px-1 md:px-10">
          <div className="relative">
            <button
              onClick={toggleProfilePicMenu}
              className="rounded-full border-4 border-white bg-black"
            >
              <Image
                publicId={user.profileUrl}
                transform={{ type: "profile-pic", width: 150, height: 150 }}
              />
            </button>
            <menu
              className={`absolute bottom-0 z-50 min-w-fit translate-y-full whitespace-nowrap rounded-md bg-white p-2 shadow-2xl ring-1 ring-neutral-200 ${
                profilePicMenu ? "block" : "hidden"
              }`}
            >
              <li
                role="menuitem"
                className="my-1 flex cursor-pointer items-center gap-4 rounded-md py-2 pr-24 pl-2 text-sm text-neutral-700 transition-all hover:bg-neutral-100"
                onClick={toggleViewProfilePic}
              >
                <div
                  role="presentation"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300 text-2xl "
                >
                  <BiUser className="text-neutral-700" />
                </div>
                View profile picture
              </li>
              {currentUser.id === user.id ? (
                <li
                  role="menuitem"
                  className="my-1 rounded-md py-2 pr-24 pl-2 text-sm text-neutral-700 transition-all hover:bg-neutral-100"
                >
                  <CloudinaryUploadWidget type="profile-pic" />
                </li>
              ) : null}
            </menu>
          </div>
          <div className="flex-grow py-5 pl-3 text-3xl font-semibold">
            {user.username}
          </div>
          <div>{actionsBar}</div>
        </div>
        <hr className="my-4 mx-auto max-w-5xl" />
        <div className="mx-auto max-w-6xl px-1 md:px-10">
          <nav>
            <NavLink to={`/${user.id}/posts`}>
              {({ isActive }) => (
                <span
                  className={`inline-block px-5 pb-4 ${
                    isActive ? "text-blue-500 transition-all" : undefined
                  }`}
                >
                  Posts
                </span>
              )}
            </NavLink>
            <NavLink to={`/${user.id}/about`}>
              {({ isActive }) => (
                <span
                  className={`inline-block px-5 pb-4 ${
                    isActive ? "text-blue-500 transition-all" : undefined
                  }`}
                >
                  About
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </section>
      {viewProfilePic ? (
        <Preview toggle={toggleViewProfilePic}>
          <Image publicId={user.profileUrl} />
        </Preview>
      ) : null}
    </>
  );
}
