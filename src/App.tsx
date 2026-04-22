import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Tickets from "./pages/Tickets";
import Leave from "./pages/Leave";
import Extensions from "./pages/Extensions";
import Support from "./pages/Support";
import AddOns from "./pages/AddOns";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminModules from "./pages/admin/AdminModules";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/extensions" element={<Extensions />} />
          <Route path="/support" element={<Support />} />
          <Route path="/addons" element={<AddOns />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/modules" element={<AdminModules />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/tickets" element={<Tickets />} />
          <Route path="/admin/leave" element={<Leave />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
