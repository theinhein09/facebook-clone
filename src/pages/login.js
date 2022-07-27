import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/authentication";

export function Login() {
  const [{ email, password }, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function handleChange({ target }) {
    setUser((user) => ({ ...user, [target.name]: target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await auth._signIn(email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handleChange}
        />
        <input type="submit" value="Sign in" />
      </form>
    </main>
  );
}
