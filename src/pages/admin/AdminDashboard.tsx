import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Ticket, Calendar, TrendingUp, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activePrograms: 0,
    pendingTickets: 0,
    leaveRequests: 0
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Stats
      const [
        { count: studentsCount },
        { count: modulesCount },
        { count: ticketsCount },
        { count: leavesCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in-progress']),
        supabase.from('leave_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        totalStudents: studentsCount || 0,
        activePrograms: modulesCount || 0,
        pendingTickets: ticketsCount || 0,
        leaveRequests: leavesCount || 0
      });

      // 2. Fetch Recent Students
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('joined_at', { ascending: false })
        .limit(5);

      // Fetch all tasks for progress calculation
      const { data: tasksData } = await supabase.from('module_tasks').select('id');
      const totalTasks = tasksData?.length || 0;

      // Fetch approved submissions for these students
      const { data: approvedSubs } = await supabase
        .from('task_submissions')
        .select('user_id')
        .eq('status', 'approved');

      const approvedCountMap: Record<string, number> = {};
      approvedSubs?.forEach((sub: any) => {
        approvedCountMap[sub.user_id] = (approvedCountMap[sub.user_id] || 0) + 1;
      });

      const formattedStudents = (profilesData || []).map(p => {
        const approved = approvedCountMap[p.id] || 0;
        const progress = totalTasks ? Math.round((approved / totalTasks) * 100) : 0;
        return {
          id: p.id,
          name: p.full_name,
          avatar: p.avatar_seed,
          program: p.program,
          progress,
          status: progress < 50 ? 'at-risk' : 'active'
        };
      });
      setRecentStudents(formattedStudents);

      // 3. Fetch Pending Actions (Mixed Tickets and Leaves)
      const [
        { data: ticketsData },
        { data: leavesData }
      ] = await Promise.all([
        supabase.from('tickets').select('subject, created_at, status').eq('status', 'open').limit(3),
        supabase.from('leave_requests').select('type, applied_on, status').eq('status', 'pending').limit(3)
      ]);

      const actions = [
        ...(ticketsData || []).map(t => ({
          type: 'ticket',
          title: t.subject,
          time: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'
        })),
        ...(leavesData || []).map(l => ({
          type: 'leave',
          title: `Leave: ${l.type}`,
          time: l.applied_on ? new Date(l.applied_on).toLocaleDateString() : 'N/A'
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setPendingActions(actions);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
            value={stats.totalStudents.toString()}
            subtitle="Active enrollments"
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Active Programs"
            value={stats.activePrograms.toString()}
            subtitle="Published modules"
            icon={BookOpen}
          />
          <StatCard
            title="Pending Tickets"
            value={stats.pendingTickets.toString()}
            subtitle="Awaiting response"
            icon={Ticket}
            variant="warning"
          />
          <StatCard
            title="Leave Requests"
            value={stats.leaveRequests.toString()}
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
                <h3 className="font-semibold">Recent Students</h3>
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
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-4">Loading...</TableCell></TableRow>
                  ) : recentStudents.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-4">No students found</TableCell></TableRow>
                  ) : recentStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                            <AvatarFallback>{student.name[0]}</AvatarFallback>
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
              <h3 className="font-semibold">Recent Actions</h3>
              <Badge variant="secondary">{pendingActions.length}</Badge>
            </div>
            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : pendingActions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">All caught up!</div>
              ) : pendingActions.map((action, index) => (
                <div key={index} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${action.type === "ticket" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"}`}>
                      {action.type === "ticket" ? <AlertCircle className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{action.title}</p>
                      <span className="text-xs text-muted-foreground">{action.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

