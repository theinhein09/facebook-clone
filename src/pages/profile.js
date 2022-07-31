import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { Feed, FeedSkeleton } from ".";
import { ProfileLayout } from "../components/profile-layout";
import { Feeds } from "../firebase/firestore";
import { useBoolean } from "../hooks";

export function Profile() {
  const { userId } = useParams();

  const [feeds, setFeeds] = useState([]);
  const [hasMore, { off: offHasMore }] = useBoolean(true);

  useEffect(() => {
    const unsubscribe = Feeds.getRealTimeFeedsByUserId(setFeeds, userId);
    return () => unsubscribe();
  }, [userId]);

  async function fetchMoreFeeds() {
    const nextFeeds = await Feeds.getNextFeedsByUserId(userId);
    setFeeds([...feeds, ...nextFeeds]);
    if (nextFeeds.length === 0) offHasMore();
  }

  return (
    <ProfileLayout>
      <section>
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
      </section>
    </ProfileLayout>
  );
}
