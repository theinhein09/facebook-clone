import { arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import ProfileHeader from "../components/profile-header";
import { useUserContextState } from "../contexts/user-context";
import { Users } from "../firebase/firestore";
import { useBoolean } from "../hooks";

export function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState({});
  const { user } = useUserContextState();
  const [disabledBtn, { off }] = useBoolean(false);

  useEffect(() => {
    async function fetchProfile() {
      const data = await Users.getUserById(userId);
      setProfile(data);
    }
    fetchProfile();
  }, [userId]);

  async function handleAddFriend() {
    await Users.updateUser(profile.id, {
      pendingRequests: arrayUnion(user.id),
    });
    off();
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
      />
    </Layout>
  );
}
