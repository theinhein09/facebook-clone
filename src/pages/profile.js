import { arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContextState } from "../contexts/user-context";
import { FS } from "../firebase/firestore";

export function Profile() {
  const { userId } = useParams();
  const [{ id, subscribers, pendingRequests }, setProfile] = useState({});
  const { user } = useUserContextState();

  useEffect(() => {
    async function fetchProfile() {
      const usersFS = new FS("users");
      const data = await usersFS.getDoc(userId);
      setProfile(data);
    }

    fetchProfile();
  }, [userId]);

  async function handleAddFriend() {
    const usersFS = new FS("users");
    await usersFS.updateDoc(id, {
      pendingRequests: arrayUnion(user.id),
    });
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
          className="bg-blue-500 px-4 py-1 text-sm shadow-md hover:shadow-lg hover:bg-blue-400 rounded text-white font-medium"
        >
          Add Friend
        </button>
      ) : null}
    </main>
  );
}
