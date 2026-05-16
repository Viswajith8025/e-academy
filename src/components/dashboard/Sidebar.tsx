import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Ticket,
  Calendar,
  Clock,
  Users,
  Package,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageCircle,
  Briefcase,
  Award,
} from "lucide-react";

import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "student" | "teacher" | "admin";
}

const studentLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Modules", href: "/modules" },
  { icon: Ticket, label: "Tickets", href: "/tickets" },
  { icon: Calendar, label: "Leave", href: "/leave" },
  { icon: Clock, label: "Extensions", href: "/extensions" },
  { icon: Users, label: "Support", href: "/support" },
  { icon: Package, label: "Add-Ons", href: "/addons" },
  { icon: MessageCircle, label: "Inbox", href: "/student/messages" },
  { icon: Award, label: "Certificates", href: "/certificates" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];


const teacherLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/teacher-dashboard" },
  { icon: BookOpen, label: "Modules", href: "/teacher/modules" },
  { icon: Users, label: "Students", href: "/teacher/students" },
  { icon: Ticket, label: "Tickets", href: "/teacher/tickets" },
  { icon: Calendar, label: "Leave Requests", href: "/teacher/leave" },
  { icon: Clock, label: "Extensions", href: "/extensions" },
  { icon: Users, label: "Support", href: "/support" },
  { icon: Package, label: "Add-Ons", href: "/addons" },
  { icon: MessageCircle, label: "Inbox", href: "/teacher/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

const adminLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Shield, label: "Manage Modules", href: "/admin/modules" },
  { icon: Users, label: "Manage Students", href: "/admin/students" },
  { icon: Users, label: "Manage Teachers", href: "/admin/teachers" },
  { icon: Ticket, label: "Tickets", href: "/admin/tickets" },
  { icon: Calendar, label: "Leave Requests", href: "/admin/leave" },
  { icon: Clock, label: "Manage Extensions", href: "/admin/extensions" },
  {icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Briefcase, label: "Manage Careers", href: "/admin/careers" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const Sidebar = ({ role }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = role === "admin" ? adminLinks : role === "teacher" ? teacherLinks : studentLinks;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar z-50 flex flex-col border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Logo showText={true} size="sm" className="text-sidebar-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
