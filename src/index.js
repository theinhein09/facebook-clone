import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import { UserContextProvider } from "./contexts/user-context";
import { IconContext } from "react-icons";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <IconContext.Provider value={{ className: "text-neutral-400" }}>
        <App />
      </IconContext.Provider>
    </UserContextProvider>
  </React.StrictMode>
);
