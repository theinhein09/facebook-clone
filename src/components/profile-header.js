import { BiUser } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { useUserContextState } from "../contexts/user-context";
import { useBoolean } from "../hooks";
import { Image } from "./image";
import Preview from "./preview";
import { CloudinaryUploadWidget } from "./upload";

export function ProfileHeader({ user, actionsBar }) {
  const { user: currentUser } = useUserContextState();
  const [profilePicMenu, { toggle: toggleProfilePicMenu }] = useBoolean(false);
  const [viewProfilePic, { toggle: toggleViewProfilePic }] = useBoolean(false);

  return (
    <>
      <section className="w-full mx-auto bg-white shadow">
        <div className="max-w-6xl h-56 md:h-96 mx-auto md:rounded-b-xl bg-gradient-to-t from-black to-neutral-300"></div>
        <div className="max-w-6xl mx-auto flex items-end -mt-7 px-10">
          <div className="relative">
            <button
              onClick={toggleProfilePicMenu}
              className="rounded-full border-4 bg-black border-white"
            >
              <Image
                publicId={user.profileUrl}
                transform={{ type: "profile-pic", width: 150, height: 150 }}
              />
            </button>
            <menu
              className={`absolute bottom-0 min-w-fit whitespace-nowrap translate-y-full p-2 bg-white ring-1 ring-neutral-200 rounded-md shadow-2xl z-50 ${
                profilePicMenu ? "block" : "hidden"
              }`}
            >
              <li
                role="menuitem"
                className="py-2 pr-24 pl-2 text-sm text-neutral-700 rounded-md my-1 hover:bg-neutral-100 transition-all flex gap-4 items-center cursor-pointer"
                onClick={toggleViewProfilePic}
              >
                <div
                  role="presentation"
                  className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-2xl "
                >
                  <BiUser className="text-neutral-700" />
                </div>
                View profile picture
              </li>
              {currentUser.id === user.id ? (
                <li
                  role="menuitem"
                  className="py-2 pr-24 pl-2 text-sm text-neutral-700 rounded-md my-1 hover:bg-neutral-100 transition-all"
                >
                  <CloudinaryUploadWidget type="profile-pic" />
                </li>
              ) : null}
            </menu>
          </div>
          <div className="py-5 pl-3 text-3xl font-semibold flex-grow">
            {user.username}
          </div>
          <div>{actionsBar}</div>
        </div>
        <hr className="my-4 max-w-5xl mx-auto" />
        <div className="max-w-6xl px-10 mx-auto">
          <nav>
            <NavLink to={`/${user.id}/posts`}>
              {({ isActive }) => (
                <span
                  className={`px-5 pb-4 inline-block ${
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
                  className={`px-5 pb-4 inline-block ${
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
