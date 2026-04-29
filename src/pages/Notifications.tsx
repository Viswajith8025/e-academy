import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCircle2, AlertCircle, Info, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("student");

  useEffect(() => {
    const sessionUserStr = localStorage.getItem("user");
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      setUserRole(sessionUser.role || "student");
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const sessionUser = JSON.parse(sessionUserStr);
      const role = sessionUser.role || "student";

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`target_role.eq.${role},target_role.eq.all,user_id.eq.${sessionUser.id}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // In a real app, you'd have a notification_reads table. 
      // For this demo, we'll use a local mock for read status since the schema didn't have user-specific reads.
      const formattedData: Notification[] = (data || []).map((item: any) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        time: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        isRead: false, // Mocking read status
      }));

      setNotifications(formattedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return CheckCircle2;
      case "warning": return AlertCircle;
      case "info": return Info;
      default: return Bell;
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case "success": return "bg-success/10 text-success";
      case "warning": return "bg-warning/10 text-warning";
      case "info": return "bg-info/10 text-info";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout role={userRole as any}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">Latest updates and announcements</p>
          </div>
        </motion.div>

        <div className="premium-card">
          {loading ? (
            <div className="p-20 text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading your notifications...</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="p-20 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No notifications yet.</p>
                </div>
              ) : (
                notifications.map((notif, index) => {
                  const Icon = getIcon(notif.type);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className={cn("p-2.5 rounded-xl shrink-0", getIconStyle(notif.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-foreground">{notif.title}</h4>
                          <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
