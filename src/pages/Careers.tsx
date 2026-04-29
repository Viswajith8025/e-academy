import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Send,
  Loader2,
  Globe,
  Building2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const Careers = () => {
  const [jobs, setJobs] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_roles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({ title: "Error", description: "Failed to load career options.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const departments = ["All", ...Array.from(new Set(jobs.map(j => j.department)))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const application = {
      job_id: selectedJob.id,
      full_name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      portfolio_url: formData.get('portfolio'),
      resume_url: formData.get('resume'),
      cover_letter: formData.get('cover_letter'),
      status: 'pending'
    };

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([application]);

      if (error) throw error;

      toast({
        title: "Application Sent!",
        description: "Thank you for applying. We will review your application soon."
      });
      setIsApplying(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({ title: "Error", description: "Failed to submit application.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {["Programs", "Team", "Reviews", "Contact"].map((item, i) => (
              <motion.a
                key={item}
                href={`/#${item.toLowerCase() === "reviews" ? "testimonials" : item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors story-link"
              >
                <span>{item}</span>
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/careers" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                Careers
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="premium">Get Started</Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Your Career with <span className="text-primary">EIT</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join our mission to empower the next generation of tech talent.
              We're looking for passionate individuals to help us scale.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search job roles..."
                className="pl-10 h-12 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                className="h-12 px-4 rounded-xl border border-input bg-background"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="pb-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading career opportunities...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold">No roles found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid gap-6"
              >
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="premium-card p-6 md:p-8 group hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsApplying(false);
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{job.department}</span>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                          <span className="text-sm text-muted-foreground">{job.type}</span>
                        </div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
                          <div className="flex items-center gap-1.5 text-sm">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Clock className="h-4 w-4" />
                            Posted recently
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" className="hidden md:flex gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-6 w-6 text-muted-foreground md:hidden" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Job Details Modal/Overlay */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="min-h-screen flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-card border border-border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden"
              >
                {!isApplying ? (
                  <div className="p-8 md:p-12">
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to jobs
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{selectedJob.title}</h2>
                        <div className="flex items-center gap-4 text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5 text-sm"><Building2 className="h-4 w-4" /> {selectedJob.department}</span>
                          <span className="flex items-center gap-1.5 text-sm"><Globe className="h-4 w-4" /> {selectedJob.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Description</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedJob.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-3">Requirements</h4>
                        <ul className="space-y-3">
                          {selectedJob.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center gap-4">
                        <Button
                          size="xl"
                          variant="premium"
                          className="w-full sm:w-auto"
                          onClick={() => setIsApplying(true)}
                        >
                          Apply for this role
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xl"
                          className="w-full sm:w-auto"
                          onClick={() => setSelectedJob(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 md:p-12">
                    <button
                      onClick={() => setIsApplying(false)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to description
                    </button>

                    <h2 className="text-3xl font-bold mb-2">Apply for {selectedJob.title}</h2>
                    <p className="text-muted-foreground mb-10">Please fill out the form below and we'll be in touch.</p>

                    <form onSubmit={handleApply} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                          <Input id="portfolio" name="portfolio" placeholder="https://yourportfolio.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resume">Resume/CV URL</Label>
                        <Input id="resume" name="resume" placeholder="Link to your resume (Google Drive, Dropbox, etc.)" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
                        <Textarea
                          id="cover_letter"
                          name="cover_letter"
                          placeholder="Tell us why you're a great fit for this role..."
                          rows={4}
                        />
                      </div>

                      <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                        <Button
                          type="submit"
                          size="xl"
                          variant="premium"
                          className="w-full sm:w-auto"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Submit Application
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xl"
                          className="w-full sm:w-auto"
                          onClick={() => setIsApplying(false)}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see a role that fits?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future openings.
          </p>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Contact Talent Team
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <Logo size="sm" className="mb-4 grayscale opacity-50" />
          <p>© 2025 EIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Careers;
