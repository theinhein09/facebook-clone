import { useEffect, useRef } from "react";
import { FS } from "../firebase/firestore";

export default function CloudinaryUploadWidget({ setPost }) {
  const widget = useRef(null);

  useEffect(() => {
    widget.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "dmkcfie45",
        uploadPreset: "sssaoyjo",
        cropping: true,
        multiple: true,
        defaultSource: "local",
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
          setPost((post) => ({
            ...post,
            media: result.info.secure_url,
          }));
        }
      }
    );
  }, [setPost]);

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
