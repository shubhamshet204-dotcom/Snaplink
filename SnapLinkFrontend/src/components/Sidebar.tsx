import { LayoutDashboard, Link2, CircleUserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      name: "My Links",
      icon: <Link2 className="w-5 h-5" />,
      path: "/links",
    },
    {
      name: "Profile Settings",
      icon: <CircleUserRound className="w-5 h-5" />,
      path: "/profile",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r-3 border-[#0C0C0C] min-h-[calc(100vh-4rem)] p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <p className="text-xs font-extrabold text-[#0C0C0C] uppercase tracking-wider px-2">
          Pages
        </p>
        <nav className="space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-extrabold transition-all duration-150 ${
                  isActive
                    ? "bg-[#FF5A00] text-[#0C0C0C] border-2 border-[#0C0C0C] shadow-[2px_2px_0px_0px_#0C0C0C]"
                    : "text-[#0C0C0C] border-2 border-transparent hover:border-[#0C0C0C] hover:bg-[#FFEFE5] hover:-translate-y-0.5"
                }`
              }
            >
              {item.icon}
              <span className="uppercase tracking-wide font-display">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 bg-[#FFEFE5] border-2 border-[#0C0C0C] shadow-[2px_2px_0px_0px_#0C0C0C]">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#0C0C0C] font-mono">
          <span className="w-2.5 h-2.5 bg-[#FF5A00] border border-[#0C0C0C]" />
          <span>CONNECTED PORT 8082</span>
        </div>
      </div>
    </aside>
  );
}
