import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, Edit, Trash2, Video, FileText, MoreVertical } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  videosCount: number;
  tasksCount: number;
  isPublished: boolean;
  order: number;
}

const modulesData: Module[] = [
  { id: 1, title: "Introduction to Program", description: "Overview and orientation", duration: "2 weeks", videosCount: 5, tasksCount: 2, isPublished: true, order: 1 },
  { id: 2, title: "Core Concepts", description: "Fundamental principles and basics", duration: "3 weeks", videosCount: 12, tasksCount: 5, isPublished: true, order: 2 },
  { id: 3, title: "Practical Applications", description: "Hands-on projects and exercises", duration: "4 weeks", videosCount: 15, tasksCount: 8, isPublished: true, order: 3 },
  { id: 4, title: "Advanced Topics", description: "Deep dive into complex concepts", duration: "3 weeks", videosCount: 10, tasksCount: 4, isPublished: false, order: 4 },
  { id: 5, title: "Final Project", description: "Capstone project and assessment", duration: "2 weeks", videosCount: 3, tasksCount: 1, isPublished: false, order: 5 },
];

const AdminModules = () => {
  const [modules, setModules] = useState(modulesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const togglePublish = (id: number) => {
    setModules(modules.map(m => m.id === id ? { ...m, isPublished: !m.isPublished } : m));
  };

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
              Manage Modules
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and organize learning modules
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="premium">
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Module Title</Label>
                  <Input placeholder="e.g., Introduction to React" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of the module..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input placeholder="e.g., 2 weeks" />
                  </div>
                  <div className="space-y-2">
                    <Label>Order</Label>
                    <Input type="number" placeholder="1" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button variant="premium">Create Module</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">{module.order}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{module.title}</h3>
                    {module.isPublished ? (
                      <Badge className="bg-success text-success-foreground">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Video className="h-4 w-4" />
                      <span>{module.videosCount} videos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>{module.tasksCount} tasks</span>
                    </div>
                    <span>Duration: {module.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Publish</span>
                    <Switch
                      checked={module.isPublished}
                      onCheckedChange={() => togglePublish(module.id)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Video
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Add Task
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Module
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminModules;
