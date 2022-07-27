import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { FS } from "../firebase/firestore";
import { User } from "../components/user";
import { useUserContextState } from "../contexts/user-context";
import { useBoolean } from "../hooks";

const testFeeds = [
  {
    id: 1,
    text: "HELLO",
    media: "https://source.unsplash.com/random",
    publisher: {
      profileUrl: "https://source.unsplash.com/random",
      username: "NOEL",
    },
  },
  {
    id: 2,
    text: "WORLD",
    media: "https://source.unsplash.com/random",
    publisher: {
      profileUrl: "https://source.unsplash.com/random",
      username: "NOEL",
    },
  },
];

export function Home() {
  const [feeds, setFeeds] = useState(testFeeds);

  useEffect(() => {
    const feeds = new FS("feeds");
    const unsubscribe = feeds.onSnapshot(setFeeds);
    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <CreatePost />
      {feeds.map((feed) => (
        <Feed key={feed.id} feed={feed} />
      ))}
    </Layout>
  );
}

function Feed({ feed }) {
  const { user } = useUserContextState();
  const [optionsMenu, { toggle: toggleOptionsMenu }] = useBoolean(false);
  const [feedEditor, { toggle: toggleFeedEditor }] = useBoolean(false);
  const [editingFeed, setEditingFeed] = useState({ text: feed.text });

  function handleOptions() {
    toggleOptionsMenu();
  }

  async function handleDelete() {
    const feedsFS = new FS("feeds");
    await feedsFS.deleteDoc(feed.id);
  }

  function handleEdit() {
    toggleFeedEditor();
  }

  function handleEditingFeedChange({ target }) {
    setEditingFeed({ ...editingFeed, text: target.value });
  }

  async function handleEditingFeed() {
    const feedsFS = new FS("feeds");
    await feedsFS.updateDoc(feed.id, editingFeed);
    toggleFeedEditor();
    toggleOptionsMenu();
  }

  return (
    <article className="mx-auto max-w-sm shadow-lg rounded-md ring-1 my-4 ring-neutral-100 pb-2 relative">
      <User user={feed.publisher} edited={feed.edited} />
      <h2 className="px-1 text-sm py-1">{feed.text}</h2>
      <section className="max-w-full">
        <img src={feed.media} alt="feed" width={384} height={384} />
      </section>
      {user.uid === feed.publisher.id ? (
        <div role="presentation" className="absolute top-2 right-4">
          <button onClick={handleOptions}>*</button>
          <menu
            className={`absolute bg-neutral-100 transition-all w-24 ${
              optionsMenu ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <li role="menuitem">
              <button
                onClick={handleEdit}
                className="hover:bg-neutral-200 bg-neutral-100 w-full px-3 py-1 text-left transition-all text-neutral-600 text-xs"
              >
                Edit post
              </button>
            </li>
            <li role="menuitem">
              <button
                onClick={handleDelete}
                className="hover:bg-neutral-200 bg-neutral-100 w-full px-3 py-1 text-left transition-all text-neutral-600 text-xs"
              >
                Delete post
              </button>
            </li>
          </menu>
        </div>
      ) : null}

      {feedEditor ? (
        <>
          <textarea
            value={editingFeed.text}
            onChange={handleEditingFeedChange}
            className="resize-none w-full p-1 text-neutral-500"
            rows={5}
          />
          <section className="text-right">
            <button
              onClick={handleEditingFeed}
              className="text-sm shadow-md hover:shadow-lg bg-blue-400 hover:bg-blue-500 rounded-full px-4 py-1 text-white transition-all mr-1"
            >
              Update
            </button>
          </section>
        </>
      ) : null}
    </article>
  );
}

function CreatePost() {
  const { user } = useUserContextState();
  const [curUser, setCurUser] = useState({});
  const [post, setPost] = useState({
    text: "",
    media: "https://source.unsplash.com/random",
  });
  const [type, setType] = useState("public");

  function getSubscribers(type, subscribers) {
    switch (type) {
      case "public":
        return ["all"];
      case "friends-only":
        return curUser.subscribers;
      default:
        return [curUser.id];
    }
  }

  useEffect(() => {
    async function fetchUser(id) {
      const userFS = new FS("users");
      const user = await userFS.getDoc(id);
      setCurUser(user);
    }
    fetchUser(user.uid);
  }, [user.uid]);

  function handleType({ target }) {
    setType(target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const feedsFS = new FS("feeds");
    const feed = await feedsFS.addDoc({
      ...post,
      subscribers: getSubscribers(type),
      publisher: curUser.id,
    });
    console.log(feed);
  }

  function handleText({ target }) {
    setPost({ ...post, text: target.value });
  }

  return (
    <form className="mx-auto max-w-sm ring-1 ring-neutral-100 shadow-lg my-4 rounded-md">
      <User user={curUser} />
      <section className="p-2">
        <textarea
          onChange={handleText}
          className="min-w-full resize-none p-1 placeholder:italic placeholder:text-sm text-neutral-500"
          rows="5"
          placeholder="Write something on your mind..."
        />
      </section>
      <section className="text-right pr-1 pb-2">
        <select
          name="type"
          className="text-xs mr-2 rounded-full ring-1 ring-neutral-300 bg-neutral-200 px-1"
          value={type}
          onChange={handleType}
        >
          <option value="public">Public</option>
          <option value="friends-only">Friends only</option>
          <option value="only me">Only me</option>
        </select>
        <input
          type="submit"
          value="Post"
          onClick={handleSubmit}
          className="bg-blue-300 hover:bg-blue-400 rounded-full shadow-md hover:shadow-lg px-5 py-1 text-sm text-white"
        />
      </section>
    </form>
  );
}
