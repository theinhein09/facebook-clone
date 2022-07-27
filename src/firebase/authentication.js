import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
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

  _onAuthStateChanged(setUser) {
    onAuthStateChanged(this._auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  },
};
