import { useEffect, useRef, useState } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";
import { useBoolean } from "../hooks";

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
  const feedsFSRef = useRef(new FS("feeds"));
  const [hasMore, { off }] = useBoolean(true);

  useEffect(() => {
    const unsubscribe = feedsFSRef.current.onSnapshot(setFeeds);
    return () => unsubscribe();
  }, []);

  async function fetchMoreFeeds() {
    const nextFeeds = await feedsFSRef.current.getNextDocs();
    setFeeds([...feeds, ...nextFeeds]);
    if (nextFeeds.length === 0) off();
  }

  return (
    <Layout>
      <CreatePost />
      <InfiniteScroll
        dataLength={feeds.length}
        next={fetchMoreFeeds}
        hasMore={hasMore}
        loader={
          <>
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        }
        scrollThreshold={-1}
      >
        {feeds.map((feed) => (
          <Feed key={feed.id} feed={feed} />
        ))}
      </InfiniteScroll>
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

function convertTime(time) {
  const fullDate = time.toDate();
  const month = fullDate.getMonth();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = fullDate.getDate();
  const hours = fullDate.getHours();
  const formattedHrs = hours >= 12 ? hours - 12 : hours;
  const minutes = fullDate.getMinutes();
  const ap = hours >= 12 ? "PM" : "AM";
  return `${months[month]} ${date} at ${formattedHrs}:${minutes} ${ap}`;
}

function Feed({ feed }) {
  const { user } = useUserContextState();
  return (
    <article className="mx-auto max-w-2xl shadow-lg rounded-md ring-1 my-4 ring-neutral-100 pb-2 relative bg-white">
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
      <section className="bg-black" id={feed.id}>
        {feed.media.map((image) => (
          <div key={image} role="presentation" className="mx-auto w-fit">
            <Image publicId={image} />
          </div>
        ))}
      </section>
      {user.id === feed.publisher.id ? <FeedOptionsMenu feed={feed} /> : null}
    </article>
  );
}

function FeedSkeleton() {
  return (
    <div className="max-w-2xl h-80 shadow-lg rounded-md ring-1 mt-4 ring-neutral-100 pb-2 relative bg-white mx-auto py-3 mb-4">
      <div className="flex gap-2 px-2 mb-2">
        <div className="w-10 h-10 bg-neutral-300 rounded-full animate-pulse" />
        <div>
          <div className="w-56 h-4 bg-neutral-300 mb-2 animate-pulse" />
          <div className="w-32 h-3 bg-neutral-300 animate-pulse" />
        </div>
      </div>
      <div className="bg-neutral-100 h-56 animate-pulse" />
    </div>
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
        <h3 className="text-xl text-center font-semibold py-4">Create Post</h3>
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
    </>
  );
}
