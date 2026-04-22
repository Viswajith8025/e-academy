import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Star, MoreVertical, Users } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Teacher {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  expertise: string[];
  studentsAssigned: number;
  rating: number;
  status: "active" | "inactive";
}

const teachersData: Teacher[] = [
  { id: 1, name: "Dr. Sarah Wilson", email: "sarah@eit.com", avatar: "sarah", role: "Senior Mentor", expertise: ["React", "JavaScript", "Web Development"], studentsAssigned: 45, rating: 4.9, status: "active" },
  { id: 2, name: "Prof. Michael Chen", email: "michael@eit.com", avatar: "michael", role: "Technical Lead", expertise: ["Node.js", "Backend", "Database"], studentsAssigned: 38, rating: 4.8, status: "active" },
  { id: 3, name: "Dr. Emily Parker", email: "emily@eit.com", avatar: "emily", role: "Industry Expert", expertise: ["UI/UX", "Design Systems", "Accessibility"], studentsAssigned: 32, rating: 4.7, status: "active" },
  { id: 4, name: "John Anderson", email: "john@eit.com", avatar: "john", role: "Career Counselor", expertise: ["Career Guidance", "Interview Prep", "Resume Building"], studentsAssigned: 60, rating: 4.9, status: "active" },
  { id: 5, name: "Dr. Lisa Taylor", email: "lisa@eit.com", avatar: "lisa", role: "Data Science Lead", expertise: ["Python", "Machine Learning", "Data Analysis"], studentsAssigned: 28, rating: 4.6, status: "inactive" },
];

const AdminTeachers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = teachersData.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.expertise.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()))
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
              View and manage teacher assignments
            </p>
          </div>

          <Button variant="premium">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
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

        {/* Teachers Grid */}
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
                    <p className="text-sm text-muted-foreground">{teacher.role}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Manage Students</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{teacher.email}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {teacher.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{teacher.studentsAssigned} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{teacher.rating}</span>
                </div>
                {teacher.status === "active" ? (
                  <Badge className="bg-success text-success-foreground">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTeachers;
