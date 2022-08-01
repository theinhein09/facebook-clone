import { useEffect, useState } from "react";
import { Users } from "../firebase/firestore";
import { User } from "./user";
import { GoSearch } from "react-icons/go";
import { useBoolean } from "../hooks";
import { MdKeyboardBackspace } from "react-icons/md";
export function SearchBtn() {
  const [searchbar, { toggle }] = useBoolean(false);
  return (
    <>
      <Searchbar toggle={toggle} visible={searchbar} />
      <>
        <button
          className="flex h-10 items-center rounded-full bg-neutral-100 text-neutral-400 shadow"
          onClick={toggle}
        >
          <span
            role="presentation"
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          >
            <GoSearch />
          </span>
          <span className="hidden pr-6 text-sm xl:block">Search Facebook</span>
        </button>
      </>
    </>
  );
}
function Searchbar({ toggle, visible }) {
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
      className={`fixed left-1 top-0 z-50 w-80 rounded-b-md bg-white p-3 shadow-lg ring-1 ring-neutral-100 transition-all ${
        visible ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex gap-2">
        <button
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-2xl"
        >
          <MdKeyboardBackspace />
        </button>
        <input
          id="search-bar"
          value={username}
          onChange={handleChange}
          placeholder="Search Facebook"
          autoComplete="username"
          className="h-10 w-full rounded-full bg-neutral-100 px-4 shadow placeholder:text-sm"
        />
      </div>
      <SearchResults results={users} setResults={setUsers} />
    </div>
  );
}

function SearchResults({ results }) {
  return (
    <aside className="mt-3 flex min-w-[300px] flex-col items-center">
      {results.length === 0 ? (
        <span className="text-sm font-light text-neutral-400">
          No recent searches
        </span>
      ) : (
        <>
          <span className="w-full py-3 font-semibold">Recent searches</span>
          {results.map((result) => (
            <div
              key={result.id}
              className="mb-4 w-full rounded p-1 shadow-lg ring-1 ring-neutral-100 last-of-type:mb-0"
            >
              <User user={result} />
            </div>
          ))}
        </>
      )}
    </aside>
  );
}
