import { arrayRemove, arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { User } from "../components/user";
import { useUserContextState } from "../contexts/user-context";
import { FS } from "../firebase/firestore";

export function Friends() {
  const [requests, setRequests] = useState([]);
  const { user } = useUserContextState();

  useEffect(() => {
    const usersFS = new FS("users");
    usersFS.onSnapshot(setRequests, user.id);
  }, [user.id]);

  async function handleAccept(id) {
    const usersFS = new FS("users");
    usersFS.updateDoc(user.id, {
      subscribers: arrayUnion(id),
      pendingRequests: arrayRemove(id),
    });
    usersFS.updateDoc(id, {
      subscribers: arrayUnion(user.id),
    });
  }

  async function handleDecline(id) {
    const usersFS = new FS("users");
    usersFS.updateDoc(user.id, {
      pendingRequests: arrayRemove(id),
    });
  }

  return (
    <Layout>
      <main className="min-h-screen">
        <h1 className="min-w-[320px] w-fit mx-auto p-2 pl-0.5 m-2 font-medium text-neutral-500">
          Pending requests
        </h1>
        {requests.map((request) => (
          <article className="bg-white max-w-fit mx-auto rounded shadow-lg ring-1 ring-neutral-50">
            <User user={request} />
            <section className="min-w-[320px] p-2 text-right">
              <button
                onClick={() => handleAccept(request.id)}
                className="bg-blue-500 px-4 py-1 text-sm font-medium text-white rounded shadow-md hover:shadow-lg hover:bg-blue-400 transition-all mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(request.id)}
                className="bg-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600 rounded shadow-md hover:shadow-lg hover:bg-neutral-300 transition-all"
              >
                Decline
              </button>
            </section>
          </article>
        ))}
      </main>
    </Layout>
  );
}
