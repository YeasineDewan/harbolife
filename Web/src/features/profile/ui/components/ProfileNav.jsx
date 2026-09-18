import { Link, useLocation } from "react-router-dom";

export default function ProfileNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Personal Information", path: "/profile/personal-info" },
    { label: "Orders", path: "/profile/orders" },
    { label: "Saved Items", path: "/profile/wishlist" },
  ];

  return (
    <nav>
      <ul className="flex flex-wrap gap-6 sm:gap-8">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;

          return (
            <li key={index} className="relative">
              <Link
                to={item.path}
                className={`py-4 flex items-center gap-1 font-bold text-sm sm:text-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-(--color-primary-700) border-b-4 border-(--color-primary-700)"
                    : "text-(--color-text-body) hover:text-(--color-primary-600) border-b-4 border-transparent"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
