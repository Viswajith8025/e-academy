import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
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
  approvedBy?: string;
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

const Leave = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      // Get logged-in user ID for data isolation
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const sessionUser = JSON.parse(sessionUserStr);

      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', sessionUser.id)
        .order('applied_on', { ascending: false });

      if (error) throw error;

      const formattedData: LeaveRequest[] = data.map((item: any) => ({
        id: item.id,
        type: item.type,
        startDate: item.start_date,
        endDate: item.end_date,
        days: item.days,
        reason: item.reason,
        status: item.status,
        appliedOn: new Date(item.applied_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        approvedBy: item.approved_by,
      }));

      setLeaveRequests(formattedData);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !startDate || !endDate || !reason) return;

    try {
      // Calculate days roughly
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

      // Get logged-in user ID
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const sessionUser = JSON.parse(sessionUserStr);

      // Check if user ID is a valid UUID
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionUser.id)) {
        toast.error("Invalid session. Please log out and log back in.");
        return;
      }

      const { error } = await supabase
        .from('leave_requests')
        .insert([
          { type, start_date: startDate, end_date: endDate, days, reason, user_id: sessionUser.id }
        ]);

      if (error) throw error;

      // Notify mentor
      const { data: profile } = await supabase.from('profiles').select('mentor_id').eq('id', sessionUser.id).single();
      if (profile?.mentor_id) {
        await sendNotification(
          "Leave Request",
          `${sessionUser.full_name} has requested leave for ${days} days starting ${startDate}.`,
          "warning",
          profile.mentor_id
        );
      }

      setIsDialogOpen(false);
      toast.success("Leave request submitted!");
      // Reset form
      setType("");
      setStartDate("");
      setEndDate("");
      setReason("");

      // Refresh data
      fetchLeaveRequests();
    } catch (error: any) {
      console.error('Error submitting leave request:', error);
      toast.error("Failed to submit leave: " + error.message);
    }
  };

  const stats = {
    total: leaveRequests.length,
    approved: leaveRequests.filter((l) => l.status === "approved").length,
    pending: leaveRequests.filter((l) => l.status === "pending").length,
    remaining: 12, // Assumed annual leave balance
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Leave Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Apply for leave and track your requests
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="premium">
                <Plus className="h-4 w-4 mr-2" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medical">Medical Leave</SelectItem>
                      <SelectItem value="Personal">Personal Leave</SelectItem>
                      <SelectItem value="Emergency">Emergency Leave</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Explain your reason for leave..." rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="premium">Submit Request</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{stats.remaining}</p>
            <p className="text-sm text-muted-foreground">Days Remaining</p>
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
            <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
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

        {/* Leave History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Leave History</h3>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading leave requests...
                  </TableCell>
                </TableRow>
              ) : leaveRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              ) : (
                leaveRequests.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{leave.startDate} - {leave.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                    <TableCell className="text-muted-foreground">{leave.appliedOn}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
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

export default Leave;
