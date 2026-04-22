import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default",
  className 
}: StatCardProps) => {
  const variants = {
    default: "bg-card",
    primary: "bg-gradient-to-br from-primary to-blue-500 text-primary-foreground",
    success: "bg-gradient-to-br from-success to-emerald-400 text-success-foreground",
    warning: "bg-gradient-to-br from-warning to-amber-400 text-warning-foreground",
  };

  const iconVariants = {
    default: "bg-primary/10 text-primary",
    primary: "bg-white/20 text-white",
    success: "bg-white/20 text-white",
    warning: "bg-white/20 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl p-6 border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium mb-1",
            variant === "default" ? "text-muted-foreground" : "text-white/80"
          )}>
            {title}
          </p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {subtitle && (
            <p className={cn(
              "text-sm mt-1",
              variant === "default" ? "text-muted-foreground" : "text-white/70"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconVariants[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
