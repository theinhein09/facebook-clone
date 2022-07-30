import { Layout } from "../components/layout";
import { useUserContextState } from "../contexts/user-context";
import { useBoolean } from "../hooks";
import { BiUser } from "react-icons/bi";
import CloudinaryUploadWidget from "../components/upload-profile-pic";
import { Image } from "../components/image";
import Preview from "../components/preview";
export function User() {
  const { user } = useUserContextState();
  const [profilePic, { toggle }] = useBoolean(false);
  const [viewProfilePic, { toggle: toggleViewProfilePic }] = useBoolean(false);

  return (
    <>
      <Layout>
        <section className="w-full mx-auto bg-white shadow">
          <div className="w-8/12 bg-neutral-300 h-96 mx-auto rounded-b-xl relative">
            <button
              onClick={toggle}
              className="absolute bottom-0 translate-y-1/2 left-8 rounded-full border-4 bg-black border-white"
            >
              <Image
                publicId={user.profileUrl}
                transform={{ type: "profile-pic", width: 150, height: 150 }}
              />
            </button>
            <menu
              className={`absolute -bottom-16 translate-y-full p-2 bg-white ring-1 ring-neutral-200 rounded-md shadow-2xl z-50 ${
                profilePic ? "block" : "hidden"
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
          <div className="w-8/12 mx-auto">
            <div className="ml-48 py-5 text-3xl font-semibold">
              {user.username}
            </div>
          </div>
          <hr />
        </section>
      </Layout>
      {viewProfilePic ? (
        <Preview toggle={toggleViewProfilePic}>
          <Image publicId={user.profileUrl} transform={{ type: "preview" }} />
        </Preview>
      ) : null}
    </>
  );
}
