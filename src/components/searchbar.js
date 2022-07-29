import { useEffect, useState } from "react";
import { FS } from "../firebase/firestore";
import { User } from "./user";
import { GoSearch } from "react-icons/go";
import { Link } from "react-router-dom";
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

  return (
    <div role="presentation" className="relative">
      <div
        role="presentation"
        className="absolute text-lg top-0 left-0 w-10 h-10 rounded-full flex justify-center items-center"
      >
        <GoSearch />
      </div>
      <input
        id="search-bar"
        value={username}
        onChange={handleChange}
        placeholder="Search Facebook"
        autoComplete="username"
        className="bg-neutral-100 pl-10 rounded-full h-10 shadow"
      />
      <SearchResults results={users} />
    </div>
  );
}

function SearchResults({ results }) {
  return (
    <aside
      className={`bg-white ring-1 ring-neutral-100 shadow-xl rounded min-w-[100px] transition-all ${
        results.length === 0 ? "invisible opacity-0" : "visible opacity-100"
      }`}
    >
      {results.map((result) => (
        <Link key={result.id} to={`${result.id}`}>
          <User user={result} />
        </Link>
      ))}
    </aside>
  );
}
