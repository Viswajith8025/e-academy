import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Gift, CreditCard, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Extensions = () => {
  const [userRole, setUserRole] = useState<string>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sessionUserStr = localStorage.getItem("user");
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      setUserRole(sessionUser.role || "student");
    }
  }, []);

  const handleRequest = async (type: 'free' | 'paid', duration: string) => {
    setIsSubmitting(true);
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
      const { error } = await supabase
        .from('extension_requests')
        .insert([{
          user_id: sessionUser.id,
          current_end_date: '2026-06-30', // Mock current date
          requested_duration: duration,
          type,
          status: 'pending'
        }]);

      if (error) throw error;
      toast.success(`Request for ${duration} ${type} extension submitted!`);
    } catch (error: any) {
      toast.error("Failed to submit request: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole === 'teacher') {
    return (
      <DashboardLayout role="teacher">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Clock className="h-16 w-16 text-primary mb-4 opacity-20" />
          <h1 className="text-2xl font-bold">Extension Requests</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Teachers can monitor their students' extension requests from the Student Management portal.
          </p>
          <Button className="mt-6" variant="premium" onClick={() => window.location.href = '/teacher/students'}>
            Go to Student Management
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Internship Extensions</h1>
          <p className="text-muted-foreground mt-1">Extend your internship duration to complete your learning</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl"><Clock className="h-6 w-6 text-primary" /></div>
          <div>
            <h3 className="font-semibold text-lg">Current Status</h3>
            <p className="text-muted-foreground">Your internship ends on <span className="font-medium text-foreground">June 30, 2026</span></p>
          </div>
          <Badge className="ml-auto bg-info text-info-foreground">63 days remaining</Badge>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card overflow-hidden">
            <div className="bg-gradient-to-r from-success/10 to-emerald-500/10 p-6 border-b border-success/20">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Gift className="h-5 w-5 text-success" /> Free Extension</h3>
              <div className="text-4xl font-bold text-success my-2">FREE</div>
              <p className="text-sm text-muted-foreground">Up to 3 months extension</p>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-success" /> Extend up to 3 months at no cost</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-success" /> Continue all your modules and progress</li>
              </ul>
              <Button 
                className="w-full bg-success hover:bg-success/90"
                onClick={() => handleRequest('free', '3 months')}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request Free Extension"}
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card overflow-hidden relative">
            <Badge className="absolute top-4 right-4 bg-primary">Premium</Badge>
            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 border-b border-primary/20">
              <h3 className="font-semibold text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Paid Extension</h3>
              <div className="text-4xl font-bold text-primary my-2">₹2,999</div>
              <p className="text-sm text-muted-foreground">Flexible monthly plans</p>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Priority support from mentors</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Career counseling sessions</li>
              </ul>
              <Button 
                variant="premium" 
                className="w-full"
                onClick={() => handleRequest('paid', '1 month')}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Choose Paid Extension"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Extensions;
