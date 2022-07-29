import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { app } from "./init";

export const auth = {
  _auth: getAuth(app),

  async _signIn(email, password) {
    await setPersistence(this._auth, browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(
      this._auth,
      email,
      password
    );
    return userCredential.user;
  },

  async _signUp(email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      this._auth,
      email,
      password
    );
    return userCredential.user;
  },

  _onAuthStateChanged(setUser, loading) {
    loading.on();
    onAuthStateChanged(this._auth, async (user) => {
      if (user) {
        await setUser(user.uid);
        loading.off();
      } else {
        setUser(null);
        loading.off();
      }
    });
  },

  async _signOut() {
    await signOut(this._auth);
  },
};
