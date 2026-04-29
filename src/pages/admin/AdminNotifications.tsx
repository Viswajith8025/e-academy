import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Trash2, Plus, Loader2, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  target_role: string;
  created_at: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    target_role: "all"
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      toast.error("Error fetching notifications: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert([newNotification]);

      if (error) throw error;

      toast.success("Notification published successfully!");
      setIsDialogOpen(false);
      setNewNotification({ title: "", message: "", type: "info", target_role: "all" });
      fetchNotifications();
    } catch (error: any) {
      toast.error("Failed to send notification: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error: any) {
      toast.error("Failed to delete: " + error.message);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-success" />;
      default: return <Info className="h-4 w-4 text-info" />;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Notifications</h1>
            <p className="text-muted-foreground mt-1">Broadcast messages to students and teachers</p>
          </div>
          <Button variant="premium" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Notification
          </Button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 border rounded-xl bg-card text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No notifications sent yet.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex gap-4 min-w-0">
                  <div className={`p-3 rounded-lg shrink-0 ${
                    notif.type === 'warning' ? 'bg-warning/10' : 
                    notif.type === 'success' ? 'bg-success/10' : 'bg-info/10'
                  }`}>
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{notif.title}</h3>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {notif.target_role === 'all' ? 'Everyone' : notif.target_role}s
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(notif.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send New Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notification Title</Label>
              <Input 
                value={newNotification.title} 
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="e.g., Scheduled Maintenance" 
              />
            </div>
            <div className="space-y-2">
              <Label>Message Content</Label>
              <Textarea 
                value={newNotification.message} 
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                placeholder="Details of the announcement..." 
                className="min-h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select 
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <select 
                  value={newNotification.target_role}
                  onChange={(e) => setNewNotification({...newNotification, target_role: e.target.value})}
                  className="w-full h-10 px-3 border rounded-lg bg-background text-sm"
                >
                  <option value="all">Everyone</option>
                  <option value="student">Students Only</option>
                  <option value="teacher">Teachers Only</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="premium" onClick={handleSendNotification}>
              <Send className="h-4 w-4 mr-2" />
              Publish Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminNotifications;
