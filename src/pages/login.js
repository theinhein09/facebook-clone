import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/modal";
import { Dialog } from "../components/dialog";
import { auth } from "../firebase/authentication";
import { useBoolean } from "../hooks";
import { months, days, years } from "../utils";
import { FS } from "../firebase/firestore";

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
      await auth._signIn(email, password);
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
    const user = await auth._signUp(email, password);
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
    const usersFS = new FS("users");
    await usersFS.setDoc(user.uid, formattedUser);
    navigate("/");
  }

  function handleNewUserChange({ target }) {
    setNewUser({ ...newUser, [target.name]: target.value });
  }
  return (
    <>
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
              className="bg-blue-500 text-white font-semibold rounded w-full py-3 hover:bg-blue-600 shadow-md hover:shadow-lg transition-all"
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
              className="bg-green-500 text-white px-3 py-3 rounded font-medium hover:shadow-lg shadow-md transition-all hover:bg-green-600"
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
            <form className="bg-white rounded-md ring-1 ring-neutral-100 shadow-2xl shadow-black">
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
                    className="ring-1 px-3 py-1.5 bg-neutral-50 rounded-md ring-neutral-300 mr-3 placeholder:text-sm"
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
                    className="ring-1 px-3 py-1.5 bg-neutral-50 rounded-md ring-neutral-300 placeholder:text-sm"
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
                    className="ring-1 px-3 py-1.5 bg-neutral-50 rounded-md ring-neutral-300 w-full placeholder:text-sm"
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
                    className="ring-1 px-3 py-1.5 bg-neutral-50 rounded-md ring-neutral-300 w-full placeholder:text-sm"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                  />
                </section>
                <section className="py-2">
                  <div className="text-xs text-neutral-600">Birthday</div>
                  <div role="presentation" className="flex justify-between">
                    <select
                      name="month"
                      className="w-1/4 ring-1 px-1 py-1.5 rounded-md ring-neutral-300 text-sm text-neutral-600 my-1"
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
                      className="w-1/4 ring-1 px-1 py-1.5 rounded-md ring-neutral-300 text-sm text-neutral-600 my-1"
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
                      className="w-1/4 ring-1 px-1 py-1.5 rounded-md ring-neutral-300 text-sm text-neutral-600 my-1"
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
                    <div className="w-1/4 ring-1 px-2 py-1.5 rounded-md ring-neutral-300 text-sm text-neutral-600 my-1">
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
                    <div className="w-1/4 ring-1 px-2 py-1.5 rounded-md ring-neutral-300 text-sm text-neutral-600 my-1">
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
                    <div className="w-1/4 ring-1 px-2 py-1.5 rounded-md ring-neutral-300 text-sm text-neutral-600 my-1">
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
              <section className="text-center pb-3">
                <button
                  className="bg-green-500 text-white px-10 py-2 rounded font-medium hover:shadow-lg shadow-md transition-all hover:bg-green-600"
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
