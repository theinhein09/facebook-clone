import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useUserContextState } from "../contexts/user-context";
import { Feeds } from "../firebase/firestore";
import { Dialog } from "./dialog";
import { Modal } from "./modal";
import { CloudinaryUploadWidget } from "./cloudinary-upload-widget";
import { User } from "./user";

export function CreatePostDialog({ toggleCreatePost }) {
  const { user } = useUserContextState();
  const [post, setPost] = useState({
    text: "",
    type: "public",
  });

  function getSubscribers(type) {
    switch (type) {
      case "public":
        return ["all"];
      case "friends-only":
        return user.subscribers;
      default:
        return [user.id];
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    await Feeds.addFeed({
      ...post,
      subscribers: getSubscribers(post.type),
      publisher: user.id,
    });
    setPost({
      text: "",
      type: "public",
    });
    toggleCreatePost();
  }

  function handleChange({ target }) {
    setPost({ ...post, [target.name]: target.value });
  }

  function handeSelectClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function handleDialogClose(evt) {
    evt.preventDefault();
    toggleCreatePost();
  }

  return (
    <Modal bgColor="bg-white/70">
      <Dialog>
        <form className="mx-auto my-4 w-96 max-w-2xl rounded-md bg-white shadow-2xl shadow-black ring-1 ring-neutral-100">
          <header className="relative">
            <h3 className="py-4 text-center text-xl font-semibold">
              Create Post
            </h3>
            <button
              onClick={handleDialogClose}
              className="absolute right-3 top-1/2 flex h-10 w-10 flex-none -translate-y-1/2 items-center justify-center rounded-full bg-neutral-100 text-3xl transition-all hover:bg-neutral-200"
            >
              <IoClose />
            </button>
          </header>
          <hr />
          <User
            user={user}
            status={
              <select
                name="type"
                className="mr-2 rounded-sm bg-neutral-200 px-1 text-xs ring-1 ring-neutral-300"
                value={post.type}
                onChange={handleChange}
                onClick={handeSelectClick}
              >
                <option value="public">Public</option>
                <option value="friends-only">Friends only</option>
                <option value="only me">Only me</option>
              </select>
            }
          />
          <section className="p-2">
            <textarea
              name="text"
              value={post.text}
              onChange={handleChange}
              className="min-w-full resize-none p-1 text-neutral-500"
              rows="5"
              placeholder={`What's on your mind, ${user.username}?`}
            />
          </section>
          <section className="py-2 pr-1 text-right">
            <CloudinaryUploadWidget setPost={setPost} folder={user.id} />
          </section>
          <section className="w-full px-2 pb-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full rounded-md bg-blue-500 py-2 text-sm text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg"
            >
              Post
            </button>
          </section>
        </form>
      </Dialog>
    </Modal>
  );
}
