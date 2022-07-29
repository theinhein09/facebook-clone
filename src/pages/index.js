import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { FS } from "../firebase/firestore";
import { User } from "../components/user";
import { useUserContextState } from "../contexts/user-context";
import { FeedOptionsMenu } from "../components/feed-options-menu";
import { BsDot } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import { FaUser, FaUserFriends } from "react-icons/fa";
import CloudinaryUploadWidget from "../components/upload";
import { Image } from "../components/image";

const testFeeds = [
  {
    id: 1,
    text: "HELLO",
    media: ["https://source.unsplash.com/random"],
    publisher: {
      profileUrl: "https://source.unsplash.com/random",
      username: "NOEL",
    },
  },
  {
    id: 2,
    text: "WORLD",
    media: ["https://source.unsplash.com/random"],
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
  const [feeds, setFeeds] = useState([]);

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

function convertTime(prevTime) {
  const currentTime = new Date().getHours();
  const hrs = currentTime - prevTime.toDate().getHours();
  const hrsPerDay = 24;
  const hrsPerWeek = hrsPerDay * 7;
  if (hrs > hrsPerDay) {
    return `${Math.floor(hrs / hrsPerDay)}D`;
  } else if (hrs > hrsPerWeek) {
    return `${Math.floor(hrs / hrsPerWeek)}W`;
  }

  return `${hrs}H`;
}
function Feed({ feed }) {
  const { user } = useUserContextState();
  return (
    <article className="mx-auto max-w-sm shadow-lg rounded-md ring-1 mt-4 ring-neutral-100 pb-2 relative bg-white">
      <User
        user={feed.publisher}
        status={
          <span>
            {renderFeedType(feed.type)}
            <BsDot className="text-2xl inline -mx-1" />
            <span className="font-medium text-neutral-400">
              {feed.timestamp && convertTime(feed.timestamp)}
            </span>
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
      <section className="max-w-full" id={feed.id}>
        {feed.media.map((image) => (
          <div key={image} role="presentation" className="my-2">
            <Image publicId={image} />
          </div>
        ))}
      </section>
      {user.id === feed.publisher.id ? <FeedOptionsMenu feed={feed} /> : null}
    </article>
  );
}

function CreatePost() {
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

  return (
    <>
      <form className="mx-auto max-w-sm ring-1 ring-neutral-100 shadow-lg my-4 rounded-md bg-white">
        <User user={user} />
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
        <section className="text-right pr-1 py-2">
          <CloudinaryUploadWidget setPost={setPost} folder={user.id} />
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
            className="bg-blue-300 hover:bg-blue-400 rounded-full shadow-md hover:shadow-lg px-5 py-1 text-sm text-white transition-all"
          />
        </section>
      </form>
    </>
  );
}
