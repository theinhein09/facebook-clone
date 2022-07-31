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

export class Feeds {
  static lastVisible = null;

  static async getFeedById(id) {
    const ref = doc(db, "feeds", id);
    const feed = await getDoc(ref);
    if (feed.exists()) {
      return {
        id: feed.id,
        ...feed.data(),
      };
    }
    return null;
  }

  static async getFeedsByUserId(userId) {
    const ref = collection(db, "feeds");
    const q = query(
      ref,
      where("publisher", "==", userId),
      orderBy("timestamp", "desc"),
      limit(2)
    );
    const feeds = await getDocs(q);
    return feeds.docs.map((feed) => ({
      id: feed.id,
      ...feed.data(),
    }));
  }

  static async addFeed(feed) {
    const ref = collection(db, "feeds");
    return await addDoc(ref, { ...feed, timestamp: serverTimestamp() });
  }

  static async deleteFeed(id) {
    const ref = collection(db, "feeds", id);
    await deleteDoc(ref);
  }

  static async updateFeed(id, data) {
    const ref = doc(db, "feeds", id);
    await updateDoc(ref, {
      ...data,
      timestamp: serverTimestamp(),
      edited: true,
    });
  }

  static getRealTimeFeeds(set) {
    const ref = collection(db, "feeds");
    const q = query(
      ref,
      where("subscribers", "array-contains-any", [
        "all",
        auth._auth.currentUser.uid,
      ]),
      orderBy("timestamp", "desc"),
      limit(2)
    );

    const unsubscribe = onSnapshot(q, async (snapshots) => {
      this.lastVisible = snapshots.docs[snapshots.docs.length - 1];
      const feeds = [];
      for (let snapshot of snapshots.docs) {
        const feed = {
          id: snapshot.id,
          ...snapshot.data(),
          publisher: Users.getUserById(snapshot.data().publisher),
        };
        feeds.push(feed);
      }
      set(feeds);
    });
    return unsubscribe;
  }

  static async getNextFeeds() {
    const ref = collection(db, "feeds");
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
    const nextFeeds = await getDocs(q);
    this.lastVisible = nextFeeds.docs[nextFeeds.docs.length - 1];
    const feeds = [];
    for (let feed of nextFeeds.docs) {
      feeds.push({
        id: feed.id,
        ...feed.data(),
        publisher: Users.getUserById(feed.data().publisher),
      });
    }
    return feeds;
  }
}
