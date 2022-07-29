import { useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { FS } from "../firebase/firestore";
import { useBoolean } from "../hooks";
import { Dialog } from "./dialog";
import { Modal } from "./modal";
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
      <div role="presentation" className="absolute top-2 right-2">
        <button onClick={toggleOptionsMenu}>
          <GoChevronDown />
        </button>
        <menu
          className={`absolute right-0 bg-neutral-100 transition-all w-24 ${
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
        <Modal toggle={toggleFeedEditor}>
          <Dialog>
            <div role="presentation" className="min-w-[320px] bg-white rounded">
              <h3 className="bg-blue-500 text-white px-2 py-1 rounded-t mb-2">
                Edit Post
              </h3>
              <section className="text-center w-full">
                <textarea
                  value={editingFeed.text}
                  onChange={handleEditingFeedChange}
                  className="resize-none w-[300px] p-1 my-2 text-neutral-500"
                  rows={5}
                />
              </section>
              <section className="text-right py-2 px-1">
                <button
                  onClick={handleEditingFeed}
                  className="text-sm shadow-md hover:shadow-lg bg-blue-400 hover:bg-blue-500 rounded-full px-4 py-1 text-white transition-all mr-1"
                >
                  Update
                </button>
                <button
                  onClick={toggleFeedEditor}
                  className="text-sm shadow-md hover:shadow-lg bg-neutral-400 hover:bg-neutral-500 rounded-full px-4 py-1 text-white transition-all"
                >
                  Cancel
                </button>
              </section>
            </div>
          </Dialog>
        </Modal>
      ) : null}
    </>
  );
}
