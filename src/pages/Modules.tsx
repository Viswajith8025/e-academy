import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Play, Upload, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  status: "pending" | "submitted" | "approved" | "rejected";
  submittedAt?: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  status: "completed" | "current" | "locked";
  tasks: Task[];
  duration: string;
}

const modulesData: Module[] = [
  {
    id: 1,
    title: "Introduction to Program",
    description: "Learn the basics and get familiar with the program structure",
    status: "completed",
    duration: "2 weeks",
    tasks: [
      { id: 1, title: "Complete orientation quiz", status: "approved" },
      { id: 2, title: "Submit introduction video", status: "approved" },
    ],
  },
  {
    id: 2,
    title: "Core Concepts",
    description: "Master the fundamental concepts required for the program",
    status: "completed",
    duration: "3 weeks",
    tasks: [
      { id: 3, title: "HTML/CSS fundamentals", status: "approved" },
      { id: 4, title: "JavaScript basics", status: "approved" },
      { id: 5, title: "Project submission", status: "approved" },
    ],
  },
  {
    id: 3,
    title: "Practical Applications",
    description: "Apply your knowledge to real-world scenarios",
    status: "current",
    duration: "4 weeks",
    tasks: [
      { id: 6, title: "Build a landing page", status: "approved" },
      { id: 7, title: "Create interactive components", status: "submitted", submittedAt: "Feb 1, 2025" },
      { id: 8, title: "Full project implementation", status: "pending" },
    ],
  },
  {
    id: 4,
    title: "Advanced Topics",
    description: "Dive deeper into advanced concepts and techniques",
    status: "locked",
    duration: "3 weeks",
    tasks: [
      { id: 9, title: "State management", status: "pending" },
      { id: 10, title: "API integration", status: "pending" },
    ],
  },
  {
    id: 5,
    title: "Final Project",
    description: "Showcase your skills with a comprehensive final project",
    status: "locked",
    duration: "2 weeks",
    tasks: [
      { id: 11, title: "Project proposal", status: "pending" },
      { id: 12, title: "Final submission", status: "pending" },
    ],
  },
];

const getTaskStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "submitted":
      return <Clock className="h-4 w-4 text-warning" />;
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
  }
};

const getTaskStatusBadge = (status: Task["status"]) => {
  switch (status) {
    case "approved":
      return <Badge variant="default" className="bg-success text-success-foreground">Approved</Badge>;
    case "submitted":
      return <Badge variant="default" className="bg-warning text-warning-foreground">Pending Review</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">Not Started</Badge>;
  }
};

const Modules = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(3);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Learning Modules
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete modules in order to unlock the next one
          </p>
        </motion.div>

        <div className="space-y-4">
          {modulesData.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "rounded-xl border transition-all duration-300 overflow-hidden",
                module.status === "locked" && "opacity-60",
                module.status === "current" && "border-primary shadow-lg shadow-primary/10",
                module.status === "completed" && "border-success/30",
                module.status !== "current" && module.status !== "completed" && "border-border"
              )}
            >
              {/* Module Header */}
              <div
                className={cn(
                  "p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors",
                  module.status === "locked" && "cursor-not-allowed"
                )}
                onClick={() => module.status !== "locked" && setExpandedModule(
                  expandedModule === module.id ? null : module.id
                )}
              >
                {/* Status Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    module.status === "completed" && "bg-success text-success-foreground",
                    module.status === "current" && "bg-primary text-primary-foreground",
                    module.status === "locked" && "bg-muted text-muted-foreground"
                  )}
                >
                  {module.status === "completed" && <Check className="h-5 w-5" />}
                  {module.status === "current" && <Play className="h-5 w-5" />}
                  {module.status === "locked" && <Lock className="h-5 w-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      Module {module.id}: {module.title}
                    </h3>
                    {module.status === "current" && (
                      <Badge variant="default" className="bg-primary">In Progress</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{module.duration}</span>
                    <span>•</span>
                    <span>{module.tasks.length} tasks</span>
                    <span>•</span>
                    <span>{module.tasks.filter(t => t.status === "approved").length} completed</span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedModule === module.id && module.status !== "locked" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border bg-muted/30"
                >
                  <div className="p-5 space-y-4">
                    <h4 className="font-medium text-foreground">Tasks</h4>
                    <div className="space-y-3">
                      {module.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            {getTaskStatusIcon(task.status)}
                            <div>
                              <p className="text-sm font-medium">{task.title}</p>
                              {task.submittedAt && (
                                <p className="text-xs text-muted-foreground">
                                  Submitted on {task.submittedAt}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getTaskStatusBadge(task.status)}
                            {task.status === "pending" && (
                              <Button size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Submit
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Modules;
