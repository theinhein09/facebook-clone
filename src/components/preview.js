import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

export default function Preview({ publicId }) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dmkcfie45",
    },
  });
  const image = cld.image(publicId);
  return (
    <div className="fixed w-screen h-screen top-0 z-40 bg-black/50 left-0">
      <div className="absolute top-1/2 left-1/2 z-50">
        <AdvancedImage cldImg={image} />
      </div>
    </div>
  );
}
