import { arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContextState } from "../contexts/user-context";
import { Users } from "../firebase/firestore";
import { useBoolean } from "../hooks";

export function Profile() {
  const { userId } = useParams();
  const [{ id, subscribers, pendingRequests }, setProfile] = useState({});
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
    await Users.updateUser(id, {
      pendingRequests: arrayUnion(user.id),
    });
    off();
  }

  return (
    <main>
      Profile
      <div>{userId}</div>
      {subscribers &&
      !subscribers.includes(user.id) &&
      pendingRequests &&
      !pendingRequests.includes(user.id) ? (
        <button
          onClick={handleAddFriend}
          disabled={disabledBtn}
          className="bg-blue-500 px-4 py-1 text-sm shadow-md hover:shadow-lg hover:bg-blue-400 rounded text-white font-medium"
        >
          Add Friend
        </button>
      ) : null}
    </main>
  );
}
