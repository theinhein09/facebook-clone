import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/modal";
import { Dialog } from "../components/dialog";
import { Auth } from "../firebase/authentication";
import { useBoolean } from "../hooks";
import {
  SIGN_UP_FORM_FIELDS,
  LOGIN_FORM_FIELDS,
  SIGN_UP_FORM_GENDERS,
  SIGN_UP_FORM_DOB,
  NEW_USER,
} from "../utils";
import { Users } from "../firebase/firestore";

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

function SignUpDialog({ toggle }) {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState(NEW_USER);

  async function handleSignUp(evt) {
    evt.preventDefault();
    const { firstName, lastName, email, password, month, day, year, gender } =
      newUser;
    const user = await Auth.signUp(email, password);
    const formattedUser = {
      id: user.uid,
      username: firstName + " " + lastName,
      "username-sl": firstName.toLowerCase() + " " + lastName.toLowerCase(),
      firstName,
      lastName,
      email,
      dob: new Date(`${month} ${day}, ${year}`),
      gender,
      subscribers: [user.uid],
      pendingRequests: [],
      timestamp: "",
      profileUrl: "default_avatar_xuum5f.jpg",
    };
    await Users.setUser(user.uid, formattedUser);
    navigate("/");
  }

  function handleNewUserChange({ target }) {
    setNewUser({ ...newUser, [target.name]: target.value });
  }

  return (
    <Modal toggle={toggle} bgColor="bg-white/50">
      <Dialog>
        <form className="w-screen max-w-md rounded-md bg-white shadow-2xl shadow-black ring-1 ring-neutral-100">
          <header className="p-4">
            <h2 className="text-3xl font-semibold">Sign Up</h2>
          </header>
          <hr />
          <div role="presentation" className="flex flex-col flex-wrap p-4">
            {SIGN_UP_FORM_FIELDS.map((field) => (
              <section className="mb-3" key={field.id}>
                <label htmlFor={field.id} className="sr-only">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  autoComplete={field.autocomplete}
                  className="w-full rounded-md bg-neutral-50 px-3 py-1.5 ring-1 ring-neutral-300 placeholder:text-sm"
                  value={newUser[field.name]}
                  onChange={handleNewUserChange}
                  type={field.type}
                />
              </section>
            ))}
            <section className="py-2">
              <div className="text-xs text-neutral-600">Birthday</div>
              <div role="presentation" className="flex justify-between">
                {SIGN_UP_FORM_DOB.map((select) => (
                  <select
                    name={select.name}
                    className="my-1 w-1/4 rounded-md px-1 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300"
                    value={newUser[select.name]}
                    onChange={handleNewUserChange}
                  >
                    {select.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            </section>
            <section className="py-2">
              <div className="text-xs text-neutral-600">Gender</div>
              <div
                role="presentation"
                className="flex justify-between"
                onChange={handleNewUserChange}
              >
                {SIGN_UP_FORM_GENDERS.map((choice) => (
                  <div
                    key={choice.id}
                    className="my-1 w-1/4 rounded-md px-2 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300"
                  >
                    <label htmlFor={choice.id} className="flex justify-between">
                      {choice.label}
                      <input
                        type={choice.type}
                        id={choice.id}
                        name={choice.name}
                        value={choice.value}
                        defaultChecked={choice.defaultChecked}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="pb-3 text-center">
            <button
              className="rounded bg-green-500 px-10 py-2 font-medium text-white shadow-md transition-all hover:bg-green-600 hover:shadow-lg"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </section>
        </form>
      </Dialog>
    </Modal>
  );
}
