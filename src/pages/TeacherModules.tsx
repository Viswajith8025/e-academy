import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, XCircle, Clock, ExternalLink, Loader2, ChevronDown, ChevronRight, Video, Plus, Trash2, FileVideo, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendNotification } from "@/lib/notifications";
import QuizManager from "@/components/dashboard/QuizManager";


interface Submission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  submissionUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

interface ModuleWithSubmissions {
  id: string;
  title: string;
  orderNum: number;
  tasks: {
    id: string;
    title: string;
    submissions: Submission[];
  }[];
  videos: {
    id: string;
    title: string;
    video_url: string;
    completedBy: string[];
  }[];
  quizId?: string;
}

interface QuizAccessRequest {
  id: string;
  user_id: string;
  studentName: string;
  quiz_id: string;
  moduleTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
}


const getStatusBadge = (status: Submission["status"]) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    case "pending":
      return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
  }
};

const TeacherModules = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<ModuleWithSubmissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [studentMap, setStudentMap] = useState<Record<string, { name: string; avatar: string }>>({});

  // Video Add State
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedModuleForVideo, setSelectedModuleForVideo] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Quiz Management State
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState<{id: string, title: string} | null>(null);
  const [accessRequests, setAccessRequests] = useState<QuizAccessRequest[]>([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) {
        navigate("/login");
        return;
      }
      const sessionUser = JSON.parse(sessionUserStr);
      const mentorId = sessionUser.id;

      const { data: mentorData } = await supabase.from('profiles').select('*').eq('id', mentorId).single();
      const mentorFullName = mentorData?.full_name || sessionUser.full_name;

      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_seed')
        .eq('role', 'student')
        .or(`mentor.eq.${mentorFullName},mentor.eq.${mentorId}`);

      const studentIds = (studentsData || []).map(s => s.id);
      const sMap: Record<string, { name: string; avatar: string }> = {};
      (studentsData || []).forEach(s => {
        sMap[s.id] = { name: s.full_name || "Unknown", avatar: s.avatar_seed || "default" };
      });
      setStudentMap(sMap);

      if (studentIds.length === 0) {
        setModules([]);
        setLoading(false);
        return;
      }

      const { data: modulesData } = await supabase.from('modules').select('*').eq('is_published', true).order('order_num', { ascending: true });
      const { data: tasksData } = await supabase.from('module_tasks').select('*');
      const { data: videosData } = await supabase.from('module_videos').select('*').order('order_num', { ascending: true });
      const { data: subsData } = await supabase.from('task_submissions').select('*').in('user_id', studentIds).order('submitted_at', { ascending: false });
      const { data: videoProgressData } = await supabase.from('video_progress').select('*').in('user_id', studentIds);
      const { data: quizzesData } = await supabase.from('quizzes').select('id, module_id');

      // Fetch Access Requests
      const { data: requestsData } = await supabase
        .from('quiz_access_requests')
        .select(`
          id,
          user_id,
          quiz_id,
          status,
          requested_at,
          quizzes (
            module_id,
            modules (title)
          )
        `)
        .eq('status', 'pending');

      const processedRequests: QuizAccessRequest[] = (requestsData || []).map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        studentName: sMap[r.user_id]?.name || "Unknown",
        quiz_id: r.quiz_id,
        moduleTitle: r.quizzes?.modules?.title || "Unknown Module",
        status: r.status,
        requested_at: r.requested_at
      }));
      setAccessRequests(processedRequests);


      const processedModules: ModuleWithSubmissions[] = (modulesData || []).map((m: any) => {
        const moduleTasks = (tasksData || [])
          .filter((t: any) => t.module_id === m.id)
          .map((t: any) => {
            const taskSubmissions: Submission[] = (subsData || [])
              .filter((s: any) => s.task_id === t.id)
              .map((s: any) => ({
                id: s.id,
                taskId: t.id,
                taskTitle: t.title,
                studentId: s.user_id,
                studentName: sMap[s.user_id]?.name || "Unknown",
                studentAvatar: sMap[s.user_id]?.avatar || "default",
                submissionUrl: s.submission_url,
                status: s.status,
                submittedAt: new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              }));
            return { id: t.id, title: t.title, submissions: taskSubmissions };
          });

        return {
          id: m.id,
          title: m.title,
          orderNum: m.order_num,
          tasks: moduleTasks,
          videos: (videosData || [])
            .filter((v: any) => v.module_id === m.id)
            .map((v: any) => ({
              id: v.id,
              title: v.title,
              video_url: v.video_url,
              completedBy: (videoProgressData || []).filter((p: any) => p.video_id === v.id).map((p: any) => p.user_id)
            })),
          quizId: (quizzesData || []).find((q: any) => q.module_id === m.id)?.id
        };

      });

      setModules(processedModules);
      const modulesWithPending = new Set<string>();
      processedModules.forEach(m => {
        m.tasks.forEach(t => { if (t.submissions.some(s => s.status === 'pending')) modulesWithPending.add(m.id); });
      });
      setExpandedModules(modulesWithPending);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string, studentId: string, taskTitle: string) => {
    const { error } = await supabase.from('task_submissions').update({ status: 'approved' }).eq('id', submissionId);
    if (!error) { 
      toast.success("Approved!"); 
      await sendNotification("Task Approved!", `Your submission for "${taskTitle}" has been approved.`, "success", studentId);
      fetchData(); 
    }
  };

  const handleReject = async (submissionId: string, studentId: string, taskTitle: string) => {
    const { error } = await supabase.from('task_submissions').update({ status: 'rejected' }).eq('id', submissionId);
    if (!error) { 
      toast.success("Rejected."); 
      await sendNotification("Task Rejected", `Your submission for "${taskTitle}" needs revision.`, "warning", studentId);
      fetchData(); 
    }
  };

  const handleAddVideo = async (file?: File) => {
    if (!selectedModuleForVideo || !videoTitle) { toast.error("Title required"); return; }
    if (!videoUrl && !file) { toast.error("URL or file required"); return; }
    setIsUploading(true);
    try {
      let finalUrl = videoUrl;
      if (file) {
        const filePath = `${selectedModuleForVideo}/${Math.random()}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('module-videos').upload(filePath, file);
        if (uploadError) throw uploadError;
        finalUrl = supabase.storage.from('module-videos').getPublicUrl(filePath).data.publicUrl;
      }
      await supabase.from('module_videos').insert([{ module_id: selectedModuleForVideo, title: videoTitle, video_url: finalUrl }]);
      toast.success("Video added");
      setIsVideoDialogOpen(false);
      setVideoTitle("");
      setVideoUrl("");
      fetchData();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (confirm("Delete video?")) {
      await supabase.from('module_videos').delete().eq('id', videoId);
      fetchData();
    }
  };

  const handleApproveAccess = async (requestId: string, studentId: string, moduleTitle: string) => {
    const { error } = await supabase
      .from('quiz_access_requests')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) {
      toast.error("Failed to approve: " + error.message);
      return;
    }

    // Reset attempts for this student on this quiz? 
    // Actually, the student logic should check if there's an approved request.
    // I'll just notify the student.
    toast.success("Access request approved");
    await sendNotification(
      "Quiz Access Approved", 
      `Your request for more attempts in "${moduleTitle}" has been approved.`, 
      "success", 
      studentId
    );
    fetchData();
  };


  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId); else next.add(moduleId);
      return next;
    });
  };

  const getModuleStats = (mod: ModuleWithSubmissions) => {
    let total = 0, pending = 0, approved = 0, rejected = 0;
    mod.tasks.forEach(t => t.submissions.forEach(s => {
      total++;
      if (s.status === 'pending') pending++;
      else if (s.status === 'approved') approved++;
      else rejected++;
    }));
    return { total, pending, approved, rejected };
  };

  if (loading) return (
    <DashboardLayout role="teacher">
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading modules...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Modules & Submissions</h1>
            <p className="text-muted-foreground mt-1">Review student progress</p>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1.5 border rounded-lg bg-background text-foreground text-sm">
            <option value="all">All Submissions</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved Only</option>
            <option value="rejected">Rejected Only</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(() => {
            let t = 0, p = 0, a = 0, r = 0;
            modules.forEach(m => { const s = getModuleStats(m); t += s.total; p += s.pending; a += s.approved; r += s.rejected; });
            return (
              <>
                <div className="premium-card p-4 text-center"><p className="text-2xl font-bold">{t}</p><p className="text-sm text-muted-foreground">Total</p></div>
                <div className="premium-card p-4 text-center"><p className="text-2xl font-bold text-warning">{p}</p><p className="text-sm text-muted-foreground">Pending</p></div>
                <div className="premium-card p-4 text-center"><p className="text-2xl font-bold text-success">{a}</p><p className="text-sm text-muted-foreground">Approved</p></div>
                <div className="premium-card p-4 text-center"><p className="text-2xl font-bold text-destructive">{r}</p><p className="text-sm text-muted-foreground">Rejected</p></div>
              </>
            );
          })()}
        </div>

        {accessRequests.length > 0 && (
          <div className="premium-card p-6 border-warning/30 bg-warning/5">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-warning" />
              Quiz Access Requests
            </h2>
            <div className="space-y-3">
              {accessRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentMap[req.user_id]?.avatar}`} />
                      <AvatarFallback>{req.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{req.studentName}</p>
                      <p className="text-xs text-muted-foreground">Requested more attempts for <b>{req.moduleTitle}</b></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApproveAccess(req.id, req.user_id, req.moduleTitle)}>Approve</Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive" onClick={async () => {
                      await supabase.from('quiz_access_requests').update({ status: 'rejected' }).eq('id', req.id);
                      toast.success("Request rejected");
                      fetchData();
                    }}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        <div className="space-y-4">
          {modules.length === 0 ? <div className="text-center py-10 border rounded-xl bg-card">No modules found.</div> : modules.map((mod) => (
            <div key={mod.id} className="rounded-xl border bg-card overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50" onClick={() => toggleModule(mod.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="h-5 w-5 text-primary" /></div>
                  <div>
                    <h3 className="font-semibold">Module {mod.orderNum}: {mod.title}</h3>
                    <p className="text-xs text-muted-foreground">{mod.tasks.length} tasks • {getModuleStats(mod).total} submissions</p>
                  </div>
                </div>
                {expandedModules.has(mod.id) ? <ChevronDown /> : <ChevronRight />}
              </div>

              {expandedModules.has(mod.id) && (
                <div className="border-t">
                  <div className="p-4 bg-muted/10 border-b flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2"><Video className="h-4 w-4 text-primary" />Module Content</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedModuleForQuiz({id: mod.id, title: mod.title}); setIsQuizDialogOpen(true); }}>
                        <Plus className="h-4 w-4 mr-1" />{mod.quizId ? "Edit Quiz" : "Add Quiz"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedModuleForVideo(mod.id); setIsVideoDialogOpen(true); }}>
                        <Plus className="h-4 w-4 mr-1" />Add Video
                      </Button>
                    </div>
                  </div>

                  {mod.videos.length > 0 && (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mod.videos.map(video => (
                        <div key={video.id} className="flex items-center justify-between p-2 rounded-lg border bg-card/50 text-xs">
                          <div className="flex flex-col">
                            <span className="font-medium">{video.title}</span>
                            <div className="flex -space-x-1 mt-1">
                              {video.completedBy.map(userId => (
                                <Avatar key={userId} className="h-4 w-4 border border-background" title={studentMap[userId]?.name}>
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentMap[userId]?.avatar}`} />
                                  <AvatarFallback>?</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" asChild><a href={video.video_url} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /></a></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDeleteVideo(video.id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="divide-y">
                    {mod.tasks.map(task => (
                      <div key={task.id} className="p-4">
                        <h5 className="text-sm font-medium">{task.title}</h5>
                        <div className="mt-2 space-y-2">
                          {task.submissions.filter(s => filterStatus === "all" || s.status === filterStatus).map(sub => (
                            <div key={sub.id} className="flex items-center justify-between text-xs border p-2 rounded bg-muted/20">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.studentAvatar}`} /></Avatar>
                                <span>{sub.studentName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(sub.status)}
                                <a href={sub.submissionUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /></a>
                                {sub.status === "pending" && (
                                  <>
                                    <Button size="sm" variant="outline" className="h-6 text-[10px] text-success border-success" onClick={() => handleApprove(sub.id, sub.studentId, sub.taskTitle)}>Approve</Button>
                                    <Button size="sm" variant="outline" className="h-6 text-[10px] text-destructive border-destructive" onClick={() => handleReject(sub.id, sub.studentId, sub.taskTitle)}>Reject</Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Module Video</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video title" />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." disabled={isUploading} />
            </div>
            <div className="relative py-2 text-center text-xs text-muted-foreground uppercase"><span className="bg-background px-2 relative z-10">Or</span><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div></div>
            <div className="space-y-2">
              <Label>Upload</Label>
              <Input type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAddVideo(f); }} disabled={isUploading} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVideoDialogOpen(false)}>Cancel</Button>
            <Button variant="premium" onClick={() => handleAddVideo()} disabled={isUploading}>{isUploading ? "Uploading..." : "Add Video"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Quiz: {selectedModuleForQuiz?.title}</DialogTitle>
          </DialogHeader>
          {selectedModuleForQuiz && (
            <QuizManager 
              moduleId={selectedModuleForQuiz.id} 
              moduleTitle={selectedModuleForQuiz.title} 
              onClose={() => {
                setIsQuizDialogOpen(false);
                fetchData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>

  );
};

export default TeacherModules;
