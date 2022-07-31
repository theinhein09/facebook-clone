import { NavLink } from "react-router-dom";
import { Navbar } from "./navbar";
import { ProfileHeader } from "./profile-header";

export function ProfileLayout({ user, children }) {
  return (
    <div role="presentation" className="bg-neutral-200">
      <Navbar />
      <header>
        <ProfileHeader user={user} />
      </header>
      {children}
    </div>
  );
}
