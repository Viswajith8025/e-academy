import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Video, FileText, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ModuleTask {
  id: string;
  title: string;
  module_id: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  videosCount: number;
  tasksCount: number;
  isPublished: boolean;
  order: number;
  tasks: ModuleTask[];
}

interface Submission {
  id: string;
  task_id: string;
  task_title?: string;
  module_title?: string;
  submission_url: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
}

const AdminModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Form states for Module
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [orderNum, setOrderNum] = useState("");

  // Form state for Task
  const [taskTitle, setTaskTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch modules
      const { data: modsData, error: modsError } = await supabase
        .from('modules')
        .select('*')
        .order('order_num', { ascending: true });

      if (modsError) throw modsError;

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('module_tasks')
        .select('*');

      if (tasksError) throw tasksError;

      // Fetch submissions
      const { data: subsData, error: subsError } = await supabase
        .from('task_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (subsError) throw subsError;

      const formattedModules: Module[] = (modsData || []).map((m: any) => {
        const mTasks = tasksData.filter((t: any) => t.module_id === m.id);
        return {
          id: m.id,
          title: m.title,
          description: m.description,
          duration: m.duration,
          videosCount: 0, // Placeholder
          tasksCount: mTasks.length,
          isPublished: m.is_published,
          order: m.order_num,
          tasks: mTasks
        };
      });

      setModules(formattedModules);

      const formattedSubs: Submission[] = (subsData || []).map((s: any) => {
        const task = tasksData.find((t: any) => t.id === s.task_id);
        const mod = task ? modsData.find((m: any) => m.id === task.module_id) : null;

        return {
          id: s.id,
          task_id: s.task_id,
          task_title: task ? task.title : 'Unknown Task',
          module_title: mod ? mod.title : 'Unknown Module',
          submission_url: s.submission_url,
          status: s.status,
          submitted_at: new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      });

      setSubmissions(formattedSubs);

    } catch (error) {
      console.error("Error fetching admin modules data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !orderNum) return;

    try {
      const { error } = await supabase
        .from('modules')
        .insert([{
          title,
          description,
          duration,
          order_num: parseInt(orderNum),
          is_published: false
        }]);

      if (error) throw error;

      setIsModuleDialogOpen(false);
      setTitle("");
      setDescription("");
      setDuration("");
      setOrderNum("");
      fetchData();
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !selectedModuleId) return;

    try {
      const { error } = await supabase
        .from('module_tasks')
        .insert([{
          module_id: selectedModuleId,
          title: taskTitle
        }]);

      if (error) throw error;

      setIsTaskDialogOpen(false);
      setTaskTitle("");
      setSelectedModuleId(null);
      fetchData();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('modules')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error updating publish status:", error);
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from('task_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error updating submission status:", error);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module? All associated tasks will also be removed.")) return;

    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);
    }
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
              Module Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create modules, assign tasks, and review student submissions
            </p>
          </div>
        </motion.div>

        <Tabs defaultValue="modules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="modules">Manage Modules</TabsTrigger>
            <TabsTrigger value="submissions">
              Review Submissions
              {submissions.filter(s => s.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                  {submissions.filter(s => s.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
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
                  <form className="space-y-4 mt-4" onSubmit={handleCreateModule}>
                    <div className="space-y-2">
                      <Label>Module Title</Label>
                      <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Introduction to React" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g., 2 weeks" />
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input type="number" value={orderNum} onChange={e => setOrderNum(e.target.value)} required placeholder="1" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsModuleDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" variant="premium">Create Module</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">Loading modules...</div>
            ) : modules.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">No modules found. Create one!</div>
            ) : modules.map((module, index) => (
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                      <span>Duration: {module.duration}</span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        <span>{module.tasksCount} tasks</span>
                      </div>
                    </div>

                    {/* Tasks List */}
                    {module.tasks.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-muted space-y-2">
                        {module.tasks.map(task => (
                          <div key={task.id} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            {task.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Publish</span>
                      <Switch
                        checked={module.isPublished}
                        onCheckedChange={() => togglePublish(module.id, module.isPublished)}
                      />
                    </div>

                    <Dialog open={isTaskDialogOpen && selectedModuleId === module.id} onOpenChange={(open) => {
                      setIsTaskDialogOpen(open);
                      if (open) setSelectedModuleId(module.id);
                      else setSelectedModuleId(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Task to Module: {module.title}</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4 mt-4" onSubmit={handleCreateTask}>
                          <div className="space-y-2">
                            <Label>Task Title / Requirement</Label>
                            <Input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required placeholder="e.g., Complete Chapter 1 Quiz" />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="premium">Add Task</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeleteModule(module.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <div className="premium-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading submissions...</TableCell>
                    </TableRow>
                  ) : submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No submissions found.</TableCell>
                    </TableRow>
                  ) : submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium text-muted-foreground">{sub.module_title}</TableCell>
                      <TableCell className="font-medium">{sub.task_title}</TableCell>
                      <TableCell>
                        <a
                          href={sub.submission_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          View Link <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{sub.submitted_at}</TableCell>
                      <TableCell>
                        {sub.status === 'pending' && <Badge className="bg-warning text-warning-foreground">Pending</Badge>}
                        {sub.status === 'approved' && <Badge className="bg-success text-success-foreground">Approved</Badge>}
                        {sub.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        {sub.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-success text-success hover:bg-success hover:text-success-foreground"
                              onClick={() => handleUpdateSubmissionStatus(sub.id, "approved")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleUpdateSubmissionStatus(sub.id, "rejected")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminModules;
