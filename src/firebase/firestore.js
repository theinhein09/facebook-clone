import {
  addDoc,
  collection,
  deleteDoc,
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
  updateDoc,
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
      publisher: { id: user.id, ...user.data() },
    };
  });
  return Promise.all(promises);
};

function fetchUsers(ids) {
  const promises = ids.map(async (id) => {
    const user = await getDoc(doc(db, "users", id));
    return {
      id: user.id,
      ...user.data(),
    };
  });
  return Promise.all(promises);
}

export class FS {
  constructor(collection) {
    this.collection = collection;
    this.lastVisible = null;
  }

  async getDoc(id) {
    const ref = doc(db, this.collection, id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  async getDocs(param) {
    const q = query(
      collection(db, this.collection),
      where("username-sl", "==", param)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async addDoc(data) {
    const ref = collection(db, this.collection);
    return await addDoc(ref, { ...data, timestamp: serverTimestamp() });
  }

  onSnapshot(set, docId) {
    let unsubscribe;
    switch (this.collection) {
      case "feeds":
        const q = this.query("subscribers", "array-contains-any", [
          "all",
          auth._auth.currentUser.uid,
        ]);
        unsubscribe = onSnapshot(q, async (feeds) => {
          const data = await fetchPublisher(feeds.docs);
          const lastVisible = feeds.docs[feeds.docs.length - 1];
          this.lastVisible = lastVisible;
          set(data);
        });
        return unsubscribe;
      case "users":
        const ref = doc(db, this.collection, docId);
        unsubscribe = onSnapshot(ref, async (user) => {
          const users = await fetchUsers(user.data().pendingRequests);
          set(users);
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
        limit(2)
      );
    return query(ref);
  }

  async deleteDoc(id) {
    const ref = doc(db, this.collection, id);
    await deleteDoc(ref);
  }

  async updateDoc(id, data) {
    const ref = doc(db, this.collection, id);
    await updateDoc(ref, {
      ...data,
      timestamp: serverTimestamp(),
      edited: true,
    });
  }

  async getNextDocs() {
    const ref = collection(db, this.collection);
    const q = query(
      ref,
      where("subscribers", "array-contains-any", [
        "all",
        auth._auth.currentUser.uid,
      ]),
      orderBy("timestamp", "desc"),
      startAfter(this.lastVisible),
      limit(2)
    );

    const nextDocs = await getDocs(q);
    const lastVisible = nextDocs.docs[nextDocs.docs.length - 1];
    this.lastVisible = lastVisible;
    return await fetchPublisher(nextDocs.docs);
  }
}
