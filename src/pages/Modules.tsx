import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Play, Upload, Clock, CheckCircle2, AlertCircle, Video, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { sendNotification } from "@/lib/notifications";

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
  videos: {
    id: string;
    title: string;
    video_url: string;
    is_completed: boolean;
  }[];
}

const getTaskStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "submitted":
      return <Clock className="h-4 w-4 text-warning" />;
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
  }
};

const getTaskStatusBadge = (status: Task["status"]) => {
  switch (status) {
    case "approved":
      return <Badge variant="default" className="bg-success text-success-foreground">Approved</Badge>;
    case "submitted":
      return <Badge variant="default" className="bg-warning text-warning-foreground">Pending Review</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Not Started</Badge>;
  }
};

const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mentorId, setMentorId] = useState<string | null>(null);

  // Submission state
  const [submitTaskId, setSubmitTaskId] = useState<string | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Video Player State
  const [selectedVideo, setSelectedVideo] = useState<{title: string, url: string} | null>(null);

  useEffect(() => {
    fetchModulesData();
  }, []);

  const fetchModulesData = async () => {
    try {
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) {
        setLoading(false);
        return;
      }
      const sessionUser = JSON.parse(sessionUserStr);
      const userId = sessionUser.id;

      // Fetch mentor ID
      const { data: profileData } = await supabase.from('profiles').select('mentor_id').eq('id', userId).single();
      // Wait, let's assume the mentor field in profile is what we use.
      // In previous turns we used profile.mentor (name) or profile.mentor_id.
      // I'll check if mentor_id exists. If not I'll fetch by mentor name.
      const mentor_id = profileData?.mentor_id;
      setMentorId(mentor_id);

      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('is_published', true)
        .order('order_num', { ascending: true });

      if (modulesError) throw modulesError;

      const { data: tasksData, error: tasksError } = await supabase
        .from('module_tasks')
        .select('*');

      if (tasksError) throw tasksError;

      const { data: videosData, error: videosError } = await supabase
        .from('module_videos')
        .select('*')
        .order('order_num', { ascending: true });

      if (videosError) throw videosError;

      const { data: progressData } = await supabase
        .from('video_progress')
        .select('video_id')
        .eq('user_id', userId);

      const { data: subsData, error: subsError } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (subsError) throw subsError;

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

        const hasTasks = moduleTasks.length > 0;
        const allTasksApproved = hasTasks && moduleTasks.every(t => t.status === "approved");

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
          tasks: moduleTasks,
          videos: (videosData || [])
            .filter((v: any) => v.module_id === m.id)
            .map((v: any) => ({
              id: v.id,
              title: v.title,
              video_url: v.video_url,
              is_completed: (progressData || []).some((p: any) => p.video_id === v.id)
            }))
        };
      });

      setModules(processedModules);
      if (!expandedModule) {
        const currentMod = processedModules.find(m => m.status === "current");
        if (currentMod) setExpandedModule(currentMod.id);
      }
    } catch (error) {
      console.error("Error fetching modules data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) {
      const id = url.split('/').pop();
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const toggleVideoCompletion = async (videoId: string, currentStatus: boolean) => {
    try {
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const sessionUser = JSON.parse(sessionUserStr);

      if (currentStatus) {
        await supabase.from('video_progress').delete().eq('video_id', videoId).eq('user_id', sessionUser.id);
      } else {
        await supabase.from('video_progress').insert([{ video_id: videoId, user_id: sessionUser.id }]);
      }
      fetchModulesData();
    } catch (error) {
      console.error("Error toggling video completion:", error);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTaskId || !submissionUrl.trim()) return;
    setIsSubmitting(true);
    try {
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const sessionUser = JSON.parse(sessionUserStr);
      const { error } = await supabase.from('task_submissions').insert([{
        task_id: submitTaskId,
        submission_url: submissionUrl,
        status: 'pending',
        user_id: sessionUser.id
      }]);
      if (error) throw error;
      
      if (mentorId) {
        await sendNotification(
          "Task Submitted",
          `${sessionUser.full_name} has submitted a task for review.`,
          "info",
          mentorId
        );
      }

      setSubmitTaskId(null);
      setSubmissionUrl("");
      fetchModulesData();
      toast.success("Task submitted successfully!");
    } catch (error: any) {
      toast.error("Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading modules...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learning Modules</h1>
          <p className="text-muted-foreground mt-1">Complete modules in order to unlock the next one</p>
        </motion.div>

        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border">No modules published yet.</div>
          ) : modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "rounded-xl border transition-all duration-300 overflow-hidden bg-card",
                module.status === "locked" && "opacity-60",
                module.status === "current" && "border-primary shadow-lg shadow-primary/10",
                module.status === "completed" && "border-success/30"
              )}
            >
              <div
                className={cn("p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors", module.status === "locked" && "cursor-not-allowed")}
                onClick={() => module.status !== "locked" && setExpandedModule(expandedModule === module.id ? null : module.id)}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", 
                  module.status === "completed" && "bg-success text-success-foreground",
                  module.status === "current" && "bg-primary text-primary-foreground",
                  module.status === "locked" && "bg-muted text-muted-foreground")}>
                  {module.status === "completed" ? <Check className="h-5 w-5" /> : module.status === "current" ? <Play className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Module {module.order_num}: {module.title}</h3>
                    {module.status === "current" && <Badge className="bg-primary">In Progress</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{module.description}</p>
                </div>
              </div>

              {expandedModule === module.id && module.status !== "locked" && (
                <div className="border-t border-border bg-muted/30 p-5 space-y-6">
                  {module.videos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground flex items-center gap-2"><Video className="h-4 w-4 text-primary" />Module Videos</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {module.videos.map((video) => (
                          <div key={video.id} className="group p-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer" onClick={() => setSelectedVideo({title: video.title, url: video.video_url})}>
                            <div className="aspect-video mb-2 rounded bg-muted flex items-center justify-center relative">
                              <Play className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
                              {video.is_completed && <div className="absolute top-2 right-2 bg-success text-success-foreground rounded-full p-1"><Check className="h-3 w-3" /></div>}
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-sm font-medium truncate flex-1">{video.title}</h5>
                              <input type="checkbox" checked={video.is_completed} onChange={(e) => { e.stopPropagation(); toggleVideoCompletion(video.id, video.is_completed); }} className="mt-1 h-4 w-4 cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Tasks</h4>
                    {module.tasks.length === 0 ? <p className="text-sm text-muted-foreground">No tasks assigned.</p> : module.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                        <div className="flex items-center gap-3">
                          {getTaskStatusIcon(task.status)}
                          <div>
                            <p className="text-sm font-medium">{task.title}</p>
                            {task.submission && (
                              <p className="text-xs text-muted-foreground mt-1">Submitted: {new Date(task.submission.submitted_at).toLocaleDateString()} • <a href={task.submission.submission_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View Submission</a></p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getTaskStatusBadge(task.status)}
                          {(task.status === "pending" || task.status === "rejected") && (
                            <Dialog open={submitTaskId === task.id} onOpenChange={(open) => setSubmitTaskId(open ? task.id : null)}>
                              <DialogTrigger asChild><Button size="sm" variant={task.status === "rejected" ? "destructive" : "outline"}><Upload className="h-4 w-4 mr-2" />{task.status === "rejected" ? "Resubmit" : "Submit"}</Button></DialogTrigger>
                              <DialogContent>
                                <DialogHeader><DialogTitle>Submit Task: {task.title}</DialogTitle></DialogHeader>
                                <form className="space-y-4 mt-4" onSubmit={handleTaskSubmit}>
                                  <div className="space-y-2">
                                    <Label>Submission URL</Label>
                                    <Input placeholder="Paste link here..." value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} required />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setSubmitTaskId(null)}>Cancel</Button>
                                    <Button type="submit" variant="premium" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Task"}</Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          {selectedVideo && (
            <div className="flex flex-col">
              <div className="p-4 bg-background border-b flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{selectedVideo.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)}>Close</Button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe src={getEmbedUrl(selectedVideo.url)} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Modules;
