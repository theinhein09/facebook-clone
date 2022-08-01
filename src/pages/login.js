import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/modal";
import { Dialog } from "../components/dialog";
import { Auth } from "../firebase/authentication";
import { useBoolean } from "../hooks";
import { months, days, years } from "../utils";
import { Users } from "../firebase/firestore";

const today = new Date();
export function Login() {
  const [{ email, password }, setUser] = useState({ email: "", password: "" });
  const [signUp, { toggle: toggleSignUp }] = useBoolean(false);
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    day: today.getDay(),
    month: today.getMonth(),
    year: today.getFullYear(),
    gender: "female",
  });

  function handleChange({ target }) {
    setUser((user) => ({ ...user, [target.name]: target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await Auth.signIn(email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  function handleSignUpDialog(evt) {
    evt.preventDefault();
    toggleSignUp();
  }

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
            className="mb-3 block w-full rounded p-3 ring-1 ring-neutral-200"
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
            className="mb-3 block w-full rounded p-3 ring-1 ring-neutral-200"
          />
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
      {signUp ? (
        <Modal toggle={toggleSignUp} bgColor="bg-white/50">
          <Dialog>
            <form className="rounded-md bg-white shadow-2xl shadow-black ring-1 ring-neutral-100">
              <header className="p-4">
                <h2 className="text-3xl font-semibold">Sign Up</h2>
              </header>
              <hr />
              <div role="presentation" className="p-4">
                <section className="mb-3">
                  <label htmlFor="firstName" className="sr-only">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    className="mr-3 rounded-md bg-neutral-50 px-3 py-1.5 ring-1 ring-neutral-300 placeholder:text-sm"
                    value={newUser.firstName}
                    onChange={handleNewUserChange}
                  />
                  <label htmlFor="lastName" className="sr-only">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    className="rounded-md bg-neutral-50 px-3 py-1.5 ring-1 ring-neutral-300 placeholder:text-sm"
                    value={newUser.lastName}
                    onChange={handleNewUserChange}
                  />
                </section>
                <section className="mb-3">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-md bg-neutral-50 px-3 py-1.5 ring-1 ring-neutral-300 placeholder:text-sm"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                  />
                </section>
                <section className="mb-3">
                  <label htmlFor="password" className="sr-only">
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="New password"
                    className="w-full rounded-md bg-neutral-50 px-3 py-1.5 ring-1 ring-neutral-300 placeholder:text-sm"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                  />
                </section>
                <section className="py-2">
                  <div className="text-xs text-neutral-600">Birthday</div>
                  <div role="presentation" className="flex justify-between">
                    <select
                      name="month"
                      className="my-1 w-1/4 rounded-md px-1 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300"
                      value={newUser.month}
                      onChange={handleNewUserChange}
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      name="day"
                      className="my-1 w-1/4 rounded-md px-1 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300"
                      value={newUser.day}
                      onChange={handleNewUserChange}
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      name="year"
                      className="my-1 w-1/4 rounded-md px-1 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300"
                      value={newUser.year}
                      onChange={handleNewUserChange}
                    >
                      {years().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>
                <section className="py-2">
                  <div className="text-xs text-neutral-600">Gender</div>
                  <div
                    role="presentation"
                    className="flex justify-between"
                    onChange={handleNewUserChange}
                  >
                    <div className="my-1 w-1/4 rounded-md px-2 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300">
                      <label htmlFor="female" className="flex justify-between">
                        Female
                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          defaultChecked
                        />
                      </label>
                    </div>
                    <div className="my-1 w-1/4 rounded-md px-2 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300">
                      <label htmlFor="male" className="flex justify-between">
                        Male
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                        />
                      </label>
                    </div>
                    <div className="my-1 w-1/4 rounded-md px-2 py-1.5 text-sm text-neutral-600 ring-1 ring-neutral-300">
                      <label htmlFor="other" className="flex justify-between">
                        Other
                        <input
                          type="radio"
                          id="other"
                          name="gender"
                          value="other"
                        />
                      </label>
                    </div>
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
      ) : null}
    </>
  );
}
