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
    <main className="relative min-h-screen">
      <form onSubmit={handleSubmit} className="left-20 top-96 absolute">
        <label htmlFor="email" className="block text-sm mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={handleChange}
          className="bg-neutral-200 w-64 py-0.5 px-2 rounded mb-2"
        />
        <label htmlFor="password" className="block text-sm mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={handleChange}
          className="bg-neutral-200 w-64 py-0.5 px-2 rounded mb-4"
        />
        <input
          type="submit"
          value="Login"
          className="bg-blue-400 px-4 py-1 text-white rounded-full hover:bg-blue-500 shadow-md hover:shadow-lg transition-all text-sm block"
        />
      </form>
    </main>
  );
}
