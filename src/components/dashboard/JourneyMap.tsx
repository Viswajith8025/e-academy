import { motion } from "framer-motion";
import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module {
  id: number;
  title: string;
  status: "completed" | "current" | "locked";
  description?: string;
}

interface JourneyMapProps {
  modules: Module[];
}

const JourneyMap = ({ modules }: JourneyMapProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Learning Journey</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Status indicator */}
              <div
                className={cn(
                  "relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                  module.status === "completed" && "bg-success text-success-foreground shadow-md",
                  module.status === "current" && "bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulse-slow",
                  module.status === "locked" && "bg-muted text-muted-foreground"
                )}
              >
                {module.status === "completed" && <Check className="h-5 w-5" />}
                {module.status === "current" && <Play className="h-5 w-5" />}
                {module.status === "locked" && <Lock className="h-5 w-5" />}
              </div>

              {/* Content */}
              <div
                className={cn(
                  "flex-1 p-4 rounded-xl transition-all duration-300",
                  module.status === "completed" && "bg-success/5 border border-success/20",
                  module.status === "current" && "bg-primary/5 border border-primary/30 shadow-sm",
                  module.status === "locked" && "bg-muted/50 border border-border opacity-60"
                )}
              >
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    "font-medium",
                    module.status === "locked" && "text-muted-foreground"
                  )}>
                    Module {module.id}: {module.title}
                  </h4>
                  {module.status === "completed" && (
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                      Completed
                    </span>
                  )}
                  {module.status === "current" && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  )}
                  {module.status === "locked" && (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      Locked
                    </span>
                  )}
                </div>
                {module.description && (
                  <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default JourneyMap;
