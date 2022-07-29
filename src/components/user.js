export function User({ user, status }) {
  return (
    <section className="py-2 flex items-center">
      <div
        role="presentation"
        className="max-w-10 max-h-40 ml-1 mr-2 rounded-full"
      >
        <img
          src={user.profileUrl}
          alt="avatar"
          width={40}
          height={40}
          className="object-center aspect-square"
        />
      </div>
      <div className="text-sm font-light flex-col gap-2">
        <h3 className="font-semibold">{user.username}</h3>
        <div className="text-xs">{status}</div>
      </div>
    </section>
  );
}
