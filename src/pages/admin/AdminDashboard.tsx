import { useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Ticket, Calendar, TrendingUp, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentStudents = [
  { id: 1, name: "Alice Johnson", avatar: "alice", program: "Web Development", progress: 75, status: "active" },
  { id: 2, name: "Bob Smith", avatar: "bob", program: "Data Science", progress: 45, status: "active" },
  { id: 3, name: "Carol White", avatar: "carol", program: "Mobile Development", progress: 90, status: "active" },
  { id: 4, name: "David Brown", avatar: "david", program: "Web Development", progress: 30, status: "at-risk" },
  { id: 5, name: "Eve Davis", avatar: "eve", program: "UI/UX Design", progress: 60, status: "active" },
];

const pendingActions = [
  { type: "ticket", title: "Login issues reported", user: "Alice Johnson", time: "2h ago" },
  { type: "leave", title: "Leave request for Feb 10-12", user: "Bob Smith", time: "3h ago" },
  { type: "ticket", title: "Certificate generation query", user: "Carol White", time: "5h ago" },
  { type: "leave", title: "Emergency leave request", user: "David Brown", time: "1d ago" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your learning management system
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value="524"
            subtitle="Active enrollments"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Active Programs"
            value="12"
            subtitle="Running courses"
            icon={BookOpen}
          />
          <StatCard
            title="Pending Tickets"
            value="18"
            subtitle="Awaiting response"
            icon={Ticket}
            variant="warning"
          />
          <StatCard
            title="Leave Requests"
            value="7"
            subtitle="Pending approval"
            icon={Calendar}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Progress */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Student Progress</h3>
                <Badge variant="secondary">{recentStudents.length} students</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{student.program}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} className="w-20 h-2" />
                          <span className="text-sm">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.status === "active" ? (
                          <Badge className="bg-success text-success-foreground">Active</Badge>
                        ) : (
                          <Badge variant="destructive">At Risk</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>

          {/* Pending Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="premium-card"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Pending Actions</h3>
              <Badge variant="secondary">{pendingActions.length}</Badge>
            </div>
            <div className="divide-y divide-border">
              {pendingActions.map((action, index) => (
                <div key={index} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${action.type === "ticket" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"}`}>
                      {action.type === "ticket" ? <AlertCircle className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{action.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Program Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6"
        >
          <h3 className="font-semibold mb-4">Program Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-primary">95%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-success">4.8</p>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-warning">24h</p>
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-info">89%</p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
