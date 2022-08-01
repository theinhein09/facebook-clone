import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../firebase/authentication";
import { useBoolean } from "../hooks";
import { LOGIN_FORM_FIELDS } from "../utils";
import { SignUpDialog } from "../components/sign-up-dialog";

export function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [signUpDialog, { toggle: toggleSignUpDialog }] = useBoolean(false);
  const navigate = useNavigate();

  function handleChange({ target }) {
    setUser((user) => ({ ...user, [target.name]: target.value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await Auth.signIn(user.email, user.password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  function handleSignUpDialog(evt) {
    evt.preventDefault();
    toggleSignUpDialog();
  }

  return (
    <>
      <main className="bg-neutral-100 py-40 text-center">
        <section className="mr-28 inline-block max-w-sm pt-10 text-left align-top">
          <h1 className="my-3 text-5xl font-bold text-blue-500">facebook</h1>
          <h2 className="text-2xl">
            Connect with friends and the world around you on Facebook.
          </h2>
        </section>
        <form
          id="login"
          onSubmit={handleSubmit}
          className="inline-block w-96 max-w-md rounded-md bg-white p-4 shadow-lg ring-1 ring-neutral-100"
        >
          {LOGIN_FORM_FIELDS.map((field) => (
            <Fragment key={field.id}>
              <label htmlFor={field.id} className="sr-only">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.name}
                type={field.type}
                value={user[field.name]}
                placeholder={field.placeholder}
                autoComplete={field.autocomplete}
                onChange={handleChange}
                className="mb-3 block w-full rounded p-3 ring-1 ring-neutral-200"
              />
            </Fragment>
          ))}
          <section className="py-2">
            <button
              form="login"
              type="submit"
              className="w-full rounded bg-blue-500 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg"
            >
              Log In
            </button>
          </section>
          <section className="w-full py-3 text-center text-sm font-medium">
            <button
              className="text-blue-500"
              onClick={(evt) => evt.preventDefault()}
            >
              Forgot password?
            </button>
          </section>
          <hr className="my-2" />
          <section className="w-full py-6 text-center">
            <button
              className="rounded bg-green-500 px-3 py-3 font-medium text-white shadow-md transition-all hover:bg-green-600 hover:shadow-lg"
              onClick={handleSignUpDialog}
            >
              Create new account
            </button>
          </section>
        </form>
      </main>
      {signUpDialog ? <SignUpDialog toggle={toggleSignUpDialog} /> : null}
    </>
  );
}
