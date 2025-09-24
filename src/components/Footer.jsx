import { roleColors } from "../utils/roleColors";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import OnlineUsers from "./OnlineUsers";
export default function Footer() {
  const [countTopics, setCountTopics] = useState(null);
  const [countPosts, setCountPosts] = useState(null);
  const [countUsers, setCountUsers] = useState(null);
  const [latestUser, setLatestUser] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/topics/count")
      .then(data => setCountTopics(data.count))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    api("/posts/count")
      .then(data => setCountPosts(data.count))
      .catch(err => setError(err.message));
  }, []);
  useEffect(() => {
    api("/auth/count")
      .then(data => setCountUsers(data.count))
      .catch(err => setError(err.message));
  }, []);
  useEffect(() => {
    api("/auth/latest")
      .then(setLatestUser)
      .catch(err => setError(err.message));
  }, []);


  if (error) return <p className="text-red-500">{error}</p>;
  if (countTopics === null) return <p>Loading...</p>;

  return (
    <footer className="my-5 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-5">
        <div className="flex flex-col justify-center items-center bg-neutral-800 rounded p-2">
          <span className="font-semibold text-xl">{countTopics}</span>
          <span className="uppercase text-sm">Topics</span>
        </div>
        <div className="flex flex-col justify-center items-center bg-neutral-800 rounded p-2">
          <span className="font-semibold text-xl">{countPosts}</span>
          <span className="uppercase text-sm">Messages</span>
        </div>
        <div className="flex flex-col justify-center items-center bg-neutral-800 rounded p-2">
          <span className="font-semibold text-xl">{countUsers}</span>
          <span className="uppercase text-sm">Members</span>
        </div>
        <div className="flex flex-col justify-center items-center bg-neutral-800 rounded p-2">
          <span className={`${roleColors[latestUser.role]} text-semibold text-lg`}>{latestUser.username}</span>
          <span className="uppercase text-sm">Latest member</span>
        </div>
      </div>
      <OnlineUsers />
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <span>
          <b className={roleColors.admin}>Admin</b>
        </span>
        <span>
          <b className={roleColors.moderator}>Moderator</b>
        </span>
        <span>
          <b className={roleColors.user}>User</b>
        </span>
      </div>
      <p className="text-center text-gray-500 text-xs mt-3">
        © {new Date().getFullYear()} Forum MVP. Designed by andreidb. All rights reserved.
      </p>
    </footer>
  );
}
