import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { FS } from "../firebase/firestore";
import { User } from "../components/user";
import { useUserContextState } from "../contexts/user-context";
import { FeedOptionsMenu } from "../components/feed-options-menu";
import { BsDot } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import { FaUser, FaUserFriends } from "react-icons/fa";

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

// const user = {
//   id: "232",
//   username: "alsdjfoas",
//   email: "aosdjfo@laf.cm",
//   profileUrl: "oasdjf",
//   subscribers: [this.id],
//   timestamp: "timestamp",
//   pendingRequests: [],
// };

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

function renderFeedType(type) {
  switch (type) {
    case "public":
      return <GoGlobe className="inline text-sm" />;
    case "friends-only":
      return <FaUserFriends className="inline text-sm" />;
    default:
      return <FaUser className="inline text-xs" />;
  }
}

function Feed({ feed }) {
  const { user } = useUserContextState();
  return (
    <article className="mx-auto max-w-sm shadow-lg rounded-md ring-1 my-4 ring-neutral-100 pb-2 relative bg-white">
      <User
        user={feed.publisher}
        status={
          <span>
            {renderFeedType(feed.type)}
            <BsDot className="text-2xl inline -mx-1" />
            <span className="font-medium text-neutral-400">8H</span>
            {feed.edited && (
              <>
                <BsDot className="text-2xl inline -mx-1" />
                <span className="font-medium text-neutral-400">Edited</span>
              </>
            )}
          </span>
        }
      />
      <hr className="mb-2" />
      <h2 className="px-1 text-sm py-1">{feed.text}</h2>
      <section className="max-w-full">
        <img src={feed.media} alt="feed" width={384} height={384} />
      </section>
      {user.uid === feed.publisher.id ? <FeedOptionsMenu feed={feed} /> : null}
    </article>
  );
}

function CreatePost() {
  const { user } = useUserContextState();
  const [curUser, setCurUser] = useState({});
  const [post, setPost] = useState({
    text: "",
    media: "https://source.unsplash.com/random",
    type: "public",
  });

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

  async function handleSubmit(event) {
    event.preventDefault();
    const feedsFS = new FS("feeds");
    await feedsFS.addDoc({
      ...post,
      subscribers: getSubscribers(post.type),
      publisher: curUser.id,
    });
    setPost({
      text: "",
      media: "https://source.unsplash.com/random",
      type: "public",
    });
  }

  function handleChange({ target }) {
    setPost({ ...post, [target.name]: target.value });
  }

  return (
    <form className="mx-auto max-w-sm ring-1 ring-neutral-100 shadow-lg my-4 rounded-md bg-white">
      <User user={curUser} />
      <hr className="mb-2" />
      <section className="p-2">
        <textarea
          name="text"
          value={post.text}
          onChange={handleChange}
          className="min-w-full resize-none p-1 placeholder:italic placeholder:text-sm text-neutral-500"
          rows="5"
          placeholder="Write something on your mind..."
        />
      </section>
      <section className="text-right pr-1 pb-2">
        <select
          name="type"
          className="text-xs mr-2 rounded-full ring-1 ring-neutral-300 bg-neutral-200 px-1"
          value={post.type}
          onChange={handleChange}
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
