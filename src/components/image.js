import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { useBoolean } from "../hooks";
import Preview from "./preview";

export function Image({ publicId, transform }) {
  const { type, width, height } = transform;
  const [preview, { toggle }] = useBoolean();
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
  myImage.format("webp");

  //   const myURL = myImage.toURL();

  // Apply the transformation.

  function renderImage() {
    let transformedImage;
    if (type === "profile-pic") {
      transformedImage = myImage
        .resize(
          thumbnail().width(width).height(height).gravity(focusOn(face()))
        )
        .roundCorners(byRadius(100));

      return <AdvancedImage cldImg={transformedImage} />;
    } else {
      transformedImage = myImage.resize(thumbnail().width(500).height(600)); // Crop the image, focusing on the face.
      return (
        <button onClick={toggle}>
          <AdvancedImage cldImg={transformedImage} />
        </button>
      );
    }
  }

  // Render the transformed image in a React component.
  return (
    <>
      {renderImage()}
      {preview ? (
        <Preview toggle={toggle}>
          <AdvancedImage cldImg={myImage} />
        </Preview>
      ) : null}
    </>
  );
}

Image.defaultProps = {
  transform: {
    type: "feed",
  },
};
