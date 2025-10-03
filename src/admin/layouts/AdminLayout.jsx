import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-200">
      <aside className="w-64 bg-neutral-800 p-4 space-y-4">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
