import { Link } from "react-router-dom";
import { HomeIcon, ChevronRightIcon } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  return (
    <div className="mt-5 p-4 bg-neutral-700/30 rounded shadow flex justify-between">
      <div className="flex items-center gap-3 text-md font-bold">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-400">
          <HomeIcon size={22} />
          Home
        </Link>

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <ChevronRightIcon size={22} className="text-neutral-400" />

            {item.to ? (
              <Link to={item.to} className="hover:text-blue-400">
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-300">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}