import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useUserContextState } from "../contexts/user-context";
import { FS } from "../firebase/firestore";
import Dialog from "./dialog";
import Modal from "./modal";
import CloudinaryUploadWidget from "./upload";
import { User } from "./user";

export function CreatePostDialog({ toggleCreatePost }) {
  const { user } = useUserContextState();
  const [post, setPost] = useState({
    text: "",
    type: "public",
  });

  function getSubscribers(type, subscribers) {
    switch (type) {
      case "public":
        return ["all"];
      case "friends-only":
        return user.subscribers;
      default:
        return [user.id];
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const feedsFS = new FS("feeds");
    await feedsFS.addDoc({
      ...post,
      subscribers: getSubscribers(post.type),
      publisher: user.id,
    });
    setPost({
      text: "",
      type: "public",
    });
  }

  function handleChange({ target }) {
    setPost({ ...post, [target.name]: target.value });
  }

  function handleDialogClose(evt) {
    evt.preventDefault();
    toggleCreatePost();
  }

  return (
    <Modal toggle={toggleCreatePost} bgColor="bg-white/70">
      <Dialog>
        <form className="mx-auto max-w-2xl w-96 ring-1 ring-neutral-100 shadow-2xl shadow-black my-4 rounded-md bg-white">
          <header className="relative">
            <h3 className="text-xl text-center font-semibold py-4">
              Create Post
            </h3>
            <button
              onClick={handleDialogClose}
              className="absolute right-3 top-1/2 text-3xl -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex justify-center items-center flex-none transition-all"
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
                className="text-xs mr-2 rounded-sm ring-1 ring-neutral-300 bg-neutral-200 px-1"
                value={post.type}
                onChange={handleChange}
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
          <section className="text-right pr-1 py-2">
            <CloudinaryUploadWidget setPost={setPost} folder={user.id} />
          </section>
          <section className="pb-2 w-full px-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 rounded-md shadow-md hover:shadow-lg w-full py-2 text-sm text-white transition-all"
            >
              Post
            </button>
          </section>
        </form>
      </Dialog>
    </Modal>
  );
}
