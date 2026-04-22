import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  approvedBy?: string;
}

const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    type: "Medical",
    startDate: "Feb 5, 2025",
    endDate: "Feb 7, 2025",
    days: 3,
    reason: "Doctor's appointment and recovery",
    status: "pending",
    appliedOn: "Feb 1, 2025",
  },
  {
    id: 2,
    type: "Personal",
    startDate: "Jan 20, 2025",
    endDate: "Jan 21, 2025",
    days: 2,
    reason: "Family function",
    status: "approved",
    appliedOn: "Jan 15, 2025",
    approvedBy: "Dr. Sarah Wilson",
  },
  {
    id: 3,
    type: "Emergency",
    startDate: "Jan 10, 2025",
    endDate: "Jan 10, 2025",
    days: 1,
    reason: "Family emergency",
    status: "approved",
    appliedOn: "Jan 10, 2025",
    approvedBy: "Dr. Sarah Wilson",
  },
  {
    id: 4,
    type: "Personal",
    startDate: "Dec 25, 2024",
    endDate: "Dec 26, 2024",
    days: 2,
    reason: "Holiday celebration",
    status: "rejected",
    appliedOn: "Dec 20, 2024",
  },
];

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
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Explain your reason for leave..." rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="premium">Submit Request</Button>
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
              {leaveRequests.map((leave) => (
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
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Leave;
