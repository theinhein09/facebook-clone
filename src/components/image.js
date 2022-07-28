import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

export function Image({ publicId }) {
  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dmkcfie45",
    },
    url: {
      secure: true, // force https, set to false to force http
    },
  });

  // Use the image with public ID, 'front_face'.
  const myImage = cld.image(publicId);

  // Apply the transformation.
  myImage.resize(thumbnail().width(400).height(500)); // Crop the image, focusing on the face.

  // Render the transformed image in a React component.
  return <AdvancedImage cldImg={myImage} />;
}
