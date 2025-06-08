"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart,
} from "lucide-react";

const links = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "All-Orders", href: "/all-orders", icon: ShoppingCart },
  { name: "Products", href: "/Products", icon: Package },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
];

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between py-6",
          isCollapsed ? "px-2 justify-center" : "px-4"
        )}
      >
        {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">Admin</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-100 transition"
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-gray-600 hover:text-blue-600" />
          ) : (
            <ChevronLeft size={20} className="text-gray-600 hover:text-blue-600" />
          )}
        </button>
      </div>

      <nav className="flex flex-col space-y-2 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-blue-600 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-500"
              )}
            >
              <Icon className="w-5 h-5 mr-2 shrink-0" />
              {!isCollapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}



