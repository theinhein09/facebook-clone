import { Link } from "react-router-dom";
import { Image } from "./image";

export function User({ user, status }) {
  return (
    <Link to={`/${user.id}/posts`}>
      <section className="flex items-center py-2">
        <div
          role="presentation"
          className="max-w-10 ml-1 mr-2 max-h-40 rounded-full"
        >
          <Image
            publicId={user.profileUrl}
            transform={{ type: "profile-pic", width: 40, height: 40 }}
          />
        </div>
        <div className="flex-col gap-2 text-sm font-light">
          <h3 className="font-semibold">{user.username}</h3>
          <div className="text-xs">{status}</div>
        </div>
      </section>
    </Link>
  );
}
