import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  user_id?: string;
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

const AdminLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
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
        user_id: item.user_id,
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
      
      // Update local state
      setLeaveRequests(prev => 
        prev.map(leave => leave.id === id ? { ...leave, status: newStatus } : leave)
      );
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const stats = {
    total: leaveRequests.length,
    approved: leaveRequests.filter((l) => l.status === "approved").length,
    pending: leaveRequests.filter((l) => l.status === "pending").length,
    rejected: leaveRequests.filter((l) => l.status === "rejected").length,
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Leave Approvals
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage student/employee leave applications
          </p>
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
            <h3 className="font-semibold">All Leave Requests</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading leave requests...
                  </TableCell>
                </TableRow>
              ) : leaveRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              ) : (
                leaveRequests.map((leave) => (
                  <TableRow key={leave.id}>
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

export default AdminLeaves;
