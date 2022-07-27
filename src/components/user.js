export function User({ user, status }) {
  return (
    <section className="py-2">
      <span
        role="presentation"
        className="max-w-10 max-h-40 inline-block ml-1 mr-2"
      >
        <img
          src={user.profileUrl}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-[100%] object-center aspect-square"
        />
      </span>
      <span className="inline-block text-sm font-light align-top pt-2">
        <h3 className="font-semibold leading-3">{user.username}</h3>
        <span className="text-xs">{status}</span>
      </span>
    </section>
  );
}
