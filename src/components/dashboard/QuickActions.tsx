import { motion } from "framer-motion";
import { Calendar, Ticket, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Calendar,
    label: "Apply Leave",
    href: "/leave",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    icon: Ticket,
    label: "Raise Ticket",
    href: "/tickets",
    color: "bg-warning/10 text-warning hover:bg-warning/20",
  },
  {
    icon: Clock,
    label: "Request Extension",
    href: "/extensions",
    color: "bg-info/10 text-info hover:bg-info/20",
  },
  {
    icon: MessageCircle,
    label: "Contact Support",
    href: "/support",
    color: "bg-success/10 text-success hover:bg-success/20",
  },
];

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.href}>
              <Button
                variant="ghost"
                className={`w-full h-auto flex-col gap-2 py-4 ${action.color} transition-all duration-200`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
