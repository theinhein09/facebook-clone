import { useEffect, useRef } from "react";

export default function CloudinaryUploadWidget() {
  const widget = useRef(null);

  useEffect(() => {
    widget.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "<cloud_name>",
        uploadPreset: "<upload_preset>",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
        }
      }
    );
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
