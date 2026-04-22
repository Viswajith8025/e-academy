import { motion } from "framer-motion";
import { Clock, Gift, CreditCard, CheckCircle2, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Extensions = () => {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Internship Extensions
          </h1>
          <p className="text-muted-foreground mt-1">
            Extend your internship duration to complete your learning
          </p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Current Internship Status</h3>
              <p className="text-muted-foreground">
                Your internship ends on <span className="font-medium text-foreground">March 15, 2025</span>
              </p>
            </div>
            <Badge className="ml-auto bg-info text-info-foreground">45 days remaining</Badge>
          </div>
        </motion.div>

        {/* Extension Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Extension */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card overflow-hidden"
          >
            <div className="bg-gradient-to-r from-success/10 to-emerald-500/10 p-6 border-b border-success/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-success/20 rounded-lg">
                  <Gift className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Free Extension</h3>
                  <p className="text-sm text-muted-foreground">No additional cost</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-success mb-2">FREE</div>
              <p className="text-sm text-muted-foreground">Up to 3 months extension</p>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Extend up to 3 months at no cost</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Continue all your modules and progress</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Keep access to support and mentorship</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Available once per program</span>
                </li>
              </ul>
              <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
                Request Free Extension
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You have 1 free extension available
              </p>
            </div>
          </motion.div>

          {/* Paid Extension */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="premium-card overflow-hidden relative"
          >
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground">Premium</Badge>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 border-b border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Paid Extension</h3>
                  <p className="text-sm text-muted-foreground">Extended access</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">₹2,999</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Flexible monthly plans</p>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Extend for as long as you need</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Priority support from mentors</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Access to exclusive masterclasses</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Enhanced certificate with honors</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Career counseling sessions</span>
                </li>
              </ul>
              <Button variant="premium" className="w-full">
                Choose Paid Extension
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime • 7-day money-back guarantee
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6"
        >
          <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">When can I request an extension?</h4>
              <p className="text-sm text-muted-foreground">
                You can request an extension anytime before your internship end date. We recommend applying at least 7 days before.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Will my progress be saved?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! All your completed modules, tasks, and certificates are saved and will continue from where you left off.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Can I switch from free to paid extension?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely! You can upgrade to a paid extension at any time to get access to premium features.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Extensions;
