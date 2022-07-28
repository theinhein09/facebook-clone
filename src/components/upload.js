import { useEffect, useRef } from "react";

export default function CloudinaryUploadWidget({ setPost, folder }) {
  const widget = useRef(null);
  const media = useRef([]);
  useEffect(() => {
    if (widget.current !== null || document.body.childElementCount > 2) return;
    widget.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "dmkcfie45",
        uploadPreset: "sssaoyjo",
        multiple: true,
        maxFiles: 5,
        folder,
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
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          media.current.push(result.info.public_id);
          setPost((post) => ({
            ...post,
            media: media.current,
          }));
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpload(evt) {
    evt.preventDefault();
    widget.current.open();
  }

  return (
    <button
      onClick={handleUpload}
      className="transition-all text-sm text-white bg-green-600 hover:bg-green-500 hover:shadow-lg shadow-md rounded-full px-4 py-1 font-medium"
    >
      Upload
    </button>
  );
}
