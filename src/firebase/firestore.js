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
  setDoc,
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

  async setDoc(id, data) {
    const ref = doc(db, this.collection, id);
    return await setDoc(ref, { ...data, timestamp: serverTimestamp() });
  }

  onSnapshot(set, docId) {
    let unsubscribe;
    switch (this.collection) {
      case "feeds":
        const feedsRef = collection(db, this.collection);
        const q = query(
          feedsRef,
          where("subscribers", "array-contains-any", [
            "all",
            auth._auth.currentUser.uid,
          ]),
          orderBy("timestamp", "desc"),
          limit(2)
        );
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

export class Users {
  static async getUserById(id) {
    const ref = doc(db, "users", id);
    const user = await getDoc(ref);
    if (user.exists()) {
      return {
        id: user.id,
        ...user.data(),
      };
    }
    return null;
  }

  static async getUsersByUsername(username) {
    const lowercaseUsername = username.toLowerCase();
    const ref = collection(db, "users");
    const q = query(ref, where("username-sl", "==", lowercaseUsername));
    const users = await getDocs(q);
    return users.docs.map((user) => ({
      id: user.id,
      ...user.data(),
    }));
  }

  static async addUser(user) {
    const ref = collection(db, "users");
    return await addDoc(ref, { ...user, timestamp: serverTimestamp() });
  }

  static async setUser(id, user) {
    const ref = doc(db, "users", id);
    return await setDoc(ref, { ...user, timestamp: serverTimestamp() });
  }

  static async deleteUser(id) {
    const ref = doc(db, "users", id);
    await deleteDoc(ref);
  }

  static async updateUser(id, data) {
    const ref = doc(db, "users", id);
    await updateDoc(ref, {
      ...data,
      timestamp: serverTimestamp(),
    });
  }

  static getRealtimePendingRequests(set, id) {
    const ref = doc(db, "users", id);
    const unsubscribe = onSnapshot(ref, async (user) => {
      const users = [];
      for (let id of user.data().pendingRequests) {
        users.push(await this.getUserById(id));
      }
      set(users);
    });
    return unsubscribe;
  }
}

export const usersFS = new Users();
