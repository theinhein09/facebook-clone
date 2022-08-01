import { useEffect, useRef } from "react";

function createWidget(folder) {
  const media = [];
  const defaultOptions = {
    folder,
    cloudName: "dmkcfie45",
    uploadPreset: "sssaoyjo",
    multiple: true,
    maxFiles: 5,
    defaultSource: "local",
    clientAllowedFormats: ["webp", "gif", "jpg", "png", "jpeg"],
    resourceType: "image",
    showAdvancedOptions: false,
    styles: {
      palette: {
        window: "#ffffff",
        sourceBg: "#f4f4f5",
        windowBorder: "#90a0b3",
        tabIcon: "#000000",
        inactiveTabIcon: "#555a5f",
        menuIcons: "#555a5f",
        link: "#0094EC",
        action: "#339933",
        inProgress: "#0433ff",
        complete: "#339933",
        error: "#cc0000",
        textDark: "#000000",
        textLight: "#fcfffd",
      },
      fonts: {
        default: null,
        "'Poppins', sans-serif": {
          url: "https://fonts.googleapis.com/css?family=Poppins",
          active: true,
        },
      },
    },
  };
  return {
    widget: window.cloudinary.createUploadWidget(
      defaultOptions,
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          media.push(result.info.public_id);
        }
      }
    ),
    media,
  };
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
    const { widget, media } = createWidget(folder);

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
