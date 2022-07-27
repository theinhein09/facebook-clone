import { useEffect, useState } from "react";
import { FS } from "../firebase/firestore";
import { User } from "./user";
import { GoSearch } from "react-icons/go";
export function Searchbar(params) {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  async function handleChange({ target }) {
    setUsername(target.value);
  }

  useEffect(() => {
    async function searchUsers() {
      const usersFS = new FS("users");
      const results = await usersFS.getDocs(username.toLowerCase());
      setUsers(results);
    }
    searchUsers();
  }, [username]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <span role="presentation" className="relative align-top">
      <input
        id="search-bar"
        value={username}
        onChange={handleChange}
        placeholder="Search by username..."
        autoComplete="username"
        className="bg-neutral-100 px-3 py-1 mt-2 rounded-full placeholder:text-xs placeholder:italic min-w-[300px] shadow"
      />
      <GoSearch className="absolute text-lg top-0 inline right-3" />
      <SearchResults results={users} />
    </span>
  );
}

function SearchResults({ results }) {
  return (
    <aside
      className={`absolute right-0 top-full mt-3 bg-white ring-1 ring-neutral-100 shadow-xl rounded min-w-[300px] ${
        results.length === 0 ? "invisible opacity-0" : "visible opacity-100"
      }`}
    >
      {results.map((result) => (
        <User key={result.id} user={result} />
      ))}
    </aside>
  );
}
