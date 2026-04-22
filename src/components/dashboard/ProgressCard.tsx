import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  programName: string;
  duration: string;
  daysRemaining: number;
  totalDays: number;
  modulesCompleted: number;
  totalModules: number;
}

const ProgressCard = ({
  programName,
  duration,
  daysRemaining,
  totalDays,
  modulesCompleted,
  totalModules,
}: ProgressCardProps) => {
  const daysProgress = ((totalDays - daysRemaining) / totalDays) * 100;
  const modulesProgress = (modulesCompleted / totalModules) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{programName}</h3>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
          {daysRemaining} days left
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Internship Progress</span>
            <span className="font-medium">{Math.round(daysProgress)}%</span>
          </div>
          <Progress value={daysProgress} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Modules Completed</span>
            <span className="font-medium">{modulesCompleted}/{totalModules}</span>
          </div>
          <Progress value={modulesProgress} className="h-2 bg-success/20 [&>div]:bg-success" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressCard;
