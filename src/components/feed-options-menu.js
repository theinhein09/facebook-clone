import { useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { FS } from "../firebase/firestore";
import { useBoolean } from "../hooks";
export function FeedOptionsMenu({ feed }) {
  const [optionsMenu, { toggle: toggleOptionsMenu }] = useBoolean(false);
  const [editingFeed, setEditingFeed] = useState({ text: "" });
  const [feedEditor, { toggle: toggleFeedEditor }] = useBoolean(false);

  function handleEdit() {
    setEditingFeed({ ...editingFeed, text: feed.text });
    toggleFeedEditor();
    toggleOptionsMenu();
  }

  async function handleDelete() {
    const feedsFS = new FS("feeds");
    await feedsFS.deleteDoc(feed.id);
    toggleOptionsMenu();
  }

  function handleEditingFeedChange({ target }) {
    setEditingFeed({ ...editingFeed, text: target.value });
  }

  async function handleEditingFeed() {
    const feedsFS = new FS("feeds");
    await feedsFS.updateDoc(feed.id, editingFeed);
    toggleFeedEditor();
  }

  return (
    <>
      <div role="presentation" className="absolute top-2 right-2s">
        <button onClick={toggleOptionsMenu}>
          <GoChevronDown />
        </button>
        <menu
          className={`absolute bg-neutral-100 transition-all w-24 ${
            optionsMenu ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <li role="menuitem">
            <button
              onClick={handleEdit}
              className="hover:bg-neutral-200 bg-neutral-100 w-full px-3 py-1 text-left transition-all text-neutral-600 text-xs"
            >
              Edit post
            </button>
          </li>
          <li role="menuitem">
            <button
              onClick={handleDelete}
              className="hover:bg-neutral-200 bg-neutral-100 w-full px-3 py-1 text-left transition-all text-neutral-600 text-xs"
            >
              Delete post
            </button>
          </li>
        </menu>
      </div>
      {feedEditor ? (
        <>
          <textarea
            value={editingFeed.text}
            onChange={handleEditingFeedChange}
            className="resize-none w-full p-1 text-neutral-500"
            rows={5}
          />
          <section className="text-right">
            <button
              onClick={handleEditingFeed}
              className="text-sm shadow-md hover:shadow-lg bg-blue-400 hover:bg-blue-500 rounded-full px-4 py-1 text-white transition-all mr-1"
            >
              Update
            </button>
            <button
              onClick={toggleFeedEditor}
              className="text-sm shadow-md hover:shadow-lg bg-neutral-400 hover:bg-neutral-500 rounded-full px-4 py-1 text-white transition-all mr-1"
            >
              Cancel
            </button>
          </section>
        </>
      ) : null}
    </>
  );
}
