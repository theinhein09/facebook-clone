import { useEffect, useRef } from "react";
import { CLOUDINARY_UPLOAD_WIDGET_DEF_CONFIG } from "../utils";

function createWidget({ options, type }) {
  const media = [];
  switch (type) {
    case "feed-images":
      const config = {
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
    default:
      throw new Error("ERROR IN CREATING WIDGET");
  }
}

export default function CloudinaryUploadWidget({ setPost, folder }) {
  const widget = useRef(null);

  useEffect(() => {
    if (widget.current === null) return;
    const currentWidget = widget.current;
    return () => currentWidget.destroy();
  }, []);

  function handleUpload(evt) {
    evt.preventDefault();
    const { widget, media } = createWidget({
      options: { folder },
      type: "feed-images",
    });

    widget.current = widget;
    setPost((post) => ({
      ...post,
      media,
    }));
    widget.current.open();
  }

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
}
