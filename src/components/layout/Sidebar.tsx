
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  CalendarDays, 
  ShoppingBag,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const sidebarItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: UtensilsCrossed },
    { name: "Reservations", path: "/reservations", icon: CalendarDays },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />
      
      <aside 
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 z-30 bg-sidebar flex flex-col transition-transform duration-300 ease-in-out transform lg:translate-x-0 shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-semibold text-sidebar-foreground">Resto Admin</h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden text-sidebar-foreground">
            <Menu size={20} />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={logout}
            className="sidebar-item w-full justify-center"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
