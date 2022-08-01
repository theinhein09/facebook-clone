import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { max } from "@cloudinary/url-gen/actions/roundCorners";
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

  // Use the image with public ID.
  const myImage = cld.image(publicId);
  const fullSize = cld.image(publicId);
  myImage.format("webp");
  fullSize.format("webp");

  //   const myURL = myImage.toURL();

  // Apply the transformation.

  function renderImage() {
    let transformedImage;

    switch (type) {
      case "profile-pic":
        transformedImage = myImage
          .resize(
            thumbnail().width(width).height(height).gravity(focusOn(face()))
          )
          .roundCorners(max());

        return <AdvancedImage cldImg={transformedImage} />;
      default:
        transformedImage = myImage.resize(thumbnail().width(500).height(600));
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
          <AdvancedImage cldImg={fullSize} />
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
