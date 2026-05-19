import { NavLink } from "react-router-dom";

export default function ForumActionBox({ user, forum }) {
  if (!forum?.id) return null;

  if (!user) {
    return (
      <div className="text-sm text-neutral-500 bg-neutral-900 border border-neutral-800 rounded p-4">
        You must be logged in to create a topic.
      </div>
    );
  }

  if (!forum.permissions?.canPostTopic && !user.group?.isStaff) {
    return (
      <div className="text-sm text-red-500 bg-yellow-950/20 border border-yellow-900/40 rounded p-4">
        You do not have permission to create topics in this forum.
      </div>
    );
  }

  return (
    <NavLink
      to={`/forums/${forum.id}/new-topic`}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      New topic
    </NavLink>
  );
}