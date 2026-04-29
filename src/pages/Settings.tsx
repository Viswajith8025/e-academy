import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Eye, 
  Palette, 
  Globe, 
  ShieldCheck,
  ChevronRight,
  Moon,
  Sun,
  Smartphone
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [role, setRole] = useState<any>("student");
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("eit-notifications");
    return saved ? JSON.parse(saved) : {
      email: true,
      browser: true,
      marketing: false
    };
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setRole(user.role || "student");
  }, []);

  const handleToggle = (key: keyof typeof notifications) => {
    const newState = { ...notifications, [key]: !notifications[key] };
    setNotifications(newState);
    localStorage.setItem("eit-notifications", JSON.stringify(newState));
    toast.success("Preference updated");
  };

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      toast.error("User not found");
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      // 1. Verify current password
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('password')
        .eq('id', user.id)
        .single();

      if (fetchError || !profile) throw new Error("Could not verify current password");

      if (profile.password !== passwordForm.current) {
        throw new Error("Incorrect current password");
      }

      // 2. Update password
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ password: passwordForm.new })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success("Password updated successfully!");
      setIsDialogOpen(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences and application settings</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Navigation Sidebar */}
          <div className="space-y-2">
            {[
              { icon: Bell, label: "Notifications", id: "notifications" },
              { icon: Lock, label: "Security", id: "security" },
              { icon: Palette, label: "Appearance", id: "appearance" },
              { icon: Globe, label: "Language", id: "language" },
              { icon: ShieldCheck, label: "Privacy", id: "privacy" }
            ].map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Main Settings Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Notifications Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-card p-6 space-y-6"
            >
              <div className="flex items-center gap-3 border-b pb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Notification Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your tasks and tickets via email.</p>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={() => handleToggle('email')}
                  />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get real-time alerts in your browser when you're online.</p>
                  </div>
                  <Switch 
                    checked={notifications.browser} 
                    onCheckedChange={() => handleToggle('browser')}
                  />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">Stay informed about new programs and features.</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing} 
                    onCheckedChange={() => handleToggle('marketing')}
                  />
                </div>
              </div>
            </motion.div>

            {/* Appearance Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-card p-6 space-y-6"
            >
              <div className="flex items-center gap-3 border-b pb-4">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Appearance</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                    theme === "light" ? "border-primary bg-primary/5" : "border-transparent hover:border-muted"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full shadow-sm",
                    theme === "light" ? "bg-background" : "bg-muted"
                  )}>
                    <Sun className={cn("h-6 w-6", theme === "light" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button 
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                    theme === "dark" ? "border-primary bg-primary/5" : "border-transparent hover:border-muted"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full shadow-sm",
                    theme === "dark" ? "bg-background" : "bg-muted"
                  )}>
                    <Moon className={cn("h-6 w-6", theme === "dark" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button 
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                    theme === "system" ? "border-primary bg-primary/5" : "border-transparent hover:border-muted"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full shadow-sm",
                    theme === "system" ? "bg-background" : "bg-muted"
                  )}>
                    <Smartphone className={cn("h-6 w-6", theme === "system" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
            </motion.div>

            {/* Security Section Placeholder */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-card p-6 space-y-6"
            >
              <div className="flex items-center gap-3 border-b pb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Security</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">Last changed recently</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Update</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          required 
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 border-t pt-4">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          required 
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          required 
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        />
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="premium" disabled={isChangingPassword}>
                          {isChangingPassword ? "Updating..." : "Update Password"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
