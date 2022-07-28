export default function Gallery({ media }) {
  const myGallery = window.cloudinary.galleryWidget({
    container: "#my-gallery",
    cloudName: "dmkcfie45",
    carouselStyle: "none",
    zoom: false,
    mediaAssets: media.map((item) => ({
      publicId: item,
    })),
  });

  myGallery.render();
  return <div id="my-gallery"></div>;
}
