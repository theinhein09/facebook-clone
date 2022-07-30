import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages";
import { PrivateRoute } from "./components/private-route";
import { Friends } from "./pages/friends";
import { Menu } from "./pages/menu";
import { Profile } from "./pages/profile";
import { User } from "./pages/user";

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
          <Route
            path="friends"
            element={
              <PrivateRoute>
                <Friends />
              </PrivateRoute>
            }
          />
          <Route
            path="menu"
            element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path=":userId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
