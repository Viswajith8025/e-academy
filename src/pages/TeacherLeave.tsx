import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { sendNotification } from "@/lib/notifications";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  studentName: string;
  studentAvatar: string;
  studentId: string;
}

const getStatusBadge = (status: LeaveRequest["status"]) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-warning text-warning-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-success text-success-foreground">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
  }
};

const TeacherLeave = () => {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      // Get logged-in teacher
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) {
        navigate("/login");
        return;
      }
      const sessionUser = JSON.parse(sessionUserStr);
      const mentorId = sessionUser.id;

      // Get teacher profile for name-based matching
      const { data: mentorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mentorId)
        .single();

      const mentorFullName = mentorData?.full_name || sessionUser.full_name;

      // Get assigned students
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_seed')
        .eq('role', 'student')
        .or(`mentor.eq.${mentorFullName},mentor.eq.${mentorId}`);

      const studentIds = (studentsData || []).map(s => s.id);
      const studentMap: Record<string, { name: string; avatar: string }> = {};
      (studentsData || []).forEach(s => {
        studentMap[s.id] = { name: s.full_name || "Unknown", avatar: s.avatar_seed || "default" };
      });

      if (studentIds.length === 0) {
        setLeaveRequests([]);
        setLoading(false);
        return;
      }

      // Fetch leave requests from assigned students
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .in('user_id', studentIds)
        .order('applied_on', { ascending: false });

      if (error) throw error;

      const formattedData: LeaveRequest[] = (data || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        startDate: item.start_date,
        endDate: item.end_date,
        days: item.days,
        reason: item.reason,
        status: item.status,
        appliedOn: new Date(item.applied_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        studentName: studentMap[item.user_id]?.name || "Unknown Student",
        studentAvatar: studentMap[item.user_id]?.avatar || "default",
        studentId: item.user_id,
      }));

      setLeaveRequests(formattedData);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Notify student
      const leave = leaveRequests.find(l => l.id === id);
      if (leave) {
        await sendNotification(
          `Leave Request ${newStatus.toUpperCase()}`,
          `Your leave request for ${leave.startDate} has been ${newStatus}.`,
          newStatus === 'approved' ? 'success' : 'error',
          leave.studentId
        );
      }

      toast.success(`Leave request ${newStatus}!`);
      setLeaveRequests(prev =>
        prev.map(leave => leave.id === id ? { ...leave, status: newStatus } : leave)
      );
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error("Failed to update status");
    }
  };

  const filteredRequests = leaveRequests.filter(l =>
    filterStatus === "all" || l.status === filterStatus
  );

  const stats = {
    total: leaveRequests.length,
    approved: leaveRequests.filter((l) => l.status === "approved").length,
    pending: leaveRequests.filter((l) => l.status === "pending").length,
    rejected: leaveRequests.filter((l) => l.status === "rejected").length,
  };

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading leave requests...</p>
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
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Student Leave Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage leave applications from your students
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg bg-background text-foreground"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-success">{stats.approved}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Requests</p>
          </motion.div>
        </div>

        {/* Leave Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Leave Requests from Your Students</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leave.studentAvatar}`} />
                          <AvatarFallback>{leave.studentName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{leave.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{leave.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{leave.startDate} - {leave.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={leave.reason}>{leave.reason}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{leave.appliedOn}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell className="text-right">
                      {leave.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-success text-success hover:bg-success hover:text-success-foreground"
                            onClick={() => handleUpdateStatus(leave.id, "approved")}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleUpdateStatus(leave.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Deny
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherLeave;
