import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { auth } from "./authentication";
import { app } from "./init";

const db = getFirestore(app);

const fetchPublisher = (feeds) => {
  const promises = feeds.map(async (feed) => {
    const user = await getDoc(doc(db, "users", feed.data().publisher));
    return {
      id: feed.id,
      ...feed.data(),
      publisher: user.data(),
    };
  });
  return Promise.all(promises);
};

export class FS {
  constructor(collection) {
    this.collection = collection;
  }

  async getDoc(id) {
    const ref = doc(db, this.collection, id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  async addDoc(data) {
    const ref = collection(db, this.collection);
    return await addDoc(ref, { ...data, timestamp: serverTimestamp() });
  }

  onSnapshot(set) {
    switch (this.collection) {
      case "feeds":
        const q = this.query("subscribers", "array-contains-any", [
          "all",
          auth._auth.currentUser.uid,
        ]);
        const unsubscribe = onSnapshot(q, async (feeds) => {
          const data = await fetchPublisher(feeds.docs);
          set(data);
        });
        return unsubscribe;
      default:
        return new Error("ERROR");
    }
  }

  query(prop = null, operator = null, value = null) {
    const ref = collection(db, this.collection);
    if (prop && operator && value)
      return query(
        ref,
        where(prop, operator, value),
        orderBy("timestamp", "desc"),
        limit(3)
      );
    return query(ref);
  }

  async getNextDocs(lastVisible, where) {
    const { prop, operator, value } = where;
    const ref = collection(db, this.collection);
    const q = query(
      ref,
      where(prop, operator, value),
      orderBy("timestamp", "desc"),
      startAfter(lastVisible),
      limit(3)
    );
    await getDocs(q);
  }
}
