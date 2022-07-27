import {
  collection,
  doc,
  getDoc,
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

const fillArray = (myArray) => {
  const promises = myArray.map(async (item) => {
    const user = await getDoc(doc(db, "users", item.data().publisher));
    return {
      id: item.id,
      ...item.data(),
      publisher: user.data(),
    };
  });
  return Promise.all(promises);
};

export class FS {
  constructor(collection) {
    this.collection = collection;
  }

  onSnapshot(set) {
    const q = this.query("subscribers", "array-contains-any", [
      "all",
      auth._auth.currentUser.uid,
    ]);
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const data = await fillArray(querySnapshot.docs);
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
