import { NavLink } from "react-router-dom";

const sections = [
  {
    title: "Settings",
    items: [
      { label: "Account details", path: "/account/account-details" },
      { label: "Password and security", path: "/account/security" }
      
    ],
  },
];

export default function AccountSidebar() {
  return (
    <aside className="w-64 shrink-0 bg-neutral-900 text-neutral-300 rounded-md shadow p-4 space-y-6">
      {sections.map((s) => (
        <div key={s.title}>
          <h3 className="text-xs uppercase font-semibold text-neutral-400 mb-2 tracking-wider">
            {s.title}
          </h3>
          <ul className="space-y-1">
            {s.items.map((i) => (
              <li key={i.path}>
                <NavLink
                  to={i.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded transition ${
                      isActive
                        ? "bg-neutral-800 text-white font-medium"
                        : "hover:bg-neutral-800"
                    }`
                  }
                >
                  {i.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
