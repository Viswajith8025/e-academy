import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Lock, Play, Upload, Clock, CheckCircle2, AlertCircle, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TaskSubmission {
  id: string;
  status: "pending" | "approved" | "rejected";
  submission_url: string;
  submitted_at: string;
}

interface Task {
  id: string;
  title: string;
  submission?: TaskSubmission;
  status: "pending" | "submitted" | "approved" | "rejected";
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  order_num: number;
  status: "completed" | "current" | "locked";
  tasks: Task[];
}

const getTaskStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "approved": return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "submitted": return <Clock className="h-4 w-4 text-warning" />;
    case "rejected": return <AlertCircle className="h-4 w-4 text-destructive" />;
    default: return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
  }
};

const getTaskStatusBadge = (status: Task["status"]) => {
  switch (status) {
    case "approved": return <Badge variant="default" className="bg-success text-success-foreground">Approved</Badge>;
    case "submitted": return <Badge variant="default" className="bg-warning text-warning-foreground">Pending Review</Badge>;
    case "rejected": return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge variant="secondary">Not Started</Badge>;
  }
};

const StudentPortal = () => {
  const { studentName } = useParams();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [submitTaskId, setSubmitTaskId] = useState<string | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudentAndModules();
  }, [studentName]);

  const fetchStudentAndModules = async () => {
    try {
      setLoading(true);
      // 1. Fetch student by name (fuzzy match for demo)
      const { data: profData, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${studentName?.replace('-', ' ')}%`)
        .limit(1)
        .single();

      if (profError) {
        console.error("Student not found", profError);
        return;
      }
      setStudentProfile(profData);

      // 2. Fetch modules
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .eq('is_published', true)
        .order('order_num', { ascending: true });

      // 3. Fetch tasks
      const { data: tasksData } = await supabase.from('module_tasks').select('*');

      // 4. Fetch submissions for THIS student
      const { data: subsData } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('user_id', profData.id)
        .order('submitted_at', { ascending: false });

      // 5. Process
      let previousModuleCompleted = true;
      const processedModules: Module[] = (modulesData || []).map((m: any) => {
        const moduleTasks: Task[] = (tasksData || [])
          .filter((t: any) => t.module_id === m.id)
          .map((t: any) => {
            const submission = (subsData || []).find((s: any) => s.task_id === t.id);
            const status = submission ? submission.status : "pending";
            return {
              id: t.id,
              title: t.title,
              submission,
              status: status === "pending" && submission ? "submitted" : status
            };
          });

        const allTasksApproved = moduleTasks.length > 0 && moduleTasks.every(t => t.status === "approved");
        let status: "completed" | "current" | "locked" = "locked";
        
        if (previousModuleCompleted) {
          if (allTasksApproved) {
            status = "completed";
          } else {
            status = "current";
            previousModuleCompleted = false;
          }
        }

        return {
          id: m.id,
          title: m.title,
          description: m.description,
          duration: m.duration,
          order_num: m.order_num,
          status,
          tasks: moduleTasks
        };
      });

      setModules(processedModules);
      if (!expandedModule) {
        const currentMod = processedModules.find(m => m.status === "current");
        if (currentMod) setExpandedModule(currentMod.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTaskId || !submissionUrl.trim() || !studentProfile) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('task_submissions')
        .insert([{
          task_id: submitTaskId,
          user_id: studentProfile.id,
          submission_url: submissionUrl,
          status: 'pending'
        }]);

      if (error) throw error;
      toast.success("Task submitted for " + studentProfile.full_name);
      setSubmitTaskId(null);
      setSubmissionUrl("");
      fetchStudentAndModules();
    } catch (error: any) {
      toast.error("Submission failed: " + (error.message || "Unknown error"));
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loading && !studentProfile) {
    return (
      <DashboardLayout role="student">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold">Student Not Found</h2>
          <p className="text-muted-foreground">Could not find a student named "{studentName}"</p>
          <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Learning Portal: {studentProfile?.full_name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Impersonating student for testing purposes
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1 flex items-center gap-2">
            <User className="h-4 w-4" />
            {studentProfile?.program}
          </Badge>
        </motion.div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">Loading...</div>
          ) : modules.map((module, index) => (
            <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className={cn("rounded-xl border bg-card overflow-hidden", module.status === "locked" && "opacity-60", module.status === "current" && "border-primary shadow-lg", module.status === "completed" && "border-success/30")}
            >
              <div className={cn("p-5 flex items-center gap-4 cursor-pointer", module.status === "locked" && "cursor-not-allowed")}
                onClick={() => module.status !== "locked" && setExpandedModule(expandedModule === module.id ? null : module.id)}>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", module.status === "completed" ? "bg-success text-white" : module.status === "current" ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                  {module.status === "completed" ? <Check className="h-5 w-5" /> : module.status === "current" ? <Play className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Module {module.order_num}: {module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>
              {expandedModule === module.id && (
                <div className="p-5 border-t bg-muted/20 space-y-3">
                  {module.tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getTaskStatusIcon(task.status)}
                        <span className="text-sm font-medium">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTaskStatusBadge(task.status)}
                        {(task.status === "pending" || task.status === "rejected") && (
                          <Dialog open={submitTaskId === task.id} onOpenChange={(open) => setSubmitTaskId(open ? task.id : null)}>
                            <DialogTrigger asChild><Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-2" />Submit</Button></DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Submit: {task.title}</DialogTitle></DialogHeader>
                              <form className="space-y-4 mt-4" onSubmit={handleTaskSubmit}>
                                <Label>Link</Label>
                                <Input placeholder="Link..." value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)} required />
                                <Button type="submit" variant="premium" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPortal;
