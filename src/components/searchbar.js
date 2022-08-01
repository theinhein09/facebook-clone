import { useEffect, useState } from "react";
import { Users } from "../firebase/firestore";
import { User } from "./user";
import { GoSearch } from "react-icons/go";
import { useBoolean } from "../hooks";
import { MdKeyboardBackspace } from "react-icons/md";
export function SearchBtn() {
  const [searchbar, { toggle }] = useBoolean(false);
  return (
    <div role="presentation">
      <Searchbar toggle={toggle} visible={searchbar} />
      <>
        <button
          className="bg-neutral-100 rounded-full h-10 shadow text-neutral-400 flex items-center"
          onClick={toggle}
        >
          <span
            role="presentation"
            className="text-lg w-10 h-10 rounded-full flex justify-center items-center"
          >
            <GoSearch />
          </span>
          <span className="hidden md:inline-flex pr-6 text-sm">
            Search Facebook
          </span>
        </button>
      </>
    </div>
  );
}
export function Searchbar({ toggle, visible }) {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  async function handleChange({ target }) {
    setUsername(target.value);
  }

  useEffect(() => {
    async function searchUsers() {
      const results = await Users.getUsersByUsername(username);
      setUsers((users) => [...users, ...results]);
    }
    searchUsers();
  }, [username]);

  function handleClose() {
    setUsername("");
    toggle();
  }
  return (
    <div
      role="presentation"
      className={`w-80 bg-white fixed z-50 ring-1 left-1 top-0 ring-neutral-100 shadow-lg rounded-b-md p-3 transition-all ${
        visible ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex gap-2">
        <button
          onClick={handleClose}
          className="text-2xl w-10 h-10 rounded-full flex justify-center items-center"
        >
          <MdKeyboardBackspace />
        </button>
        <input
          id="search-bar"
          value={username}
          onChange={handleChange}
          placeholder="Search Facebook"
          autoComplete="username"
          className="bg-neutral-100 px-4 w-full rounded-full h-10 shadow placeholder:text-sm"
        />
      </div>
      <SearchResults results={users} setResults={setUsers} />
    </div>
  );
}

function SearchResults({ results }) {
  return (
    <aside className="mt-3 min-w-[300px] flex flex-col items-center">
      {results.length === 0 ? (
        <span className="text-neutral-400 text-sm font-light">
          No recent searches
        </span>
      ) : (
        <>
          <span className="w-full py-3 font-semibold">Recent searches</span>
          {results.map((result) => (
            <div className="w-full shadow-lg ring-1 ring-neutral-100 rounded p-1 mb-4 last-of-type:mb-0">
              <User user={result} key={result.id} />
            </div>
          ))}
        </>
      )}
    </aside>
  );
}
