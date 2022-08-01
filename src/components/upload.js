import { useEffect, useState } from "react";
import { TbPhoto } from "react-icons/tb";
import {
  useUserContextState,
  useUserContextUpdater,
} from "../contexts/user-context";
import { Users } from "../firebase/firestore";
import { CLOUDINARY_UPLOAD_WIDGET_DEF_CONFIG } from "../utils";

function createWidget({ options, type }) {
  let config = {};

  switch (type) {
    case "feed-images":
      const media = [];

      config = {
        ...CLOUDINARY_UPLOAD_WIDGET_DEF_CONFIG,
        folder: options.folder,
        multiple: true,
        maxFiles: 5,
        clientAllowedFormats: ["webp", "gif", "jpg", "png", "jpeg"],
        resourceType: "image",
      };

      return {
        widget: window.cloudinary.createUploadWidget(
          config,
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Done! Here is the image info: ", result.info);
              media.push(result.info.public_id);
            }
          }
        ),
        media,
      };
    case "profile-pic":
      let profileUrl;
      config = {
        ...CLOUDINARY_UPLOAD_WIDGET_DEF_CONFIG,
        folder: options.folder,
        cropping: true,
        clientAllowedFormats: ["webp", "gif", "jpg", "png", "jpeg"],
        resourceType: "image",
      };
      return {
        widget: window.cloudinary.createUploadWidget(
          config,
          async (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Done! Here is the image info: ", result.info);
              profileUrl = result.info.public_id;
              await Users.updateUser(options.folder, {
                profileUrl,
              });
            }
          }
        ),
      };
    default:
      throw new Error("ERROR IN CREATING WIDGET");
  }
}

export function CloudinaryUploadWidget({ setPost, type = "feed-images" }) {
  const { user } = useUserContextState();
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    return () => widget && widget.destroy();
  }, [widget]);

  async function handleUpload(evt) {
    evt.preventDefault();
    switch (type) {
      case "feed-images":
        const { widget, media } = createWidget({
          options: { folder: user.id },
          type,
        });
        widget.open();
        setWidget(widget);
        setPost((post) => ({
          ...post,
          media,
        }));
        break;
      case "profile-pic":
        const { widget: profilePicWidget } = createWidget({
          options: { folder: user.id },
          type,
        });
        profilePicWidget.open();
        setWidget(profilePicWidget);

        break;
      default:
        throw new Error("ERROR IN HANDLE UPLOAD");
    }
  }

  function renderUploadBtn(type) {
    switch (type) {
      case "feed-images":
        return (
          <div role="presentation" className="px-2 my-3">
            <button
              onClick={handleUpload}
              className="transition-all text-sm w-full py-4 rounded ring-1 ring-neutral-300 text-left px-3 text-neutral-700 font-medium hover:bg-neutral-200"
            >
              Add to your post
            </button>
          </div>
        );

      case "profile-pic":
        return (
          <button className="flex gap-4 items-center" onClick={handleUpload}>
            <div
              role="presentation"
              className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-2xl"
            >
              <TbPhoto className="text-neutral-700" />
            </div>
            Update profile picture
          </button>
        );
      default:
        return null;
    }
  }

  return renderUploadBtn(type);
}
