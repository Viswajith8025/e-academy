import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Mail, MoreVertical, UserPlus } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: number;
  name: string;
  email: string;
  avatar: string;
  program: string;
  mentor: string;
  progress: number;
  status: "active" | "at-risk" | "completed" | "dropped";
  joinedAt: string;
}

const studentsData: Student[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "alice", program: "Web Development", mentor: "Dr. Sarah Wilson", progress: 75, status: "active", joinedAt: "Jan 1, 2025" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "bob", program: "Data Science", mentor: "Prof. Michael Chen", progress: 45, status: "active", joinedAt: "Jan 5, 2025" },
  { id: 3, name: "Carol White", email: "carol@example.com", avatar: "carol", program: "Mobile Development", mentor: "Dr. Emily Parker", progress: 90, status: "active", joinedAt: "Dec 15, 2024" },
  { id: 4, name: "David Brown", email: "david@example.com", avatar: "david", program: "Web Development", mentor: "Dr. Sarah Wilson", progress: 30, status: "at-risk", joinedAt: "Jan 10, 2025" },
  { id: 5, name: "Eve Davis", email: "eve@example.com", avatar: "eve", program: "UI/UX Design", mentor: "John Anderson", progress: 60, status: "active", joinedAt: "Jan 8, 2025" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", avatar: "frank", program: "Web Development", mentor: "Dr. Sarah Wilson", progress: 100, status: "completed", joinedAt: "Nov 1, 2024" },
];

const getStatusBadge = (status: Student["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-success text-success-foreground">Active</Badge>;
    case "at-risk":
      return <Badge variant="destructive">At Risk</Badge>;
    case "completed":
      return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
    case "dropped":
      return <Badge variant="secondary">Dropped</Badge>;
  }
};

const AdminStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === "all" || student.program === filterProgram;
    return matchesSearch && matchesProgram;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Manage Students
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage student enrollments
            </p>
          </div>

          <Button variant="premium">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterProgram} onValueChange={setFilterProgram}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Mobile Development">Mobile Development</SelectItem>
              <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell className="text-muted-foreground">{student.mentor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.progress} className="w-20 h-2" />
                      <span className="text-sm">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{student.joinedAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>Change Mentor</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
