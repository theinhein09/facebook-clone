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
import { MONTHS } from "../utils";

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
        <div className="mx-auto mt-4 max-w-2xl rounded-md bg-white px-3 py-2 shadow-lg">
          <div role="presentation" className="flex gap-2">
            <div>
              <Image
                publicId={user.profileUrl}
                transform={{ type: "profile-pic", width: 40, height: 40 }}
              />
            </div>
            <button
              className="w-full rounded-full bg-neutral-100 py-2 px-3 text-left font-light text-neutral-500"
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
  return `${MONTHS[month]} ${date} at ${formattedHrs}:${minutes} ${ap}`;
}

export function Feed({ feed }) {
  const { user } = useUserContextState();
  return (
    <article className="relative mx-auto my-4 max-w-2xl bg-white pb-2 shadow-lg ring-1 ring-neutral-100 md:rounded-md">
      <User
        user={feed.publisher}
        status={
          <span>
            {renderFeedType(feed.type)}
            <BsDot className="-mx-1 inline text-2xl" />
            <span className="font-medium text-neutral-400">
              {feed.timestamp && convertTime(feed.timestamp)}
            </span>
            {feed.edited && (
              <>
                <BsDot className="-mx-1 inline text-2xl" />
                <span className="font-medium text-neutral-400">Edited</span>
              </>
            )}
          </span>
        }
      />
      <hr className="mb-2" />
      <h2 className="px-1 py-1 text-sm">{feed.text}</h2>
      <section className="flex gap-2 bg-black" id={feed.id}>
        {feed.media && feed.media.map((image) => (
          <div key={image} role="presentation" className="mx-auto flex w-fit">
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
    <div className="relative mx-auto mt-4 mb-4 h-80 max-w-2xl rounded-md bg-white py-3 pb-2 shadow-lg ring-1 ring-neutral-100">
      <div className="mb-2 flex gap-2 px-2">
        <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-300" />
        <div>
          <div className="mb-2 h-4 w-56 animate-pulse bg-neutral-300" />
          <div className="h-3 w-32 animate-pulse bg-neutral-300" />
        </div>
      </div>
      <div className="h-56 animate-pulse bg-neutral-100" />
    </div>
  );
}
