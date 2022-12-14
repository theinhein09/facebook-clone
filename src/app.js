import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages";
import { PrivateRoute } from "./components/private-route";
import { Friends } from "./pages/friends";
import { Profile } from "./pages/profile";
import { About } from "./pages/about";

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
          <Route path=":userId">
            <Route
              path="posts"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="about"
              element={
                <PrivateRoute>
                  <About />
                </PrivateRoute>
              }
            />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
