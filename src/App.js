import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages";
import { PrivateRoute } from "./components/private-route";
import { Friends } from "./pages/friends";
import { Menu } from "./pages/menu";
import { Notifications } from "./pages/notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="friends" element={<Friends />} />
          <Route path="menu" element={<Menu />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
