import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Certificates from "./pages/Certificates";
import Tickets from "./pages/Tickets";

import Leave from "./pages/Leave";
import Extensions from "./pages/Extensions";
import Support from "./pages/Support";
import AddOns from "./pages/AddOns";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminModules from "./pages/admin/AdminModules";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminLeaves from "./pages/admin/AdminLeaves";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminExtensions from "./pages/admin/AdminExtensions";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherTickets from "./pages/TeacherTickets";
import TeacherModules from "./pages/TeacherModules";
import TeacherLeave from "./pages/TeacherLeave";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherMessages from "./pages/TeacherMessages";
import StudentMessages from "./pages/StudentMessages";
import StudentPortal from "./pages/StudentPortal";
import Careers from "./pages/Careers";
import Pathfinder from "./pages/Pathfinder";
import AdminCareers from "./pages/admin/AdminCareers";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => {
  // Session Doctor: Clear legacy master IDs automatically
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr && (userStr.includes("-master") || !userStr.includes("-"))) {
      // If it looks like a mock ID and not a UUID, clear it
      if (userStr.includes("student-master") || userStr.includes("teacher-master") || userStr.includes("admin-master")) {
        console.log("Cleaning legacy session...");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="eit-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pathfinder" element={<Pathfinder />} />
              <Route path="/careers" element={<Careers />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/mentor/:mentorName" element={<TeacherDashboard />} />
              <Route path="/teacher/modules" element={<TeacherModules />} />
              <Route path="/teacher/tickets" element={<TeacherTickets />} />
              <Route path="/teacher/leave" element={<TeacherLeave />} />
              <Route path="/teacher/students" element={<TeacherStudents />} />
              <Route path="/teacher/messages" element={<TeacherMessages />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/certificates" element={<Certificates />} />


              <Route path="/tickets" element={<Tickets />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/extensions" element={<Extensions />} />
              <Route path="/support" element={<Support />} />
              <Route path="/addons" element={<AddOns />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile/:userId?" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/student/messages" element={<StudentMessages />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/modules" element={<AdminModules />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/teachers" element={<AdminTeachers />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route path="/admin/leave" element={<AdminLeaves />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/extensions" element={<AdminExtensions />} />
              <Route path="/admin/careers" element={<AdminCareers />} />
              <Route path="/:studentName" element={<StudentPortal />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
