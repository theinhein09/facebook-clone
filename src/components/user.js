import { Image } from "./image";

export function User({ user, status }) {
  return (
    <section className="py-2 flex items-center">
      <div
        role="presentation"
        className="max-w-10 max-h-40 ml-1 mr-2 rounded-full"
      >
        <Image
          publicId={user.profileUrl}
          transform={{ type: "profile-pic", width: 40, height: 40 }}
        />
      </div>
      <div className="text-sm font-light flex-col gap-2">
        <h3 className="font-semibold">{user.username}</h3>
        <div className="text-xs">{status}</div>
      </div>
    </section>
  );
}
