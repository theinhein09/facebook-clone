import { arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContextState } from "../contexts/user-context";
import { Users } from "../firebase/firestore";
import { useBoolean } from "../hooks";
import { Navbar } from "./navbar";
import { ProfileHeader } from "./profile-header";

export function ProfileLayout({ children }) {
  const { userId } = useParams();
  const [profile, setProfile] = useState({});
  const [disabledBtn, { off }] = useBoolean(false);
  const { user } = useUserContextState();

  useEffect(() => {
    const unsubscribe = Users.getRealtimeUserById(setProfile, userId);
    return () => unsubscribe();
  }, [userId]);

  async function handleAddFriend() {
    await Users.updateUser(profile.id, {
      pendingRequests: arrayUnion(user.id),
    });
    off();
  }

  return (
    <div role="presentation" className="bg-neutral-200">
      <Navbar />
      <header>
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
      </header>
      {children}
    </div>
  );
}
