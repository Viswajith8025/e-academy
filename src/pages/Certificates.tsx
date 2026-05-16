import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { Award, Download, Eye, ShieldCheck, CheckCircle2, Trophy, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import CertificateTemplate from "@/components/dashboard/CertificateTemplate";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface Certificate {
  id: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  isCompleted: boolean;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    fetchCompletionStatus();
  }, []);

  const fetchCompletionStatus = async () => {
    try {
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const user = JSON.parse(sessionUserStr);
      setStudentName(user.name);

      // Get all modules and student's progress
      const { data: modules } = await supabase.from('modules').select('id, title').eq('is_published', true);
      const { data: progress } = await supabase.from('video_progress').select('module_id, is_completed').eq('user_id', user.id).eq('is_completed', true);
      const { data: taskSubs } = await supabase.from('task_submissions').select('module_id, status').eq('user_id', user.id).eq('status', 'approved');
      const { data: quizAtt } = await supabase.from('quiz_attempts').select('quiz_id, passed').eq('user_id', user.id).eq('passed', true);

      // Simple logic for this demo: if they have at least 1 completed module, show a general "EIT Excellence" certificate
      // In a real app, this would be tied to specific "Course" entities
      const completedModuleIds = new Set((progress || []).map(p => p.module_id));
      
      const isEligible = completedModuleIds.size > 0;

      if (isEligible) {
        setCertificates([
          {
            id: "cert-1",
            courseName: "EIT Industry Readiness Program",
            completionDate: new Date().toLocaleDateString(),
            certificateId: `EIT-${user.id.substring(0, 8).toUpperCase()}`,
            isCompleted: true
          }
        ]);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cert: Certificate) => {
    setSelectedCert(cert);
    setIsGenerating(true);
    
    // Small delay to ensure the template is rendered in the dialog
    setTimeout(async () => {
      try {
        const element = document.getElementById("certificate-content");
        if (!element) return;
        
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        const link = document.createElement("a");
        link.download = `Certificate_${cert.courseName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        toast.success("Certificate downloaded successfully!");
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to generate certificate image.");
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" /> My Certificates
            </h1>
            <p className="text-muted-foreground mt-1">View and download your earned certifications</p>
          </motion.div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Keep learning to unlock more!</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Verifying your achievements...</p>
          </div>
        ) : certificates.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No Certificates Yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Complete your assigned modules, tasks, and quizzes to earn your first professional certification.
              </p>
            </div>
            <Button variant="premium" onClick={() => window.location.href = "/modules"}>
              Continue Learning
            </Button>
            
            <div className="pt-10 border-t w-full max-w-sm">
              <p className="text-xs text-muted-foreground mb-4">Testing the certificate system?</p>
              <Button variant="outline" className="w-full gap-2 border-dashed" onClick={() => {
                setCertificates([{
                  id: "demo-cert",
                  courseName: "EIT Demo Course (Testing)",
                  completionDate: new Date().toLocaleDateString(),
                  certificateId: "EIT-DEMO-12345",
                  isCompleted: true
                }]);
                toast.info("Demo certificate added for testing!");
              }}>
                Show Demo Certificate
              </Button>
            </div>
          </motion.div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group premium-card p-6 flex flex-col space-y-6 hover:shadow-xl transition-all duration-300 border-primary/20 bg-gradient-to-br from-card to-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6" />
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold leading-tight">{cert.courseName}</h3>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <p>Issued on {cert.completionDate}</p>
                    <p className="font-mono">ID: {cert.certificateId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button 
                    variant="premium" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleDownload(cert)}
                    disabled={isGenerating && selectedCert?.id === cert.id}
                  >
                    {isGenerating && selectedCert?.id === cert.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Hidden area for generating the certificate if not visible */}
        <div className="sr-only">
          {selectedCert && (
            <div className="fixed top-[-9999px] left-[-9999px] w-[1123px]">
              <CertificateTemplate 
                studentName={studentName}
                courseName={selectedCert.courseName}
                completionDate={selectedCert.completionDate}
                certificateId={selectedCert.certificateId}
              />
            </div>
          )}
        </div>

        {/* Preview Dialog */}
        <Dialog open={!!selectedCert && !isGenerating} onOpenChange={(open) => !open && setSelectedCert(null)}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>Certificate Preview</DialogTitle>
            </DialogHeader>
            {selectedCert && (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full shadow-2xl rounded-sm overflow-hidden scale-90 md:scale-100 origin-center">
                  <CertificateTemplate 
                    studentName={studentName}
                    courseName={selectedCert.courseName}
                    completionDate={selectedCert.completionDate}
                    certificateId={selectedCert.certificateId}
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    variant="premium" 
                    size="lg" 
                    className="px-10 shadow-lg"
                    onClick={() => handleDownload(selectedCert)}
                  >
                    <Download className="h-5 w-5 mr-2" /> Download PNG
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => setSelectedCert(null)}
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Certificates;
