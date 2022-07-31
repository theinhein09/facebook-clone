import { arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { NavLink, useParams } from "react-router-dom";
import { Feed, FeedSkeleton } from ".";
import { Layout } from "../components/layout";
import ProfileHeader from "../components/profile-header";
import { useUserContextState } from "../contexts/user-context";
import { Feeds, Users } from "../firebase/firestore";
import { useBoolean } from "../hooks";

export function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState({});
  const { user } = useUserContextState();
  const [disabledBtn, { off }] = useBoolean(false);
  const [feeds, setFeeds] = useState([]);
  const [hasMore, { off: offHasMore }] = useBoolean(true);

  useEffect(() => {
    async function fetchProfile() {
      const data = await Users.getUserById(userId);
      setProfile(data);
    }
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const unsubscribe = Feeds.getRealTimeFeedsByUserId(setFeeds, userId);
    return () => unsubscribe();
  }, [userId]);

  async function handleAddFriend() {
    await Users.updateUser(profile.id, {
      pendingRequests: arrayUnion(user.id),
    });
    off();
  }

  async function fetchMoreFeeds() {
    const nextFeeds = await Feeds.getNextFeedsByUserId(userId);
    setFeeds([...feeds, ...nextFeeds]);
    if (nextFeeds.length === 0) offHasMore();
  }

  return (
    <Layout>
      <ProfileHeader
        user={profile}
        actionsBar={
          profile.subscribers &&
          !profile.subscribers.includes(user.id) &&
          profile.pendingRequests &&
          !profile.pendingRequests.includes(user.id) ? (
            <button
              onClick={handleAddFriend}
              disabled={disabledBtn}
              className="bg-blue-500 px-4 py-1 text-sm shadow-md hover:shadow-lg hover:bg-blue-400 rounded text-white font-medium"
            >
              Add Friend
            </button>
          ) : null
        }
        navbar={
          <nav>
            <NavLink to={`/${userId}`}>
              {({ isActive }) => (
                <span
                  className={`px-5 pb-4 inline-block ${
                    isActive ? "text-blue-500 transition-all" : undefined
                  }`}
                >
                  Posts
                </span>
              )}
            </NavLink>
            <NavLink to={`/${userId}/about`}>
              {({ isActive }) => (
                <span
                  className={`px-5 pb-4 inline-block ${
                    isActive ? "text-blue-500 transition-all" : undefined
                  }`}
                >
                  About
                </span>
              )}
            </NavLink>
          </nav>
        }
      />
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
    </Layout>
  );
}
