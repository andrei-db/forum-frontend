import { roleColors } from "../utils/roleColors";

export default function Footer() {
  return (
    <footer className="mt-10 p-4 bg-neutral-900">
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
