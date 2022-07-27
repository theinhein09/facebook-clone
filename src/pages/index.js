import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { FS } from "../firebase/firestore";

const testFeeds = [
  {
    id: 1,
    text: "HELLO",
    media: "https://source.unsplash.com/random",
  },
  {
    id: 2,
    text: "WORLD",
    media: "https://source.unsplash.com/random",
  },
];

export function Home() {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const feeds = new FS("feeds");
    const unsubscribe = feeds.onSnapshot(setFeeds);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(feeds);
  }, [feeds]);

  return (
    <Layout>
      {feeds.map((feed) => (
        <article
          key={feed.id}
          className="mx-auto max-w-sm shadow-lg py-3 rounded-md ring-1 my-4 ring-neutral-100"
        >
          <h2 className="px-1 text-sm py-1">{feed.text}</h2>
          <section className="max-w-full">
            <img src={feed.media} alt="feed" width={384} height={384} />
          </section>
        </article>
      ))}
    </Layout>
  );
}
