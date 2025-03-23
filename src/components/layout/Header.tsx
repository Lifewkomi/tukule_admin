
import React from "react";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full h-16 flex items-center px-4 sm:px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="lg:hidden mr-2"
      >
        <Menu size={20} />
      </Button>
      
      <div className="flex-1" />
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 rounded-full"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden sm:inline-block">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
