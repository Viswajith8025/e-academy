import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Award, Target, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import JourneyMap from "@/components/dashboard/JourneyMap";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import QuickActions from "@/components/dashboard/QuickActions";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    daysRemaining: 45,
    totalDays: 90,
    modulesCompleted: 0,
    totalModules: 0,
    tasksSubmitted: 0,
    pendingTasks: 0,
    certificates: 0
  });
  const [journeyModules, setJourneyModules] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Get Current User from Session
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }
      const sessionUser = JSON.parse(sessionUserStr);

      // Verify the user is a student
      if (sessionUser.role !== "student" && sessionUser.role !== "admin") {
        toast.error("Unauthorized access");
        navigate("/login");
        return;
      }

      // Fetch the full profile from DB to ensure fresh data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (profileError) {
        console.warn("Profile not found in DB, using session data");
        setProfile(sessionUser);
      } else {
        setProfile(profileData);
      }

      const userId = profileData?.id || sessionUser.id;

      // 2. Fetch Modules for Journey Map
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .eq('is_published', true)
        .order('order_num', { ascending: true });

      // 3. Fetch Submissions to calculate progress for this specific student
      const { data: subsData } = await supabase
        .from('task_submissions')
        .select('*, module_tasks(module_id)')
        .eq('user_id', userId);

      // 4. Fetch Notifications for this student (personal + role-based + global)
      const { data: notifyData } = await supabase
        .from('notifications')
        .select('*')
        .or(`target_role.eq.${sessionUser.role},target_role.eq.all,user_id.eq.${userId}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      // Process Stats
      const totalModules = modulesData?.length || 0;
      const approvedTaskIds = new Set((subsData || []).filter(s => s.status === 'approved').map(s => s.task_id));

      // Map tasks to modules to see which modules are "completed"
      const { data: allTasks } = await supabase.from('module_tasks').select('*');

      const moduleStats = (modulesData || []).map(m => {
        const moduleTasks = (allTasks || []).filter(t => t.module_id === m.id);
        const completed = moduleTasks.length > 0 && moduleTasks.every(t => approvedTaskIds.has(t.id));
        return {
          id: m.order_num,
          title: m.title,
          status: completed ? "completed" : "locked", // Simplified for journey map
          description: completed ? "Completed" : "In Progress"
        };
      });

      // Update current module status
      let currentFound = false;
      const finalModules = moduleStats.map(m => {
        if (m.status === "locked" && !currentFound) {
          currentFound = true;
          return { ...m, status: "current" as const };
        }
        return m;
      });

      setJourneyModules(finalModules);

      const completedModulesCount = finalModules.filter(m => m.status === "completed").length;
      const pendingCount = (subsData || []).filter(s => s.status === 'pending').length;

      setStats({
        daysRemaining: 45, // Static for now
        totalDays: 90,
        modulesCompleted: completedModulesCount,
        totalModules: totalModules,
        tasksSubmitted: (subsData || []).length,
        pendingTasks: pendingCount,
        certificates: completedModulesCount === totalModules ? 1 : 0
      });

      setRecentNotifications((notifyData || []).map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: n.is_read
      })));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

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
              Welcome back, {profile?.full_name || "Student"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your internship progress and stay on top of your learning journey.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              {profile?.program || "General Internship"}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Days Remaining"
            value={stats.daysRemaining.toString()}
            subtitle={`of ${stats.totalDays} days`}
            icon={Clock}
            variant="primary"
          />
          <StatCard
            title="Modules Completed"
            value={`${stats.modulesCompleted}/${stats.totalModules}`}
            subtitle={`${Math.round((stats.modulesCompleted / stats.totalModules) * 100 || 0)}% complete`}
            icon={BookOpen}
          />
          <StatCard
            title="Tasks Submitted"
            value={stats.tasksSubmitted.toString()}
            subtitle={`${stats.pendingTasks} pending review`}
            icon={Target}
          />
          <StatCard
            title="Certificates"
            value={stats.certificates.toString()}
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
              programName={profile?.program || "Your Internship"}
              duration="3 Months Program"
              daysRemaining={stats.daysRemaining}
              totalDays={stats.totalDays}
              modulesCompleted={stats.modulesCompleted}
              totalModules={stats.totalModules}
            />
            <JourneyMap modules={journeyModules} />
          </div>

          {/* Right Column - Actions + Notifications */}
          <div className="space-y-6">
            <QuickActions />
            <NotificationsPanel notifications={recentNotifications} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
