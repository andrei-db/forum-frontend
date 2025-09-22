import AccountSidebar from "../components/AccountSidebar";
import { Outlet } from "react-router-dom";

export default function AccountLayout() {
  return (
    <div>
      <div className="flex items-start gap-6">
        <AccountSidebar />
        <main className="flex-1 bg-neutral-900 text-neutral-200 rounded-md shadow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
