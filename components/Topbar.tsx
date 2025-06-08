"use client";

import { usePathname } from "next/navigation";

const getPageTitle = (pathname: string) => {
  if (pathname === "/dashboard") return "Dashboard Overview";
  if (pathname.startsWith("/dashboard/products")) return "Manage Products";
  if (pathname.startsWith("/dashboard/orders")) return "Orders";
  if (pathname.startsWith("/dashboard/customers")) return "Customers";
  return "Dashboard";
};

export default function Topbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname || "");  // <-- Here is the fix

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
        {title}
      </h1>

      <div className="text-sm text-gray-600">
        Logged in as <span className="font-medium text-blue-600">Admin</span>
      </div>
    </header>
  );
}
