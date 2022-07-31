import { useEffect, useState } from "react";
import { Users } from "../firebase/firestore";
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
      const results = await Users.getUsersByUsername(username);
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
        className="bg-neutral-100 pl-10 w-0 md:w-auto rounded-full h-10 shadow"
      />
      <SearchResults results={users} setResults={setUsers} />
    </div>
  );
}

function SearchResults({ results, setResults }) {
  return (
    <aside
      className={`absolute mt-3 bg-white ring-1 ring-neutral-100 shadow-xl rounded min-w-[300px] transition-all ${
        results.length === 0 ? "invisible opacity-0" : "visible opacity-100"
      }`}
    >
      {results.map((result) => (
        <User user={result} key={result.id} />
      ))}
    </aside>
  );
}
