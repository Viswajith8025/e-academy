import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Loader2, BookOpen, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  avatar: string;
  program: string;
  progress: number;
  status: "active" | "at-risk" | "completed";
  joinedAt: string;
  tasksSubmitted: number;
  tasksApproved: number;
  tasksPending: number;
  totalTasks: number;
  pendingLeaves: number;
  openTickets: number;
}

const getStatusBadge = (status: StudentDetail["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    case "at-risk":
      return <Badge variant="destructive">At Risk</Badge>;
    case "completed":
      return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
  }
};

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Get logged-in teacher
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) {
        navigate("/login");
        return;
      }
      const sessionUser = JSON.parse(sessionUserStr);
      const mentorId = sessionUser.id;

      // Get teacher profile
      const { data: mentorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mentorId)
        .single();

      const mentorFullName = mentorData?.full_name || sessionUser.full_name;

      // Get assigned students
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .or(`mentor.eq.${mentorFullName},mentor.eq.${mentorId}`);

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const studentIds = studentsData.map(s => s.id);

      // Get total tasks count
      const { data: allTasks } = await supabase
        .from('module_tasks')
        .select('id');
      const totalTasks = allTasks?.length || 0;

      // Get submissions for these students
      const { data: subsData } = await supabase
        .from('task_submissions')
        .select('*')
        .in('user_id', studentIds);

      // Get leave requests
      const { data: leavesData } = await supabase
        .from('leave_requests')
        .select('user_id, status')
        .in('user_id', studentIds);

      // Get tickets
      const { data: ticketsData } = await supabase
        .from('tickets')
        .select('user_id, status')
        .in('user_id', studentIds);

      // Process each student
      const processedStudents: StudentDetail[] = studentsData.map((p: any) => {
        const studentSubs = (subsData || []).filter(s => s.user_id === p.id);
        const approved = studentSubs.filter(s => s.status === 'approved').length;
        const pending = studentSubs.filter(s => s.status === 'pending').length;
        const progress = totalTasks > 0 ? Math.round((approved / totalTasks) * 100) : 0;

        const pendingLeaves = (leavesData || []).filter(l => l.user_id === p.id && l.status === 'pending').length;
        const openTickets = (ticketsData || []).filter(t => t.user_id === p.id && (t.status === 'open' || t.status === 'in-progress')).length;

        const status: StudentDetail['status'] =
          progress === 100 ? 'completed' : progress < 30 ? 'at-risk' : 'active';

        return {
          id: p.id,
          name: p.full_name || "Unnamed",
          email: p.email || "",
          avatar: p.avatar_seed || "default",
          program: p.program || "General",
          progress,
          status,
          joinedAt: p.joined_at
            ? new Date(p.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A',
          tasksSubmitted: studentSubs.length,
          tasksApproved: approved,
          tasksPending: pending,
          totalTasks,
          pendingLeaves,
          openTickets,
        };
      });

      setStudents(processedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading students...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            My Students
          </h1>
          <p className="text-muted-foreground mt-1">
            View and track the progress of your assigned students
          </p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="premium-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
          <div className="premium-card p-4 text-center">
            <p className="text-2xl font-bold text-success">{students.filter(s => s.status === 'active').length}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="premium-card p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{students.filter(s => s.status === 'at-risk').length}</p>
            <p className="text-sm text-muted-foreground">At Risk</p>
          </div>
          <div className="premium-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{students.filter(s => s.status === 'completed').length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </motion.div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredStudents.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground border rounded-xl bg-card">
                {students.length === 0 ? "No students assigned to you yet." : "No students match your search."}
              </div>
            ) : (
              filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedStudent(student)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    selectedStudent?.id === student.id
                      ? "border-primary bg-accent/50 shadow-md ring-1 ring-primary/20"
                      : "border-border bg-card hover:bg-muted/50 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{student.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                    </div>
                    {getStatusBadge(student.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="flex-1 h-2" />
                    <span className="text-xs font-medium text-muted-foreground w-10 text-right">{student.progress}%</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Student Detail Panel */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <motion.div
                key={selectedStudent.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="premium-card p-6 space-y-6"
              >
                {/* Student Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.avatar}`} />
                    <AvatarFallback className="text-xl">{selectedStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground">{selectedStudent.name}</h2>
                    <p className="text-muted-foreground">{selectedStudent.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedStudent.status)}
                      <Badge variant="outline">{selectedStudent.program}</Badge>
                    </div>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Overall Progress</h3>
                    <span className="text-lg font-bold text-primary">{selectedStudent.progress}%</span>
                  </div>
                  <Progress value={selectedStudent.progress} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    Joined: {selectedStudent.joinedAt}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-muted/30 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {selectedStudent.tasksApproved}/{selectedStudent.totalTasks}
                    </p>
                    <p className="text-xs text-muted-foreground">Tasks Completed</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="h-4 w-4 text-warning" />
                    </div>
                    <p className="text-xl font-bold text-warning">{selectedStudent.tasksPending}</p>
                    <p className="text-xs text-muted-foreground">Tasks Pending Review</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <p className="text-xl font-bold text-foreground">{selectedStudent.tasksSubmitted}</p>
                    <p className="text-xs text-muted-foreground">Total Submissions</p>
                  </div>
                </div>

                {/* Action Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Action Items</h3>

                  {selectedStudent.pendingLeaves > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-warning/30 bg-warning/5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm">{selectedStudent.pendingLeaves} pending leave request(s)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => navigate('/teacher/leave')}
                      >
                        Review
                      </Button>
                    </div>
                  )}

                  {selectedStudent.openTickets > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-info/30 bg-info/5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-info" />
                        <span className="text-sm">{selectedStudent.openTickets} open ticket(s)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => navigate('/teacher/tickets')}
                      >
                        View
                      </Button>
                    </div>
                  )}

                  {selectedStudent.tasksPending > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">{selectedStudent.tasksPending} task(s) awaiting your review</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => navigate('/teacher/modules')}
                      >
                        Review
                      </Button>
                    </div>
                  )}

                  {selectedStudent.pendingLeaves === 0 && selectedStudent.openTickets === 0 && selectedStudent.tasksPending === 0 && (
                    <div className="p-3 rounded-lg border bg-muted/30 text-center text-sm text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-success" />
                      No pending actions for this student.
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="premium-card h-[500px] flex items-center justify-center border-dashed">
                <div className="text-center text-muted-foreground flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">Select a Student</h3>
                  <p className="max-w-[250px]">Click on a student from the list to view their detailed progress and action items.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;
