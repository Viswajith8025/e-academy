import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Mail, MoreVertical, UserPlus, Loader2, Key, User, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generatePassword } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  program: string;
  mentor: string;
  progress: number;
  status: "active" | "at-risk" | "completed" | "dropped";
  joinedAt: string;
}

interface TeacherOption {
  id: string;
  full_name: string;
}

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
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // Change Mentor dialog state
  const [isMentorDialogOpen, setIsMentorDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMentor, setSelectedMentor] = useState("");

  // Add Student form state
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [newStudentProgram, setNewStudentProgram] = useState("Web Development");
  const [newStudentMentor, setNewStudentMentor] = useState("");

  // Edit Creds state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch teachers for the mentor dropdown
      const { data: teachersData, error: teachersError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'teacher');

      if (teachersError) throw teachersError;
      setTeachers(teachersData || []);

      // 2. Get student profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (profilesError) throw profilesError;

      // 3. Get total number of tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('module_tasks')
        .select('id');
      if (tasksError) throw tasksError;
      const totalTasks = tasksData?.length || 0;

      // 4. Get approved submissions per user
      const { data: approvedSubs, error: subsError } = await supabase
        .from('task_submissions')
        .select('user_id')
        .eq('status', 'approved');
      if (subsError) throw subsError;

      const approvedCountMap: Record<string, number> = {};
      approvedSubs?.forEach((sub: any) => {
        const uid = sub.user_id;
        if (uid) approvedCountMap[uid] = (approvedCountMap[uid] || 0) + 1;
      });

      const formattedStudents: Student[] = (profilesData || []).map((p: any) => {
        const approved = approvedCountMap[p.id] || 0;
        const progress = totalTasks ? Math.round((approved / totalTasks) * 100) : 0;
        const status: Student['status'] =
          progress === 100
            ? 'completed'
            : progress < 50
              ? 'at-risk'
              : 'active';

        return {
          id: p.id,
          name: p.full_name ?? 'Unnamed',
          email: p.email ?? '',
          avatar: p.avatar_seed ?? 'default',
          program: p.program ?? 'Unknown',
          mentor: p.mentor ?? 'None',
          progress,
          status,
          joinedAt: p.joined_at ? new Date(p.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
        } as Student;
      });

      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          full_name: newStudentName,
          email: newStudentEmail,
          password: newStudentPassword || generatePassword(),
          role: 'student',
          program: newStudentProgram,
          mentor: newStudentMentor || null,
          avatar_seed: newStudentName.split(' ')[0].toLowerCase(),
          joined_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success("Student added successfully!");
      setIsAddStudentOpen(false);
      setNewStudentName("");
      setNewStudentEmail("");
      setNewStudentMentor("");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to add student: " + error.message);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: editEmail,
          password: editPassword
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      toast.success("Credentials updated successfully!");
      setIsEditOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Failed to update credentials: " + error.message);
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditEmail(student.email);
    setEditPassword("");
    setIsEditOpen(true);
  };

  const handleChangeMentor = async () => {
    if (!selectedStudent) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mentor: selectedMentor || null })
        .eq('id', selectedStudent.id);

      if (error) throw error;

      toast.success(`Mentor updated for ${selectedStudent.name}!`);
      setIsMentorDialogOpen(false);
      setSelectedStudent(null);
      setSelectedMentor("");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to update mentor: " + error.message);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!window.confirm(`Are you sure you want to remove ${student.name}? This will delete all their submissions, messages, and related data.`)) {
      return;
    }

    try {
      setLoading(true);
      // 1. Delete submissions
      await supabase
        .from('task_submissions')
        .delete()
        .eq('user_id', student.id);

      // 2. Delete messages
      await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${student.id},receiver_id.eq.${student.id}`);

      // 3. Delete bookings
      await supabase
        .from('bookings')
        .delete()
        .or(`student_id.eq.${student.id},teacher_id.eq.${student.id}`);

      // 4. Delete extension requests
      await supabase
        .from('extension_requests')
        .delete()
        .eq('user_id', student.id);

      // 5. Delete notifications
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', student.id);

      // 6. Delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', student.id);

      if (error) throw error;

      toast.success(`${student.name} has been removed.`);
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete student: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openChangeMentorDialog = (student: Student) => {
    setSelectedStudent(student);
    setSelectedMentor(student.mentor === "None" ? "" : student.mentor);
    setIsMentorDialogOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading students...</p>
        </div>
      </DashboardLayout>
    );
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
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

          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button variant="premium">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="student-password"
                      value={newStudentPassword}
                      onChange={(e) => setNewStudentPassword(e.target.value)}
                      placeholder="Auto-generated if empty"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setNewStudentPassword(generatePassword())}
                      title="Generate random password"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Select value={newStudentProgram} onValueChange={setNewStudentProgram}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mentor">Assign Mentor</Label>
                  <Select value={newStudentMentor} onValueChange={setNewStudentMentor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">No Mentor</SelectItem>
                      {teachers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="premium">Create Student</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                        <DropdownMenuItem onClick={() => navigate(`/profile/${student.id}`)}>
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(student)}>
                          <Key className="h-4 w-4 mr-2" />
                          Edit Credentials
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openChangeMentorDialog(student)}>
                          Change Mentor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/profile/${student.id}`)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteStudent(student)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Change Mentor Dialog */}
        <Dialog open={isMentorDialogOpen} onOpenChange={setIsMentorDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Mentor for {selectedStudent?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Mentor</Label>
                <p className="text-sm text-muted-foreground">{selectedStudent?.mentor || "None"}</p>
              </div>
              <div className="space-y-2">
                <Label>New Mentor</Label>
                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">No Mentor</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsMentorDialogOpen(false)}>Cancel</Button>
              <Button variant="premium" onClick={handleChangeMentor}>Save Mentor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Credentials Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Credentials for {editingStudent?.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateCredentials} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">New Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditPassword(generatePassword())}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" variant="premium">Update Credentials</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
