import { BiUser } from "react-icons/bi";
import { useBoolean } from "../hooks";
import { Image } from "./image";
import Preview from "./preview";
import CloudinaryUploadWidget from "./upload-profile-pic";

export default function ProfileHeader({ user, actionsBar }) {
  const [profilePicMenu, { toggle: toggleProfilePicMenu }] = useBoolean(false);
  const [viewProfilePic, { toggle: toggleViewProfilePic }] = useBoolean(false);

  return (
    <>
      <section className="w-full mx-auto bg-white shadow">
        <div className="w-8/12 bg-neutral-300 h-96 mx-auto rounded-b-xl relative">
          <button
            onClick={toggleProfilePicMenu}
            className="absolute bottom-0 translate-y-1/2 left-8 rounded-full border-4 bg-black border-white"
          >
            <Image
              publicId={user.profileUrl}
              transform={{ type: "profile-pic", width: 150, height: 150 }}
            />
          </button>
          <menu
            className={`absolute -bottom-16 translate-y-full p-2 bg-white ring-1 ring-neutral-200 rounded-md shadow-2xl z-50 ${
              profilePicMenu ? "block" : "hidden"
            }`}
          >
            <li
              role="menuitem"
              className="text-left w-full py-2 pr-24 pl-2 text-sm text-neutral-700 rounded-md my-1 hover:bg-neutral-100 transition-all flex gap-4 items-center cursor-pointer"
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
            <li
              role="menuitem"
              className="text-left w-full py-2 pr-24 pl-2 text-sm text-neutral-700 rounded-md my-1 hover:bg-neutral-100 transition-all"
            >
              <CloudinaryUploadWidget />
            </li>
          </menu>
        </div>
        <div className="w-8/12 mx-auto flex items-center">
          <div className="ml-52 py-5 text-3xl font-semibold flex-grow">
            {user.username}
          </div>
          <div>{actionsBar}</div>
        </div>
        <hr />
      </section>
      {viewProfilePic ? (
        <Preview toggle={toggleViewProfilePic}>
          <Image publicId={user.profileUrl} transform={{ type: "preview" }} />
        </Preview>
      ) : null}
    </>
  );
}
