import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth } from "./authentication";
import { app } from "./init";

const db = getFirestore(app);

export class FS {
  constructor(collection) {
    this.collection = collection;
  }

  onSnapshot(set) {
    const q = this.query("subscribers", "array-contains-any", [
      "all",
      auth._auth.currentUser.uid,
    ]);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set(data);
    });
    return unsubscribe;
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
}
