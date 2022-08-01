import { useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { Feeds } from "../firebase/firestore";
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
    await Feeds.deleteFeed(feed.id);
    toggleOptionsMenu();
  }

  function handleEditingFeedChange({ target }) {
    setEditingFeed({ ...editingFeed, text: target.value });
  }

  async function handleEditingFeed() {
    await Feeds.updateFeed(feed.id, editingFeed);
    toggleFeedEditor();
  }

  return (
    <>
      <div role="presentation" className="absolute top-2 right-2">
        <button onClick={toggleOptionsMenu}>
          <GoChevronDown />
        </button>
        <menu
          className={`absolute right-0 w-24 bg-neutral-100 transition-all ${
            optionsMenu ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <li role="menuitem">
            <button
              onClick={handleEdit}
              className="w-full bg-neutral-100 px-3 py-1 text-left text-xs text-neutral-600 transition-all hover:bg-neutral-200"
            >
              Edit post
            </button>
          </li>
          <li role="menuitem">
            <button
              onClick={handleDelete}
              className="w-full bg-neutral-100 px-3 py-1 text-left text-xs text-neutral-600 transition-all hover:bg-neutral-200"
            >
              Delete post
            </button>
          </li>
        </menu>
      </div>
      {feedEditor ? (
        <Modal toggle={toggleFeedEditor}>
          <Dialog>
            <div role="presentation" className="min-w-[320px] rounded bg-white">
              <h3 className="mb-2 rounded-t bg-blue-500 px-2 py-1 text-white">
                Edit Post
              </h3>
              <section className="w-full text-center">
                <textarea
                  value={editingFeed.text}
                  onChange={handleEditingFeedChange}
                  className="my-2 w-[300px] resize-none p-1 text-neutral-500"
                  rows={5}
                />
              </section>
              <section className="py-2 px-1 text-right">
                <button
                  onClick={handleEditingFeed}
                  className="mr-1 rounded-full bg-blue-400 px-4 py-1 text-sm text-white shadow-md transition-all hover:bg-blue-500 hover:shadow-lg"
                >
                  Update
                </button>
                <button
                  onClick={toggleFeedEditor}
                  className="rounded-full bg-neutral-400 px-4 py-1 text-sm text-white shadow-md transition-all hover:bg-neutral-500 hover:shadow-lg"
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
