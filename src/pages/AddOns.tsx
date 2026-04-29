import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Brain, Compass, CheckCircle2, Play, BookOpen, Download } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AddOns = () => {
  const [userRole, setUserRole] = useState<string>("student");

  useEffect(() => {
    const sessionUserStr = localStorage.getItem("user");
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      setUserRole(sessionUser.role || "student");
    }
  }, []);

  if (userRole === 'teacher') {
    return (
      <DashboardLayout role="teacher">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-bold">Teaching Resources</h1>
            <p className="text-muted-foreground mt-1">Additional materials to enhance your students' learning experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Pedagogy Guide", icon: BookOpen, desc: "Best practices for technical mentoring" },
              { title: "Advanced Projects", icon: Brain, desc: "Curated list of high-impact student projects" },
              { title: "Career Toolkit", icon: Compass, desc: "Resumes and interview guides for students" }
            ].map((res, i) => (
              <div key={i} className="premium-card p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <res.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{res.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{res.desc}</p>
                <Button variant="outline" className="mt-4 w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold">Add-On Programs</h1>
          <p className="text-muted-foreground mt-1">Boost your internship with specialized training</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Communication Skills", price: "₹1,499", icon: MessageSquare, color: "bg-blue-500/10 text-blue-500" },
            { title: "Aptitude Training", price: "₹1,999", icon: Brain, color: "bg-purple-500/10 text-purple-500" },
            { title: "Career Guidance", price: "₹999", icon: Compass, color: "bg-orange-500/10 text-orange-500" }
          ].map((addon, i) => (
            <div key={i} className="premium-card overflow-hidden">
              <div className={`p-6 ${addon.color} border-b border-white/10`}>
                <addon.icon className="h-8 w-8 mb-4" />
                <h3 className="text-xl font-bold text-foreground">{addon.title}</h3>
                <p className="text-2xl font-bold mt-2">{addon.price}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success" /> Lifetime access</li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success" /> Verified Certificate</li>
                </ul>
                <Button className="w-full" variant="premium">Enroll Now</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddOns;
