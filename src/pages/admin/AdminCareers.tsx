import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Clock,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  is_active: boolean;
  created_at: string;
}

interface Application {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
  portfolio_url: string;
  cover_letter: string;
  status: string;
  applied_at: string;
  job?: JobRole;
}

const AdminCareers = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [roleTitle, setRoleTitle] = useState("");
  const [roleDept, setRoleDept] = useState("");
  const [roleLocation, setRoleLocation] = useState("");
  const [roleType, setRoleType] = useState("Full-time");
  const [roleDesc, setRoleDesc] = useState("");
  const [roleReqs, setRoleReqs] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, appsRes] = await Promise.all([
        supabase.from('job_roles').select('*').order('created_at', { ascending: false }),
        supabase.from('job_applications').select('*, job:job_roles(*)').order('applied_at', { ascending: false })
      ]);

      if (rolesRes.error) throw rolesRes.error;
      if (appsRes.error) throw appsRes.error;

      setRoles(rolesRes.data || []);
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error("Error fetching admin careers data:", error);
      toast({ title: "Error", description: "Failed to load careers data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingRole(null);
    setRoleTitle("");
    setRoleDept("");
    setRoleLocation("");
    setRoleType("Full-time");
    setRoleDesc("");
    setRoleReqs("");
  };

  const handleEditRole = (role: JobRole) => {
    setEditingRole(role);
    setRoleTitle(role.title);
    setRoleDept(role.department);
    setRoleLocation(role.location);
    setRoleType(role.type);
    setRoleDesc(role.description);
    setRoleReqs(role.requirements.join("\n"));
    setIsDialogOpen(true);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const roleData = {
      title: roleTitle,
      department: roleDept,
      location: roleLocation,
      type: roleType,
      description: roleDesc,
      requirements: roleReqs.split("\n").filter(r => r.trim() !== ""),
    };

    try {
      if (editingRole) {
        const { error } = await supabase
          .from('job_roles')
          .update(roleData)
          .eq('id', editingRole.id);
        if (error) throw error;
        toast({ title: "Role Updated", description: "The job role has been updated successfully." });
      } else {
        const { error } = await supabase
          .from('job_roles')
          .insert([roleData]);
        if (error) throw error;
        toast({ title: "Role Created", description: "The new job role has been created successfully." });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving role:", error);
      toast({ title: "Error", description: "Failed to save job role.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRoleStatus = async (role: JobRole) => {
    try {
      const { error } = await supabase
        .from('job_roles')
        .update({ is_active: !role.is_active })
        .eq('id', role.id);
      if (error) throw error;
      toast({ title: "Status Updated", description: `Role is now ${!role.is_active ? 'active' : 'inactive'}.` });
      fetchData();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast({ title: "Error", description: "Failed to update role status.", variant: "destructive" });
    }
  };

  const deleteRole = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job role? All associated applications will also be deleted.")) return;
    try {
      const { error } = await supabase.from('job_roles').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Role Deleted", description: "The job role has been removed." });
      fetchData();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({ title: "Error", description: "Failed to delete role.", variant: "destructive" });
    }
  };

  const updateAppStatus = async (appId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', appId);
      if (error) throw error;
      toast({ title: "Status Updated", description: `Application status changed to ${status}.` });
      fetchData();
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold">Manage Careers</h1>
            <p className="text-muted-foreground mt-1">
              Oversee job roles and review incoming applications.
            </p>
          </motion.div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="premium" className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRole ? 'Edit Job Role' : 'Create New Job Role'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveRole} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input 
                      id="title" 
                      value={roleTitle} 
                      onChange={(e) => setRoleTitle(e.target.value)} 
                      placeholder="e.g. Frontend Intern" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept">Department</Label>
                    <Input 
                      id="dept" 
                      value={roleDept} 
                      onChange={(e) => setRoleDept(e.target.value)} 
                      placeholder="e.g. Engineering" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={roleLocation} 
                      onChange={(e) => setRoleLocation(e.target.value)} 
                      placeholder="e.g. Remote / Bangalore" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Employment Type</Label>
                    <select 
                      id="type" 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea 
                    id="desc" 
                    value={roleDesc} 
                    onChange={(e) => setRoleDesc(e.target.value)} 
                    placeholder="Describe the role and responsibilities..." 
                    rows={4} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reqs">Requirements (One per line)</Label>
                  <Textarea 
                    id="reqs" 
                    value={roleReqs} 
                    onChange={(e) => setRoleReqs(e.target.value)} 
                    placeholder="List requirements here..." 
                    rows={4} 
                    required 
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="premium" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingRole ? 'Update Role' : 'Create Role')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="roles" className="rounded-lg gap-2">
              <Briefcase className="h-4 w-4" />
              Job Roles
            </TabsTrigger>
            <TabsTrigger value="apps" className="rounded-lg gap-2">
              <Users className="h-4 w-4" />
              Applications
              {applications.filter(a => a.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-1 px-1.5 py-0 min-w-[1.2rem] h-5">
                  {applications.filter(a => a.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-6">
            <div className="premium-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8">Loading roles...</TableCell></TableRow>
                  ) : roles.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No job roles created yet.</TableCell></TableRow>
                  ) : roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.title}</TableCell>
                      <TableCell>{role.department}</TableCell>
                      <TableCell>{role.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={() => toggleRoleStatus(role)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            role.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${role.is_active ? 'bg-success' : 'bg-muted-foreground'}`} />
                          {role.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditRole(role)} className="gap-2">
                              <Edit2 className="h-4 w-4" /> Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleRoleStatus(role)} className="gap-2">
                              {role.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                              {role.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteRole(role.id)} className="gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4" /> Delete Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="apps" className="mt-6">
            <div className="premium-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job Role</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8">Loading applications...</TableCell></TableRow>
                  ) : applications.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No applications received yet.</TableCell></TableRow>
                  ) : applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{app.full_name}</span>
                          <span className="text-xs text-muted-foreground">{app.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{app.job?.title || 'Unknown'}</span>
                          <span className="text-xs text-muted-foreground">{app.job?.department}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            app.status === 'pending' ? 'bg-warning/10 text-warning hover:bg-warning/20 border-warning/20' :
                            app.status === 'shortlisted' ? 'bg-info/10 text-info hover:bg-info/20 border-info/20' :
                            app.status === 'accepted' ? 'bg-success/10 text-success hover:bg-success/20 border-success/20' :
                            'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20'
                          }
                          variant="outline"
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-1">
                                    <Label className="text-muted-foreground">Full Name</Label>
                                    <p className="font-semibold text-lg">{app.full_name}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-semibold">{app.email}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <p className="font-semibold">{app.phone || 'N/A'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-muted-foreground">Job Applied For</Label>
                                    <p className="font-semibold">{app.job?.title}</p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <Label className="text-muted-foreground">Cover Letter</Label>
                                  <div className="p-4 bg-muted/50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap italic">
                                    {app.cover_letter || "No cover letter provided."}
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-2">
                                  {app.resume_url && (
                                    <Button asChild variant="outline" className="gap-2">
                                      <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4" /> View Resume
                                      </a>
                                    </Button>
                                  )}
                                  {app.portfolio_url && (
                                    <Button asChild variant="outline" className="gap-2">
                                      <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" /> Portfolio
                                      </a>
                                    </Button>
                                  )}
                                </div>

                                <div className="pt-4 border-t border-border">
                                  <Label className="mb-3 block">Update Status</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((s) => (
                                      <Button 
                                        key={s}
                                        size="sm"
                                        variant={app.status === s ? 'default' : 'outline'}
                                        onClick={() => updateAppStatus(app.id, s)}
                                        className="capitalize"
                                      >
                                        {s}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateAppStatus(app.id, 'shortlisted')} className="gap-2">
                                <CheckCircle2 className="h-4 w-4 text-info" /> Shortlist
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateAppStatus(app.id, 'rejected')} className="gap-2 text-destructive focus:text-destructive">
                                <XCircle className="h-4 w-4" /> Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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

export default AdminCareers;
