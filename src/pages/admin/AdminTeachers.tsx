import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Star, MoreVertical, Users, Loader2, Trash2, Key, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generatePassword } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studentsAssigned: number;
  status: "active" | "inactive";
}

const AdminTeachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Edit state
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      // Get teacher profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');

      if (error) throw error;

      // Count students assigned to each teacher
      const { data: allStudents } = await supabase
        .from('profiles')
        .select('mentor')
        .eq('role', 'student');

      const mentorCountMap: Record<string, number> = {};
      allStudents?.forEach((s: any) => {
        if (s.mentor && s.mentor !== "None") {
          const m = s.mentor.trim().toLowerCase();
          mentorCountMap[m] = (mentorCountMap[m] || 0) + 1;
        }
      });

      const formattedTeachers: Teacher[] = (profiles || []).map((p: any) => {
        const nameKey = (p.full_name || "").trim().toLowerCase();
        const idKey = (p.id || "").toLowerCase();
        
        // Count students that match either the name or the ID
        const count = allStudents?.filter((s: any) => {
          if (!s.mentor) return false;
          const m = s.mentor.toString().trim().toLowerCase();
          return m === nameKey || m === idKey;
        }).length || 0;

        return {
          id: p.id,
          name: p.full_name || "Unnamed",
          email: p.email || "",
          avatar: p.avatar_seed || "default",
          studentsAssigned: count,
          status: "active" as const,
        };
      });

      setTeachers(formattedTeachers);
    } catch (error: any) {
      toast.error("Failed to fetch teachers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          full_name: newName,
          email: newEmail,
          password: newPassword || generatePassword(),
          role: 'teacher',
          avatar_seed: newName.split(' ')[0].toLowerCase(),
          joined_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success("Teacher added successfully!");
      setIsAddTeacherOpen(false);
      setNewName("");
      setNewEmail("");
      fetchTeachers();
    } catch (error: any) {
      toast.error("Failed to add teacher: " + error.message);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: editEmail,
          password: editPassword
        })
        .eq('id', editingTeacher.id);

      if (error) throw error;

      toast.success("Credentials updated successfully!");
      setIsEditOpen(false);
      fetchTeachers();
    } catch (error: any) {
      toast.error("Failed to update credentials: " + error.message);
    }
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!window.confirm(`Are you sure you want to remove ${teacher.name}? This will delete all their messages and related data.`)) {
      return;
    }

    try {
      // 1. Delete related messages (where teacher is sender or receiver)
      await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${teacher.id},receiver_id.eq.${teacher.id}`);

      // 2. Delete related bookings
      await supabase
        .from('bookings')
        .delete()
        .or(`student_id.eq.${teacher.id},teacher_id.eq.${teacher.id}`);

      // 3. Delete related extension requests
      await supabase
        .from('extension_requests')
        .delete()
        .eq('user_id', teacher.id);

      // 4. Delete related notifications
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', teacher.id);

      // 5. Delete the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', teacher.id);

      if (error) throw error;

      toast.success(`${teacher.name} has been removed.`);
      fetchTeachers();
    } catch (error: any) {
      toast.error("Failed to delete teacher: " + error.message);
    }
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditEmail(teacher.email);
    setEditPassword(""); // Keep blank to not show current password for security
    setIsEditOpen(true);
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Manage Teachers
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage teacher profiles
            </p>
          </div>

          <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
            <DialogTrigger asChild>
              <Button variant="premium">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTeacher} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-name">Full Name</Label>
                  <Input
                    id="teacher-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input
                    id="teacher-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Password (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="teacher-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Auto-generated if empty"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setNewPassword(generatePassword())}
                      title="Generate random password"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddTeacherOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="premium">Create Teacher</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading teachers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="premium-card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.avatar}`} />
                      <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{teacher.name}</h3>
                      <p className="text-sm text-muted-foreground">Mentor</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/profile/${teacher.id}`)}>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(teacher)}>
                        <Key className="h-4 w-4 mr-2" />
                        Edit Credentials
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteTeacher(teacher)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Teacher
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{teacher.email}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{teacher.studentsAssigned} students</span>
                  </div>
                  <Badge className="bg-success text-success-foreground">Active</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Credentials Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Credentials for {editingTeacher?.name}</DialogTitle>
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
                <p className="text-xs text-muted-foreground italic">
                  Leave the email as is if you only want to change the password.
                </p>
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

export default AdminTeachers;
