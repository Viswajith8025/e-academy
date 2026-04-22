import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const pendingTasks = [
  { id: 1, student: "John Doe", module: "Core Concepts", task: "API Integration Task", submittedAt: "2 hours ago", avatar: "JD" },
  { id: 2, student: "Sarah Wilson", module: "Practical Applications", task: "Database Design", submittedAt: "5 hours ago", avatar: "SW" },
  { id: 3, student: "Mike Chen", module: "Introduction", task: "Environment Setup", submittedAt: "1 day ago", avatar: "MC" },
  { id: 4, student: "Emily Brown", module: "Core Concepts", task: "REST API Documentation", submittedAt: "1 day ago", avatar: "EB" },
];

const myStudents = [
  { id: 1, name: "John Doe", program: "Web Development", progress: 65, status: "on-track", avatar: "JD" },
  { id: 2, name: "Sarah Wilson", program: "Web Development", progress: 45, status: "on-track", avatar: "SW" },
  { id: 3, name: "Mike Chen", program: "Data Science", progress: 30, status: "at-risk", avatar: "MC" },
  { id: 4, name: "Emily Brown", program: "Web Development", progress: 80, status: "ahead", avatar: "EB" },
  { id: 5, name: "Alex Kumar", program: "Data Science", progress: 55, status: "on-track", avatar: "AK" },
];

const recentActivity = [
  { id: 1, action: "Approved task", detail: "John Doe - API Integration", time: "1h ago", icon: CheckCircle2 },
  { id: 2, action: "New submission", detail: "Sarah Wilson - Database Design", time: "5h ago", icon: FileText },
  { id: 3, action: "Leave request", detail: "Mike Chen - 3 days leave", time: "6h ago", icon: Clock },
  { id: 4, action: "Ticket raised", detail: "Emily Brown - Module access issue", time: "1d ago", icon: MessageSquare },
];

const statusColor = (status: string) => {
  switch (status) {
    case "ahead": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "on-track": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "at-risk": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const TeacherDashboard = () => {
  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome, Dr. Smith! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              You have <span className="text-primary font-semibold">4 pending reviews</span> and <span className="text-primary font-semibold">5 active students</span>.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              4.8 Rating
            </Badge>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Students" value="5" subtitle="2 programs" icon={Users} variant="primary" />
          <StatCard title="Pending Reviews" value="4" subtitle="Tasks awaiting approval" icon={FileText} trend={{ value: 12, isPositive: false }} />
          <StatCard title="Approved This Week" value="12" subtitle="3 more than last week" icon={CheckCircle2} variant="success" trend={{ value: 33, isPositive: true }} />
          <StatCard title="Avg. Student Progress" value="55%" subtitle="Across all students" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Task Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-card p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Pending Task Reviews
                </h2>
                <Badge variant="secondary">{pendingTasks.length} pending</Badge>
              </div>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {task.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{task.student}</p>
                        <p className="text-sm text-muted-foreground">{task.module} · {task.task}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground hidden sm:block">{task.submittedAt}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">Reject</Button>
                        <Button size="sm" className="text-xs">Approve</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* My Students */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  My Students
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {myStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                      {student.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground truncate">{student.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(student.status)}`}>
                          {student.status.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={student.progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground font-medium w-8">{student.progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{student.program}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="premium-card p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FileText, label: "Review Tasks", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
                  { icon: MessageSquare, label: "Messages", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
                  { icon: BookOpen, label: "Modules", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
                  { icon: Clock, label: "Leave Requests", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-foreground">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="premium-card p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
