import { motion } from "framer-motion";
import { Bell, Check, AlertCircle, Info, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: number;
  type: "success" | "warning" | "info" | "event";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

const NotificationsPanel = ({ notifications }: NotificationsPanelProps) => {
  const navigate = useNavigate();
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return Check;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {notifications.filter(n => !n.isRead).length} new
        </span>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 5).map((notification, index) => {
          const Icon = getIcon(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                notification.isRead ? "bg-transparent hover:bg-muted/50" : "bg-accent/50 hover:bg-accent"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                getIconStyle(notification.type)
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm",
                  notification.isRead ? "text-muted-foreground" : "text-foreground font-medium"
                )}>
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {notification.message}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {notification.time}
              </span>
            </motion.div>
          );
        })}
      </div>

      <button 
        onClick={() => navigate("/notifications")}
        className="w-full mt-4 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
      >
        View all notifications
      </button>
    </motion.div>
  );
};

export default NotificationsPanel;
