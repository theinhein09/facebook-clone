import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { Feeds } from "../firebase/firestore";
import { User } from "../components/user";
import { useUserContextState } from "../contexts/user-context";
import { FeedOptionsMenu } from "../components/feed-options-menu";
import { BsDot } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { Image } from "../components/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { useBoolean } from "../hooks";
import { CreatePostDialog } from "../components/create-post-dialog";
import { months } from "../utils";

export function Home() {
  const { user } = useUserContextState();
  const [feeds, setFeeds] = useState([]);
  const [hasMore, { off }] = useBoolean(true);
  const [createPost, { toggle: toggleCreatePost }] = useBoolean(false);

  useEffect(() => {
    const unsubscribe = Feeds.getRealTimeFeedsBySubscribers(setFeeds);
    return () => unsubscribe();
  }, []);

  async function fetchMoreFeeds() {
    const nextFeeds = await Feeds.getNextFeedsBySubscribers();
    setFeeds([...feeds, ...nextFeeds]);
    if (nextFeeds.length === 0) off();
  }

  return (
    <>
      <Layout>
        <div className="bg-white mx-auto max-w-2xl px-3 py-2 rounded-md shadow-lg mt-4">
          <div role="presentation" className="flex gap-2">
            <div>
              <Image
                publicId={user.profileUrl}
                transform={{ type: "profile-pic", width: 40, height: 40 }}
              />
            </div>
            <button
              className="py-2 w-full bg-neutral-100 rounded-full text-neutral-500 text-left px-3 font-light"
              onClick={toggleCreatePost}
            >
              What's on your mind, {user.username}?
            </button>
          </div>
        </div>
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
          scrollThreshold={1}
        >
          {feeds.map((feed) => (
            <Feed key={feed.id} feed={feed} />
          ))}
        </InfiniteScroll>
      </Layout>
      {createPost ? (
        <CreatePostDialog toggleCreatePost={toggleCreatePost} />
      ) : null}
    </>
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

  const date = fullDate.getDate();
  const hours = fullDate.getHours();
  const formattedHrs = hours >= 12 ? hours - 12 : hours;
  const minutes = fullDate.getMinutes();
  const ap = hours >= 12 ? "PM" : "AM";
  return `${months[month]} ${date} at ${formattedHrs}:${minutes} ${ap}`;
}

export function Feed({ feed }) {
  const { user } = useUserContextState();
  return (
    <article className="mx-auto max-w-2xl shadow-lg md:rounded-md ring-1 my-4 ring-neutral-100 pb-2 relative bg-white">
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
      <section className="bg-black flex gap-2" id={feed.id}>
        {feed.media.map((image) => (
          <div key={image} role="presentation" className="mx-auto w-fit flex">
            <Image publicId={image} />
          </div>
        ))}
      </section>
      {user.id === feed.publisher.id ? <FeedOptionsMenu feed={feed} /> : null}
    </article>
  );
}

export function FeedSkeleton() {
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
