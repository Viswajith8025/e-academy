import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "student" | "teacher" | "admin";
}

const DashboardLayout = ({ children, role = "student" }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} />
      <Header isCollapsed={isCollapsed} />
      <main 
        className="pt-16 transition-all duration-300 min-h-screen"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
