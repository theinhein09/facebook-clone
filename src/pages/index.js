import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { FS } from "../firebase/firestore";
import { User } from "../components/user";
import { useUserContextState } from "../contexts/user-context";

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

  useEffect(() => {
    console.log(feeds);
  }, [feeds]);

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
  return (
    <article className="mx-auto max-w-sm shadow-lg rounded-md ring-1 my-4 ring-neutral-100 pb-2">
      <User user={feed.publisher} />
      <h2 className="px-1 text-sm py-1">{feed.text}</h2>
      <section className="max-w-full">
        <img src={feed.media} alt="feed" width={384} height={384} />
      </section>
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

  function getSubscribers(type) {
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

  async function handlePost(event) {
    event.preventDefault();
    const feedsFS = new FS("feeds");
    const feed = await feedsFS.addDoc({
      ...post,
      subscribers: getSubscribers(type),
      publisher: curUser.id,
    });
    setPost({
      text: "",
      media: "https://source.unsplash.com/random",
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
          onClick={handlePost}
          className="bg-blue-300 hover:bg-blue-400 rounded-full shadow-md hover:shadow-lg px-5 py-1 text-sm text-white"
        />
      </section>
    </form>
  );
}
