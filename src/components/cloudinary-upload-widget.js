import { useEffect, useState } from "react";
import { TbPhoto } from "react-icons/tb";
import { useUserContextState } from "../contexts/user-context";
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
          <div role="presentation" className="my-3 px-2">
            <button
              onClick={handleUpload}
              className="w-full rounded py-4 px-3 text-left text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 transition-all hover:bg-neutral-200"
            >
              Add to your post
            </button>
          </div>
        );

      case "profile-pic":
        return (
          <button className="flex items-center gap-4" onClick={handleUpload}>
            <div
              role="presentation"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300 text-2xl"
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
