import { motion } from "framer-motion";
import { MessageSquare, Brain, Compass, CheckCircle2, Play } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AddOn {
  id: number;
  title: string;
  description: string;
  icon: typeof MessageSquare;
  price: string;
  duration: string;
  features: string[];
  status: "not-enrolled" | "enrolled" | "completed";
  progress?: number;
  color: string;
}

const addOns: AddOn[] = [
  {
    id: 1,
    title: "Communication Skills",
    description: "Master professional communication for workplace success",
    icon: MessageSquare,
    price: "₹1,499",
    duration: "4 weeks",
    features: [
      "Email etiquette & writing",
      "Presentation skills",
      "Meeting management",
      "Cross-cultural communication",
    ],
    status: "enrolled",
    progress: 65,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Aptitude Training",
    description: "Prepare for placements with comprehensive aptitude training",
    icon: Brain,
    price: "₹1,999",
    duration: "6 weeks",
    features: [
      "Quantitative aptitude",
      "Logical reasoning",
      "Verbal ability",
      "Mock tests & analysis",
    ],
    status: "not-enrolled",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Career Orientation",
    description: "Get industry insights and career guidance from experts",
    icon: Compass,
    price: "₹999",
    duration: "2 weeks",
    features: [
      "Industry overview sessions",
      "Resume building workshop",
      "Interview preparation",
      "LinkedIn optimization",
    ],
    status: "completed",
    progress: 100,
    color: "from-orange-500 to-red-500",
  },
];

const AddOns = () => {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Add-On Programs
          </h1>
          <p className="text-muted-foreground mt-1">
            Enhance your skills with our specialized add-on courses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {addOns.map((addon, index) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${addon.color} p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <addon.icon className="h-6 w-6 text-white" />
                    </div>
                    {addon.status === "enrolled" && (
                      <Badge className="bg-white/20 text-white border-0">In Progress</Badge>
                    )}
                    {addon.status === "completed" && (
                      <Badge className="bg-white text-green-600 border-0">Completed</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{addon.title}</h3>
                  <p className="text-white/80 text-sm">{addon.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Progress (if enrolled) */}
                {addon.status === "enrolled" && addon.progress !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{addon.progress}%</span>
                    </div>
                    <Progress value={addon.progress} className="h-2" />
                  </div>
                )}

                {/* Price and Duration */}
                <div className="flex items-center justify-between py-3 border-y border-border">
                  <div>
                    <p className="text-2xl font-bold">{addon.price}</p>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{addon.duration}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {addon.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                {addon.status === "not-enrolled" && (
                  <Button variant="premium" className="w-full">
                    Enroll Now
                  </Button>
                )}
                {addon.status === "enrolled" && (
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                )}
                {addon.status === "completed" && (
                  <Button variant="outline" className="w-full">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                    View Certificate
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bundle Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 border-primary/20"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge className="bg-primary text-primary-foreground mb-2">Special Offer</Badge>
              <h3 className="text-xl font-bold">Complete Add-On Bundle</h3>
              <p className="text-muted-foreground mt-1">
                Get all 3 add-on programs at a discounted price and save ₹1,000!
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-lg line-through text-muted-foreground">₹4,497</span>
                <span className="text-3xl font-bold text-primary">₹3,497</span>
              </div>
              <Button variant="premium" className="mt-2">
                Get Bundle
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
