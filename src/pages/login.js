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
    <main className="bg-neutral-100 py-40 text-center">
      <section className="inline-block max-w-sm align-top pt-10 text-left mr-28">
        <h1 className="text-blue-500 text-5xl font-bold my-3">facebook</h1>
        <h2 className="text-2xl">
          Connect with friends and the world around you on Facebook.
        </h2>
      </section>
      <form
        id="login"
        onSubmit={handleSubmit}
        className="inline-block bg-white ring-1 shadow-lg p-4 rounded-md ring-neutral-100 max-w-md w-96"
      >
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          placeholder="Email"
          autoComplete="email"
          onChange={handleChange}
          className="ring-1 ring-neutral-200 p-3 rounded block mb-3 w-full"
        />
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          placeholder="Password"
          autoComplete="current-password"
          onChange={handleChange}
          className="ring-1 ring-neutral-200 p-3 rounded block mb-3 w-full"
        />
        <section className="py-2">
          <button
            form="login"
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded w-full py-3 hover:bg-blue-600 shadow-md hover:shadow-lg transition-all block"
          >
            Log In
          </button>
        </section>
        <section className="text-center w-full py-3 text-sm font-medium">
          <button
            className="text-blue-500"
            onClick={(evt) => evt.preventDefault()}
          >
            Forgot password?
          </button>
        </section>
        <hr className="my-2" />
        <section className="w-full text-center py-6">
          <button
            className="bg-green-500 text-white px-3 py-3 rounded font-medium"
            onClick={(evt) => evt.preventDefault()}
          >
            Create new account
          </button>
        </section>
      </form>
    </main>
  );
}
