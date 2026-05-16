import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Shield, Book, Calendar, Edit2, Check, X, Camera, Loader2, ArrowLeft, Users, CreditCard, Download, Eye } from "lucide-react";

import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import StudentIDCard from "@/components/dashboard/StudentIDCard";
import html2canvas from "html2canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showIDCard, setShowIDCard] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: "",
    program: "",
    role: "",
    mentor: ""
  });

  const isAdmin = currentUser?.role === 'admin';
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    const sessionUserStr = localStorage.getItem("user");
    if (sessionUserStr) {
      setCurrentUser(JSON.parse(sessionUserStr));
    }
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const sessionUser = JSON.parse(sessionUserStr);
      
      const targetId = userId || sessionUser.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetId)
        .single();

      if (error) throw error;
      
      // Auto-generate ID number for students if missing
      if (data.role === 'student' && !data.id_number) {
        const newIdNumber = `EIT-2025-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ id_number: newIdNumber })
          .eq('id', data.id);
        
        if (!updateError) {
          data.id_number = newIdNumber;
        }
      }

      setProfile(data);

      setFormData({
        full_name: data.full_name || "",
        avatar_url: data.avatar_url || "",
        program: data.program || "",
        role: data.role || "",
        mentor: data.mentor || ""
      });
    } catch (error: any) {
      toast.error("Error fetching profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData: any = {
        full_name: formData.full_name,
        avatar_url: formData.avatar_url
      };

      // Admin can edit extra fields
      if (isAdmin) {
        updateData.program = formData.program;
        updateData.role = formData.role;
        updateData.mentor = formData.mentor;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      // Update local storage if it's the own profile
      if (isOwnProfile) {
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          ...updateData
        }));
        setCurrentUser({ ...currentUser, ...updateData });
      }

      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={currentUser?.role || "student"}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={currentUser?.role || "student"}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button for Admin */}
        {!isOwnProfile && (
          <Button 
            variant="ghost" 
            className="mb-4 gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User List
          </Button>
        )}

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="h-48 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/10" />
          <div className="absolute -bottom-12 left-8 flex items-end gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`} />
                <AvatarFallback className="text-2xl">{profile?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </button>
              )}
            </div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-foreground">{profile?.full_name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1 capitalize">
                <Shield className="h-4 w-4" />
                {profile?.role}
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {(isOwnProfile || isAdmin) && (
              !isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="secondary" className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} variant="premium">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="premium-card p-6 space-y-6">
              <h3 className="text-lg font-semibold border-b pb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      disabled={!isEditing}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      disabled
                      value={profile?.email}
                      className="pl-9 bg-muted/50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Avatar URL (DiceBear or Custom)</Label>
                    <Input 
                      placeholder="https://..."
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="premium-card p-6 space-y-4">
              <h3 className="text-lg font-semibold border-b pb-4">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Program</Label>
                  {isEditing && isAdmin ? (
                    <Select value={formData.program} onValueChange={(v) => setFormData({...formData, program: v})}>
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
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                      <Book className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Enrolled Program</p>
                        <p className="font-medium">{profile?.program || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Account Role</Label>
                  {isEditing && isAdmin ? (
                    <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">User Role</p>
                        <p className="font-medium capitalize">{profile?.role}</p>
                      </div>
                    </div>
                  )}
                </div>

                {profile?.role === 'student' && (
                  <div className="space-y-2">
                    <Label>Mentor</Label>
                    {isEditing && isAdmin ? (
                      <Input 
                        value={formData.mentor}
                        onChange={(e) => setFormData({...formData, mentor: e.target.value})}
                        placeholder="Mentor Name"
                      />
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Assigned Mentor</p>
                          <p className="font-medium">{profile?.mentor || "None"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Joined Date</p>
                      <p className="font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats/Quick Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="premium-card p-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-bold text-lg capitalize">{profile?.role} Account</h4>
              <p className="text-sm text-muted-foreground mt-1">Verified Member</p>
              
              {profile?.id_number && (
                <div className="mt-4 p-3 bg-muted/50 rounded-xl border border-dashed border-primary/20">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Student ID</p>
                  <p className="text-sm font-mono font-bold text-primary">{profile.id_number}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t space-y-3">
                {profile?.role === 'student' && (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => setShowIDCard(true)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Digital ID Card
                  </Button>
                )}
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-success font-medium flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last Login</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ID Card Dialog */}
        <Dialog open={showIDCard} onOpenChange={setShowIDCard}>
          <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>Digital Student ID</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6">
              <div className="scale-90 md:scale-100 origin-top">
                <StudentIDCard student={profile} />
              </div>
              <div className="flex gap-4 pb-6">
                <Button 
                  variant="premium" 
                  size="lg"
                  className="gap-2 px-8"
                  disabled={isGenerating}
                  onClick={async () => {
                    setIsGenerating(true);
                    try {
                      const element = document.getElementById("student-id-card");
                      if (element) {
                        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
                        const link = document.createElement("a");
                        link.download = `EIT_ID_${profile.full_name.replace(/\s+/g, '_')}.png`;
                        link.href = canvas.toDataURL("image/png");
                        link.click();
                        toast.success("ID Card downloaded!");
                      }
                    } catch (error) {
                      toast.error("Failed to download ID card.");
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download ID Card
                </Button>
                <Button variant="secondary" onClick={() => setShowIDCard(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>

  );
};

export default Profile;
