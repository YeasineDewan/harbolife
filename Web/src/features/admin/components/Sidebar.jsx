import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Activity,
  X,
  Star,
  Truck,
} from "lucide-react";

const adminNavItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    end: true,
  },
  {
    label: "Users",
    icon: Users,
    path: "/dashboard/users",
    end: false,
  },
  {
    label: "Products",
    icon: Package,
    path: "/dashboard/products",
    end: false,
  },
  {
    label: "Categories",
    icon: Tag,
    path: "/dashboard/categories",
    end: false,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/dashboard/orders",
    end: false,
  },
  {
    label: "Reviews",
    icon: Star,
    path: "/dashboard/reviews",
    end: false,
  },
];

const courierNavItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    path: "/courier",
    end: true,
  },
  {
    label: "My Orders",
    icon: Truck,
    path: "/courier/orders",
    end: false,
  },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { user } = useSelector((state) => state.auth);
  const navItems = user?.role === "courier" ? courierNavItems : adminNavItems;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64",
          "bg-(--color-primary-700) shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 px-6 h-24 shrink-0 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6 text-(--color-primary-700)" />
          </div>
          <span className="text-2xl font-bold text-white tracking-wide">
            Rochetta
          </span>

          <button
            onClick={onMobileClose}
            className="ml-auto p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white md:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-1.5 px-4 scrollbar-hide">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              onNavigate={onMobileClose}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 block",
          isActive
            ? "bg-white/15 text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
            : "text-white/70 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <div className="flex items-center gap-3">
          <Icon
            className={`w-5 h-5 transition-transform duration-200 ${
              isActive ? "text-white scale-110" : "text-white/70"
            }`}
          />
          <span>{item.label}</span>
        </div>
      )}
    </NavLink>
  );
}
