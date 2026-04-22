import { motion } from "framer-motion";
import { BookOpen, Clock, Award, Target } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import JourneyMap from "@/components/dashboard/JourneyMap";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import QuickActions from "@/components/dashboard/QuickActions";

const modules = [
  { id: 1, title: "Introduction to Program", status: "completed" as const, description: "Completed on Jan 15, 2025" },
  { id: 2, title: "Core Concepts", status: "completed" as const, description: "Completed on Jan 28, 2025" },
  { id: 3, title: "Practical Applications", status: "current" as const, description: "Task submission pending" },
  { id: 4, title: "Advanced Topics", status: "locked" as const },
  { id: 5, title: "Final Project", status: "locked" as const },
];

const notifications = [
  { id: 1, type: "success" as const, title: "Task Approved", message: "Your Module 2 task has been approved", time: "2h ago", isRead: false },
  { id: 2, type: "warning" as const, title: "Leave Request Pending", message: "Your leave request is awaiting approval", time: "5h ago", isRead: false },
  { id: 3, type: "info" as const, title: "New Module Available", message: "Module 3 is now unlocked for you", time: "1d ago", isRead: true },
  { id: 4, type: "event" as const, title: "Upcoming Session", message: "Live session with mentor tomorrow at 10 AM", time: "1d ago", isRead: true },
  { id: 5, type: "success" as const, title: "Certificate Earned", message: "You earned the 'Quick Learner' badge", time: "2d ago", isRead: true },
];

const Dashboard = () => {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, John! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your internship progress and stay on top of your learning journey.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              Web Development Internship
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Days Remaining"
            value="45"
            subtitle="of 90 days"
            icon={Clock}
            variant="primary"
          />
          <StatCard
            title="Modules Completed"
            value="2/5"
            subtitle="40% complete"
            icon={BookOpen}
            trend={{ value: 20, isPositive: true }}
          />
          <StatCard
            title="Tasks Submitted"
            value="8"
            subtitle="2 pending approval"
            icon={Target}
          />
          <StatCard
            title="Certificates"
            value="1"
            subtitle="Keep learning!"
            icon={Award}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Journey + Progress */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressCard
              programName="Web Development Internship"
              duration="3 Months Program"
              daysRemaining={45}
              totalDays={90}
              modulesCompleted={2}
              totalModules={5}
            />
            <JourneyMap modules={modules} />
          </div>

          {/* Right Column - Actions + Notifications */}
          <div className="space-y-6">
            <QuickActions />
            <NotificationsPanel notifications={notifications} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
