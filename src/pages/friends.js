import { arrayRemove, arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/layout";
import { User } from "../components/user";
import { useUserContextState } from "../contexts/user-context";
import { Users } from "../firebase/firestore";

export function Friends() {
  const [requests, setRequests] = useState([]);
  const { user } = useUserContextState();

  useEffect(() => {
    Users.getRealtimePendingRequests(setRequests, user.id);
  }, [user.id]);

  async function handleAccept(id, evt) {
    evt.preventDefault();
    evt.stopPropagation();
    Users.updateUser(user.id, {
      subscribers: arrayUnion(id),
      pendingRequests: arrayRemove(id),
    });
    Users.updateUser(id, {
      subscribers: arrayUnion(user.id),
    });
  }

  async function handleDecline(id, evt) {
    evt.preventDefault();
    evt.stopPropagation();
    Users.updateUser(user.id, {
      pendingRequests: arrayRemove(id),
    });
  }

  return (
    <Layout>
      <h1 className="m-2 mx-auto max-w-2xl p-2 pl-0.5 font-medium text-neutral-500">
        Pending requests
      </h1>
      <section className="flex flex-col gap-3">
        {requests.map((request) => (
          <article
            key={request.id}
            className="mx-auto w-full max-w-2xl rounded bg-white shadow-lg ring-1 ring-neutral-50"
          >
            <User user={request} />
            <section className="max-w-2xl p-2 text-right">
              <button
                onClick={(evt) => handleAccept(request.id, evt)}
                className="mr-2 rounded bg-blue-500 px-4 py-1 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-400 hover:shadow-lg"
              >
                Accept
              </button>
              <button
                onClick={(evt) => handleDecline(request.id, evt)}
                className="rounded bg-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600 shadow-md transition-all hover:bg-neutral-300 hover:shadow-lg"
              >
                Decline
              </button>
            </section>
          </article>
        ))}
      </section>
    </Layout>
  );
}
