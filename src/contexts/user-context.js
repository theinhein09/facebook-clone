import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/authentication";
import { FS } from "../firebase/firestore";
import { useBoolean } from "../hooks";

const UserContextState = createContext();
const UserContextUpdater = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, { on, off }] = useBoolean(true);

  useEffect(() => {
    async function fetchUser(id) {
      on();
      const users = new FS("users");
      id && setUser(await users.getDoc(id));
      off();
    }
    auth._onAuthStateChanged(fetchUser, { on, off });
  }, [on, off]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <UserContextState.Provider value={{ user, loading }}>
      <UserContextUpdater.Provider value={setUser}>
        {children}
      </UserContextUpdater.Provider>
    </UserContextState.Provider>
  );
}

export function useUserContextState() {
  const ctx = useContext(UserContextState);

  if (ctx === undefined) {
    throw new Error("useUserContextState was used outside of its Provider");
  }
  return ctx;
}

export function useUserContextUpdater() {
  const ctx = useContext(UserContextUpdater);

  if (ctx === undefined) {
    throw new Error("useUserContextUpdater was used outside of its Provider");
  }
  return ctx;
}
