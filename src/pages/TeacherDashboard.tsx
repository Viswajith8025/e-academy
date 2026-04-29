import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  program: string;
  progress: number;
  status: "ahead" | "on-track" | "at-risk";
  avatar: string;
}

interface PendingTask {
  id: string;
  student: string;
  module: string;
  task: string;
  submittedAt: string;
  avatar: string;
}

interface LeaveRequest {
  id: string;
  studentName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
}

interface TicketRequest {
  id: string;
  studentName: string;
  subject: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "ahead": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "on-track": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "at-risk": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default: return "bg-muted text-muted-foreground";
  }
};

const TeacherDashboard = () => {
  const { mentorName } = useParams();
  const [mentorProfile, setMentorProfile] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [tickets, setTickets] = useState<TicketRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [mentorName]);

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

      // Verify the user is a teacher
      if (sessionUser.role !== "teacher" && sessionUser.role !== "admin") {
        toast.error("Unauthorized access");
        navigate("/login");
        return;
      }

      const decodedName = mentorName?.replace(/-/g, ' ') || sessionUser.full_name;
      const mentorId = sessionUser.id;

      // 1. Fetch mentor profile
      const { data: mentorData, error: mentorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mentorId)
        .single();

      if (mentorError) {
        console.warn("Mentor profile not found in DB, using session data");
        setMentorProfile(sessionUser);
      } else {
        setMentorProfile(mentorData);
      }

      const mentorFullName = mentorData?.full_name || sessionUser.full_name;

      // 2. Fetch assigned students
      // Filtering by mentor field in profiles
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .or(`mentor.eq.${mentorFullName},mentor.eq.${mentorId}`);

      if (studentsError) throw studentsError;

      const studentIds = studentsData.map(s => s.id);

      // 3. Fetch Data for these students
      if (studentIds.length > 0) {
        // Submissions
        const { data: subsData } = await supabase
          .from('task_submissions')
          .select('*, module_tasks(title, modules(title)), profiles(full_name, avatar_seed)')
          .in('user_id', studentIds);

        // Leaves
        const { data: leavesData } = await supabase
          .from('leave_requests')
          .select('*, profiles(full_name)')
          .in('user_id', studentIds)
          .order('applied_on', { ascending: false });

        // Tickets
        const { data: ticketsData } = await supabase
          .from('tickets')
          .select('*, profiles(full_name)')
          .in('user_id', studentIds)
          .order('created_at', { ascending: false });

        // Total Tasks for progress calculation
        const { data: tasksCountData } = await supabase.from('module_tasks').select('id');
        const totalTasks = tasksCountData?.length || 1;

        // Process Students Stats
        const studentStats = studentsData.map(s => {
          const studentSubs = (subsData || []).filter(sub => sub.user_id === s.id);
          const approvedCount = studentSubs.filter(sub => sub.status === 'approved').length;
          const progress = Math.round((approvedCount / totalTasks) * 100);

          return {
            id: s.id,
            name: s.full_name || "Unnamed Student",
            program: s.program || "Unknown",
            progress,
            status: progress > 80 ? "ahead" : progress > 40 ? "on-track" : "at-risk",
            avatar: s.avatar_seed || "default"
          } as Student;
        });
        setStudents(studentStats);

        // Process Pending Tasks
        const pending = (subsData || [])
          .filter(sub => sub.status === 'pending')
          .map(sub => ({
            id: sub.id,
            student: sub.profiles?.full_name || "Unknown Student",
            module: sub.module_tasks?.modules?.title || "Unknown Module",
            task: sub.module_tasks?.title || "Unknown Task",
            submittedAt: new Date(sub.submitted_at).toLocaleDateString(),
            avatar: sub.profiles?.avatar_seed || "default"
          }));
        setPendingTasks(pending);

        // Process Leaves
        setLeaveRequests((leavesData || []).map(l => ({
          id: l.id,
          studentName: l.profiles?.full_name || "Unknown",
          type: l.type,
          startDate: l.start_date,
          endDate: l.end_date,
          reason: l.reason,
          status: l.status,
          appliedOn: new Date(l.applied_on).toLocaleDateString()
        })));

        // Process Tickets
        setTickets((ticketsData || []).map(t => ({
          id: t.id,
          studentName: t.profiles?.full_name || "Unknown",
          subject: t.subject,
          category: t.category,
          status: t.status,
          priority: t.priority,
          createdAt: new Date(t.created_at).toLocaleDateString()
        })));
      }

    } catch (error: any) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (table: string, id: string, status: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`${table.replace('_', ' ')} updated to ${status}`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error("Action failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const avgProgress = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
    : 0;

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
              Welcome, {mentorProfile?.full_name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              You have <span className="text-primary font-semibold">{pendingTasks.length + leaveRequests.filter(l => l.status === 'pending').length} items</span> awaiting your review.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              Mentor Account
            </Badge>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Assigned Students" value={students.length.toString()} icon={Users} variant="primary" />
          <StatCard title="Pending Tasks" value={pendingTasks.length.toString()} icon={FileText} />
          <StatCard title="Avg. Progress" value={`${avgProgress}%`} icon={TrendingUp} variant="success" />
          <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length.toString()} icon={MessageSquare} />
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tasks" className="gap-2">
              <FileText className="h-4 w-4" />
              Task Submissions
            </TabsTrigger>
            <TabsTrigger value="leaves" className="gap-2">
              <Calendar className="h-4 w-4" />
              Leave Requests
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Support Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="premium-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Pending Task Reviews</h2>
                  <div className="space-y-3">
                    {pendingTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-10">No pending submissions.</p>
                    ) : pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.avatar}`} />
                            <AvatarFallback>{task.student[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{task.student}</p>
                            <p className="text-xs text-muted-foreground">{task.module} · {task.task}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleAction('task_submissions', task.id, 'rejected')}>Reject</Button>
                          <Button size="sm" className="h-8 text-xs" onClick={() => handleAction('task_submissions', task.id, 'approved')}>Approve</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="premium-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Assigned Students</h2>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{student.name}</p>
                            <Badge className={statusColor(student.status)} variant="secondary">{student.status}</Badge>
                          </div>
                          <Progress value={student.progress} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="premium-card p-6">
                  <h2 className="text-lg font-semibold mb-4">Mentor Quick Stats</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{avgProgress}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Active Projects</span>
                      <span className="font-medium">{students.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">{"< 24h"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaves">
            <div className="premium-card p-6">
              <h2 className="text-lg font-semibold mb-4">Student Leave Requests</h2>
              <div className="space-y-3">
                {leaveRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">No leave requests found.</p>
                ) : leaveRequests.map((leave) => (
                  <div key={leave.id} className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{leave.studentName}</span>
                        <Badge variant="outline">{leave.type}</Badge>
                      </div>
                      <Badge className={
                        leave.status === 'pending' ? 'bg-warning text-warning-foreground' :
                          leave.status === 'approved' ? 'bg-success text-success-foreground' : 'bg-destructive'
                      }>
                        {leave.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{leave.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Applied: {leave.appliedOn}</span>
                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => handleAction('leave_requests', leave.id, 'rejected')}>
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Deny
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-success text-success hover:bg-success hover:text-white" onClick={() => handleAction('leave_requests', leave.id, 'approved')}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <div className="premium-card p-6">
              <h2 className="text-lg font-semibold mb-4">Support Tickets</h2>
              <div className="space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">No support tickets assigned.</p>
                ) : tickets.map((ticket) => (
                  <Link to="/tickets" key={ticket.id} className="block group">
                    <div className="p-4 rounded-xl border border-border bg-card group-hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{ticket.subject}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{ticket.priority}</Badge>
                          <Badge className={
                            ticket.status === 'resolved' ? 'bg-success' :
                              ticket.status === 'open' ? 'bg-info' : 'bg-warning'
                          }>
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>From: {ticket.studentName} · {ticket.category}</span>
                        <span>{ticket.createdAt}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
