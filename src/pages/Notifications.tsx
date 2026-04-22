import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCircle2, AlertCircle, Info, Calendar, Trash2, Filter } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  type: "success" | "warning" | "info" | "event" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
}

const notifications: Notification[] = [
  { id: 1, type: "success", title: "Task Approved", message: "Your Module 2 task 'JavaScript basics' has been approved by Dr. Sarah Wilson.", time: "2 hours ago", isRead: false },
  { id: 2, type: "warning", title: "Leave Request Pending", message: "Your leave request for Feb 5-7 is awaiting approval from your mentor.", time: "5 hours ago", isRead: false },
  { id: 3, type: "event", title: "Upcoming Live Session", message: "Live session with Dr. Sarah Wilson scheduled for tomorrow at 10:00 AM IST.", time: "1 day ago", isRead: false },
  { id: 4, type: "info", title: "New Module Unlocked", message: "Congratulations! Module 3 'Practical Applications' is now available for you.", time: "1 day ago", isRead: true },
  { id: 5, type: "success", title: "Certificate Earned", message: "You've earned the 'Quick Learner' badge for completing Module 2 ahead of schedule!", time: "2 days ago", isRead: true },
  { id: 6, type: "system", title: "System Maintenance", message: "Scheduled maintenance on Feb 10, 2025 from 2:00 AM to 4:00 AM IST.", time: "3 days ago", isRead: true },
  { id: 7, type: "info", title: "Profile Update Reminder", message: "Please update your LinkedIn profile URL in your account settings.", time: "4 days ago", isRead: true },
  { id: 8, type: "event", title: "Webinar Invitation", message: "You're invited to 'Career in Tech' webinar on Feb 15, 2025.", time: "5 days ago", isRead: true },
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return CheckCircle2;
    case "warning":
      return AlertCircle;
    case "info":
      return Info;
    case "event":
      return Calendar;
    default:
      return Bell;
  }
};

const getIconStyle = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "bg-success/10 text-success";
    case "warning":
      return "bg-warning/10 text-warning";
    case "info":
      return "bg-info/10 text-info";
    case "event":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.isRead;
    return n.type === activeTab;
  });

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your latest alerts and messages
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-primary">{unreadCount}</p>
            <p className="text-sm text-muted-foreground">Unread</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-success">
              {notifications.filter((n) => n.type === "success").length}
            </p>
            <p className="text-sm text-muted-foreground">Approvals</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="premium-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-warning">
              {notifications.filter((n) => n.type === "event").length}
            </p>
            <p className="text-sm text-muted-foreground">Events</p>
          </motion.div>
        </div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-4 border-b border-border">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {unreadCount > 0 && (
                    <Badge className="ml-1.5 h-5 w-5 p-0 justify-center bg-primary text-primary-foreground">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="success">Approvals</TabsTrigger>
                <TabsTrigger value="event">Events</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="divide-y divide-border">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications to show</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification, index) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          !notification.isRead && "bg-accent/30"
                        )}
                      >
                        <div className={cn(
                          "p-2.5 rounded-xl shrink-0",
                          getIconStyle(notification.type)
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn(
                              "font-medium",
                              !notification.isRead && "text-foreground"
                            )}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
