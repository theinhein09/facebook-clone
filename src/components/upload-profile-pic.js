import { useEffect, useRef } from "react";
import { TbPhoto } from "react-icons/tb";
import {
  useUserContextState,
  useUserContextUpdater,
} from "../contexts/user-context";
import { FS } from "../firebase/firestore";

export default function CloudinaryUploadWidget() {
  const { user } = useUserContextState();
  const setUser = useUserContextUpdater();
  const widget = useRef(null);

  useEffect(() => {
    return () => widget.current && widget.current.destroy();
  }, []);

  function handleUpload(evt) {
    evt.preventDefault();
    console.log("OPEN");
    widget.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "dmkcfie45",
        uploadPreset: "sssaoyjo",
        cropping: true,
        folder: user.id,
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
      async (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          const users = new FS("users");
          await users.updateDoc(user.id, {
            profileUrl: result.info.public_id,
          });
          setUser(await users.getDoc(user.id));
        }
      }
    );
    widget.current.open();
  }

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
}
