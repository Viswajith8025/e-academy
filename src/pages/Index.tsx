import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Code,
  Database,
  Palette,
  BarChart3,
  CheckCircle2,
  Play,
  Linkedin,
  Twitter,
  Briefcase,
  Clock,
  Terminal,
  MapPin,
  Mail,
  Phone,
  Send,
  Calendar,
  Building2,
  Star,
  FileCheck2,
  Trophy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useRef } from "react";
import GradientText from "@/components/GradientText";
import RotatingText from "@/components/RotatingText";
import CountUp from "@/components/CountUp";
import LogoLoop from "@/components/LogoLoop";
import MagicBento from "@/components/MagicBento";
import BorderGlow from "@/components/BorderGlow";
import { 
  SiPostgresql, 
  SiTypescript, 
  SiJavascript, 
  SiTailwindcss, 
  SiVercel, 
  SiRender, 
  SiGit, 
  SiSupabase, 
  SiReact, 
  SiNodedotjs, 
  SiFigma, 
  SiFramer, 
  SiOpenai 
} from "react-icons/si";
import { FaHtml5, FaCss3Alt } from "react-icons/fa";

const techLogos = [
  { node: <SiReact size={32} />, title: "React" },
  { node: <SiTypescript size={32} />, title: "TypeScript" },
  { node: <SiJavascript size={32} />, title: "JavaScript" },
  { node: <SiTailwindcss size={32} />, title: "Tailwind CSS" },
  { node: <FaHtml5 size={32} />, title: "HTML5" },
  { node: <FaCss3Alt size={32} />, title: "CSS3" },
  { node: <SiNodedotjs size={32} />, title: "Node.js" },
  { node: <SiPostgresql size={32} />, title: "PostgreSQL" },
  { node: <SiSupabase size={32} />, title: "Supabase" },
  { node: <SiGit size={32} />, title: "Git" },
  { node: <SiVercel size={32} />, title: "Vercel" },
  { node: <SiRender size={32} />, title: "Render" },
  { node: <SiFigma size={32} />, title: "Figma" },
  { node: <SiFramer size={32} />, title: "Framer" },
  { node: <SiOpenai size={32} />, title: "OpenAI" },
];

const teamMembers = [
  { name: "Dr. Anand Sharma", role: "Engineering Mentor", bio: "Former Staff Engineer at a Series C fintech. Focuses on scalable backend architectures.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Priya Patel", role: "Product Design Lead", bio: "Ex-agency Design Director. Teaches design systems, motion, and interaction patterns.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Rahul Verma", role: "Full-Stack Instructor", bio: "React core contributor. Helps students bridge the gap between theory and production code.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Sneha Iyer", role: "Career Coach", bio: "Former technical recruiter. Guides students through interview prep and portfolio building.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256" },
];

const studyItems = [
  { icon: Code, title: "Full-Stack Engineering", desc: "Build a production-ready SaaS application from scratch. Learn authentication, databases, and API design.", hiring: "Tech Startups & Agencies", duration: "12 Weeks", tools: ["React", "Node.js", "PostgreSQL"] },
  { icon: Database, title: "Data Analytics & Python", desc: "Analyze real-world datasets, build predictive models, and create interactive data dashboards.", hiring: "Fintech & E-commerce", duration: "10 Weeks", tools: ["Python", "Pandas", "SQL"] },
  { icon: Palette, title: "Product Design (UI/UX)", desc: "Conduct user research, design wireframes, and hand off a high-fidelity prototype to developers.", hiring: "Product Studios & B2B", duration: "8 Weeks", tools: ["Figma", "Framer", "Miro"] },
  { icon: BarChart3, title: "Growth Marketing", desc: "Run live ad campaigns, optimize landing page conversions, and analyze user acquisition metrics.", hiring: "DTC Brands & SaaS", duration: "8 Weeks", tools: ["Google Ads", "Analytics", "SEO"] },
];

const testimonials = [
  { name: "Aisha Khan", role: "Frontend Developer", company: "Hired at TechFlow", quote: "EIT didn't just teach me code; they taught me how to work on a real engineering team. The code reviews were rigorous and exactly what I needed.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150" },
  { name: "Rohan Das", role: "Data Analyst", company: "Hired at DataSync", quote: "Having a mentor audit my SQL queries every week transformed my understanding. The portfolio I built here directly landed me my current role.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150" },
  { name: "Meera Joshi", role: "UX Designer", company: "Hired at Studio Hexa", quote: "The most valuable part was learning how to present my designs and defend my decisions. It bridged the gap between bootcamp theory and agency reality.", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150" },
];

// Refined, subtle spring animation
const springTransition = { type: "spring", stiffness: 400, damping: 40 };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...springTransition, delay: i * 0.1 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* Navbar - Premium Frosted Glass Pill */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springTransition}
        className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-3xl border-b border-black/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
      >
        <div className="container mx-auto px-5 h-14 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-10">
            {["Curriculum", "Mentorship", "Reviews"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, ...springTransition }}
                className="text-xs font-semibold text-zinc-500 hover:text-black tracking-wide transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex text-xs font-semibold text-zinc-500 hover:text-black hover:bg-transparent h-9 px-4">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 h-9 px-6 rounded-full">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Cinematic, Asymmetrical, Premium */}
      <section ref={heroRef} className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-5 relative overflow-hidden bg-white">
        
        {/* Subtle background gradient lighting */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,rgba(132,0,255,0.08),transparent_50%)] pointer-events-none" />
        
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left Column (Span 5): The Narrative Engine */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="lg:col-span-5 flex flex-col items-start"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
                }}
                className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-8 border border-primary/10"
              >
                Applications Open
              </motion.div>

              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
                }}
                className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tighter leading-[1.05] text-balance"
              >
                Stop learning syntax. Start shipping <span className="text-primary">production.</span>
              </motion.h1>

              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
                }}
                className="text-lg font-normal text-zinc-500 mb-10 leading-relaxed max-w-lg text-balance"
              >
                Your career transition, engineered for success. Build a world-class portfolio under the strict guidance of active engineering leaders.
              </motion.p>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
                }}
                className="flex flex-col w-full sm:flex-row items-center gap-4 mb-4"
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="xl" className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgba(132,0,255,0.2)] border border-primary/20 transition-all active:scale-95 text-base h-12 px-8 font-medium">
                    Start Your Application
                  </Button>
                </Link>
                <Link to="#curriculum" className="w-full sm:w-auto group">
                  <Button size="xl" variant="ghost" className="w-full gap-2 hover:bg-transparent text-muted-foreground hover:text-foreground h-12 px-6 bg-transparent transition-all">
                    View the Syllabus
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { delay: 0.5, duration: 1 } }
                }}
                className="text-xs text-muted-foreground mb-12"
              >
                Cohort 12 starts in 14 days • No credit card required.
              </motion.p>

              {/* The Trust Cluster */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }
                }}
                className="flex items-center gap-4 pt-6 border-t border-primary/5 w-full"
              >
                <div className="flex -space-x-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="Student" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="Student" />
                  <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=faces" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="Student" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary/5 flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                    +500
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex text-[#FFB800] mb-0.5">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/></svg>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Join engineers hired at Vercel & Stripe.</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column (Span 7): The Ecosystem Panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-7 relative hidden lg:block h-[500px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,0,255,0.05),transparent_70%)] rounded-full" />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                {/* Back Layer: Code Editor Window */}
                <div className="absolute top-0 right-0 w-[500px] bg-white border border-black/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden z-10">
                  <div className="h-10 bg-zinc-50 border-b border-black/5 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="mx-auto bg-white border border-black/5 rounded-md px-24 py-1 text-[10px] text-muted-foreground font-mono">
                      Dashboard.tsx
                    </div>
                  </div>
                  <div className="p-6 font-mono text-xs leading-relaxed text-zinc-600 bg-white/50">
                    <p><span className="text-purple-600">export default function</span> <span className="text-blue-600">Dashboard</span>() {'{'}</p>
                    <p className="pl-4"><span className="text-purple-600">const</span> [metrics, setMetrics] = <span className="text-blue-600">useState</span>(null);</p>
                    <p className="pl-4 mt-2"><span className="text-purple-600">useEffect</span>(() =&gt; {'{'}</p>
                    <p className="pl-8"><span className="text-purple-600">async function</span> <span className="text-blue-600">loadData</span>() {'{'}</p>
                    <p className="pl-12"><span className="text-purple-600">const</span> data = <span className="text-purple-600">await</span> api.<span className="text-blue-600">fetchMetrics</span>();</p>
                    <p className="pl-12"><span className="text-blue-600">setMetrics</span>(data);</p>
                    <p className="pl-8">{'}'}</p>
                    <p className="pl-8"><span className="text-blue-600">loadData</span>();</p>
                    <p className="pl-4">{'}'}, []);</p>
                    <p className="pl-4 mt-2"><span className="text-purple-600">return</span> (</p>
                    <p className="pl-8">&lt;<span className="text-blue-600">MetricGrid</span> data={'{'}metrics{'}'} /&gt;</p>
                    <p className="pl-4">);</p>
                    <p>{'}'}</p>
                  </div>
                </div>

                {/* Middle Layer: Mentorship Feedback Modal */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-48 left-0 w-80 bg-white border border-black/5 shadow-[0_20px_40px_rgb(0,0,0,0.08)] rounded-xl p-4 z-20 flex gap-4"
                >
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop" className="w-10 h-10 rounded-full border border-black/5" alt="Mentor" />
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-foreground">Dr. Anand Sharma</p>
                      <span className="text-[10px] text-muted-foreground bg-black/5 px-1.5 py-0.5 rounded">Mentor</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Great architecture here. Let's optimize this state management for production before we deploy to AWS.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <div className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded font-medium">Resolve</div>
                      <div className="bg-black/5 text-muted-foreground text-[10px] px-2 py-1 rounded font-medium">Reply</div>
                    </div>
                  </div>
                </motion.div>

                {/* Front Layer: Career Roadmap */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-4 right-10 w-64 bg-white border border-primary/10 shadow-[0_20px_40px_rgb(132,0,255,0.06)] rounded-xl p-4 z-30"
                >
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Career Trajectory</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Phase 3: Building</p>
                    </div>
                    <div className="w-[1px] h-4 bg-primary/20 ml-2"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-primary bg-white flex items-center justify-center relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm font-medium text-primary">Phase 4: Hiring</p>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </motion.div>
            
          </div>
        </motion.div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-12 border-y border-primary/5 bg-white overflow-hidden relative">
        <div className="container mx-auto px-5 text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Master the tools used by elite engineering teams</p>
        </div>
        <div className="w-full max-w-[100vw]">
          <LogoLoop
            logos={techLogos}
            speed={40}
            direction="left"
            logoHeight={40}
            gap={60}
            hoverSpeed={10}
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology Stack"
          />
        </div>
      </section>

      {/* How it Works / Timeline */}
      <section className="py-24 md:py-32 px-5">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-[-0.02em]">
              A proven methodology for career growth.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              We bridge the gap between academic theory and industry reality through a structured, project-based apprenticeship.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "1. Core Training", desc: "Spend the first 3 weeks mastering industry-standard tools and workflows through intense, guided sprints." },
              { icon: Terminal, title: "2. Build & Ship", desc: "Work on a complex, real-world project. No more to-do apps. Build applications that solve actual business problems." },
              { icon: FileCheck2, title: "3. Mentor Feedback", desc: "Get your code, designs, or campaigns audited weekly by professionals who hire for these roles." }
            ].map((step, i) => (
              <motion.div 
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { ...springTransition, delay: i * 0.1 } }
                }}
                className="h-full"
              >
                <BorderGlow
                  className="h-full p-8"
                  edgeSensitivity={50}
                  animated={true}
                  colors={['#8400ff', '#f472b6', '#38bdf8']}
                  borderRadius={24}
                >
                  <div className="w-12 h-12 bg-muted/80 rounded-xl flex items-center justify-center mb-6 group-hover/item:bg-primary/5 transition-colors border border-primary/5">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm flex-grow">{step.desc}</p>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum - Cinematic Dark Mode Ecosystem */}
      <section id="curriculum" className="py-40 px-5 bg-[#050507] relative overflow-hidden rounded-t-[3rem] -mt-12 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.2)]">
        {/* Cinematic Volumetric Lighting */}
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(132,0,255,0.1),transparent_60%)] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_60%)] rounded-full pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mb-24"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6">
              // SEC.03 — The Blueprint
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.05]">
              Architect systems. <br/> <span className="italic font-serif text-zinc-400 font-normal">Don't just write code.</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl text-balance leading-relaxed">
              Our curriculum operates like a high-growth startup. You will inherit codebases, conduct system design reviews, and deploy to AWS.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Ecosystem Panel 1: Full-Stack */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group hover:bg-[#0c0c0f] transition-colors duration-700"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="z-10">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Full-Stack Engineering</h3>
                  <p className="text-zinc-400 leading-relaxed mb-8 text-lg">
                    Build a production-ready SaaS application from scratch. Learn secure authentication, relational database design, and highly scalable REST API architecture.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-8 mt-auto">
                    <div className="flex -space-x-2 mr-4">
                      <img src={teamMembers[0].image} alt="Mentor" className="w-8 h-8 rounded-full border-2 border-[#050507]" />
                      <img src={teamMembers[2].image} alt="Mentor" className="w-8 h-8 rounded-full border-2 border-[#050507]" />
                    </div>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">React 18</span>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">Node.js</span>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">PostgreSQL</span>
                  </div>
                </div>
                
                {/* Mini UI Window */}
                <div className="relative h-[300px] w-full rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 ease-[0.16,1,0.3,1]">
                  <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="p-5 font-mono text-[11px] leading-relaxed text-zinc-400">
                    <p><span className="text-primary/80">const</span> <span className="text-blue-400">authenticateUser</span> = <span className="text-primary/80">async</span> (req, res) =&gt; {'{'}</p>
                    <p className="pl-4 mt-1"><span className="text-primary/80">try</span> {'{'}</p>
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="pl-8 text-zinc-300 border-l-2 border-primary/50 bg-primary/5 py-0.5 my-1"
                    >
                      <span className="text-primary/80">const</span> token = <span className="text-primary/80">await</span> authService.<span className="text-blue-400">verify</span>(req.headers);
                    </motion.p>
                    <p className="pl-8"><span className="text-primary/80">if</span> (!token) <span className="text-primary/80">throw new</span> <span className="text-amber-300">Error</span>(<span className="text-green-400">'Unauthorized'</span>);</p>
                    <p className="pl-8 mt-1"><span className="text-primary/80">const</span> user = <span className="text-primary/80">await</span> db.<span className="text-blue-400">query</span>(</p>
                    <p className="pl-12 text-green-400">'SELECT * FROM users WHERE id = $1'</p>
                    <p className="pl-8">);</p>
                    <p className="pl-8 mt-1"><span className="text-primary/80">return</span> res.<span className="text-blue-400">status</span>(200).<span className="text-blue-400">json</span>(user);</p>
                    <p className="pl-4">{'}'} <span className="text-primary/80">catch</span> (err) {'{'}</p>
                    <p className="pl-8">logger.<span className="text-blue-400">error</span>(err);</p>
                    <p className="pl-4">{'}'}</p>
                    <p>{'}'};</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ecosystem Panel 2: Data Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="w-full bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group hover:bg-[#0c0c0f] transition-colors duration-700"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative h-[300px] w-full rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 ease-[0.16,1,0.3,1] p-6 flex flex-col justify-end">
                  {/* Mini Data Chart */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-xs text-zinc-500 font-mono">
                    <span>Revenue Analytics</span>
                    <span className="text-green-400">+24.5%</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-40 w-full mt-auto">
                    {[40, 70, 45, 90, 65, 110, 85].map((height, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                        className="w-full bg-primary/20 rounded-t-sm relative group-hover/bar:bg-primary/40 transition-colors"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-sm" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="order-1 lg:order-2 z-10">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20">
                    <Database className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Data Analytics & Engineering</h3>
                  <p className="text-zinc-400 leading-relaxed mb-8 text-lg">
                    Transform raw data into strategic business intelligence. Master predictive modeling, complex SQL joins, and interactive dashboard creation.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-8 mt-auto">
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">Python</span>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">Pandas</span>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">Advanced SQL</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ecosystem Panel 3: Product Design */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-full bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group hover:bg-[#0c0c0f] transition-colors duration-700"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="z-10">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-8 border border-pink-500/20">
                    <Palette className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Product Design (UI/UX)</h3>
                  <p className="text-zinc-400 leading-relaxed mb-8 text-lg">
                    Design interfaces that convert. Learn psychological design principles, robust design systems, and high-fidelity prototyping.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-8 mt-auto">
                    <div className="flex -space-x-2 mr-4">
                      <img src={teamMembers[1].image} alt="Mentor" className="w-8 h-8 rounded-full border-2 border-[#050507]" />
                    </div>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">Figma</span>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">Framer</span>
                    <span className="text-xs font-mono px-3 py-1 bg-white/5 text-zinc-300 rounded-md border border-white/10">User Research</span>
                  </div>
                </div>
                
                {/* Mini Figma Window */}
                <div className="relative h-[300px] w-full rounded-2xl bg-[#1e1e1e] border border-white/10 overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 ease-[0.16,1,0.3,1] flex items-center justify-center">
                  <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 flex items-center px-4 justify-between bg-[#2c2c2c]">
                    <div className="flex gap-2 items-center text-zinc-400 text-xs">
                      <Palette className="w-3 h-3" />
                      <span>Hero_Section_V2.fig</span>
                    </div>
                  </div>
                  {/* Artboard representation */}
                  <div className="w-[80%] h-[160px] bg-white rounded-lg mt-10 shadow-lg relative flex flex-col items-center justify-center p-4">
                    <motion.div 
                      className="absolute inset-0 border-2 border-blue-500/0 rounded-lg pointer-events-none"
                      whileHover={{ borderColor: "rgba(59, 130, 246, 1)" }}
                      initial={{ borderColor: "rgba(59, 130, 246, 0)" }}
                    >
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="w-3/4 h-6 bg-zinc-200 rounded-md mb-4" />
                    <div className="w-full h-3 bg-zinc-100 rounded-sm mb-2" />
                    <div className="w-5/6 h-3 bg-zinc-100 rounded-sm mb-6" />
                    <div className="w-32 h-8 bg-black rounded-full" />
                  </div>
                  {/* Cursor */}
                  <motion.div 
                    initial={{ x: 50, y: 50, opacity: 0 }}
                    whileInView={{ x: -20, y: -20, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="absolute z-20 pointer-events-none"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.79 6.75 21.35L11.4 17.06C11.66 16.82 12.01 16.69 12.38 16.69H19.5C20.17 16.69 20.5 15.89 20.03 15.42L6.92 2.31C6.44 1.83 5.5 2.17 5.5 3.21Z" fill="black" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="bg-blue-500 text-white text-[8px] font-medium px-1.5 py-0.5 rounded ml-3 mt-1 shadow-sm">
                      Priya Patel
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team / Mentorship Section - Editorial Masonry */}
      <section id="mentorship" className="py-32 px-5 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,#8400ff0a,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left side: Header & Lead Mentor */}
            <div className="lg:col-span-5 flex flex-col">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="mb-16"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  // SEC.04 — Mentorship
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tighter leading-[1.1]">
                  Learn from practitioners. <br/> <span className="italic font-serif text-zinc-500 font-normal">Not academics.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our core team consists of elite industry veterans who actively write production code and design systems for the world's best companies.
                </p>
              </motion.div>

              {/* Lead Mentor Card - Oversized */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-none border-l-4 border-l-primary border-y border-r border-black/5 p-8 relative overflow-hidden group shadow-[0_20px_40px_rgb(0,0,0,0.03)]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors" />
                <div className="flex gap-6 items-start mb-6">
                  <img src={teamMembers[0].image} alt={teamMembers[0].name} className="w-20 h-20 rounded-none object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{teamMembers[0].name}</h3>
                    <p className="text-sm font-semibold text-primary mt-1">{teamMembers[0].role}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-[10px] font-medium px-2 py-1 bg-zinc-100 text-zinc-600 rounded">Ex-Stripe</span>
                      <span className="text-[10px] font-medium px-2 py-1 bg-zinc-100 text-zinc-600 rounded">AWS Certified</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {teamMembers[0].bio} Anand leads the backend architecture track and conducts rigorous, real-world system design interviews with our senior cohort.
                </p>
              </motion.div>
            </div>

            {/* Right side: Staggered Masonry */}
            <div className="lg:col-span-7 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                <div className="space-y-6 sm:mt-24">
                  {teamMembers.slice(1, 3).map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-white p-6 border border-black/5 rounded-none shadow-sm hover:shadow-[0_10px_30px_rgb(0,0,0,0.04)] transition-shadow group"
                    >
                      <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover mb-4 border border-zinc-100 grayscale group-hover:grayscale-0 transition-all" />
                      <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                      <p className="text-xs font-semibold text-primary mb-3">{member.role}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-6 sm:-mt-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-primary/5 p-6 border border-primary/10 rounded-none shadow-sm"
                  >
                    <img src={teamMembers[3].image} alt={teamMembers[3].name} className="w-12 h-12 rounded-full object-cover mb-4 border border-white" />
                    <h3 className="text-lg font-bold text-foreground">{teamMembers[3].name}</h3>
                    <p className="text-xs font-semibold text-primary mb-3">{teamMembers[3].role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{teamMembers[3].bio}</p>
                  </motion.div>
                  
                  {/* Join Team CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="p-6 border border-dashed border-zinc-300 rounded-none flex flex-col items-center justify-center text-center h-48 bg-transparent"
                  >
                    <p className="text-sm font-semibold text-zinc-500 mb-2">Want to mentor?</p>
                    <Button variant="link" className="text-primary p-0 h-auto">Apply to join our faculty &rarr;</Button>
                  </motion.div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Palette Cleanser */}
      <section className="py-32 px-5 bg-white border-y border-black/5 relative overflow-hidden flex items-center justify-center min-h-[40vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="container mx-auto text-center max-w-4xl relative z-10"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-zinc-300 font-normal leading-tight tracking-tight">
            "The distance between a junior and a senior engineer is measured in <span className="text-primary font-semibold">shipped products</span>, not certificates."
          </h2>
        </motion.div>
      </section>

      {/* Testimonials - Asymmetrical Overlap Layering */}
      <section id="reviews" className="pt-32 pb-48 px-5 bg-[#09090b] relative overflow-hidden">
        {/* Deep background lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(132,0,255,0.08),transparent_70%)] rounded-full pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
          >
            <div className="max-w-2xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
                // SEC.05 — The Proof
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-[1.1]">
                Outcomes that speak <br/><span className="text-zinc-500">for themselves.</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <span className="text-white text-sm font-medium">4.9/5 Alumni Rating</span>
            </div>
          </motion.div>

          {/* Broken Grid / Horizontal Tension Layout */}
          <div className="relative w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="flex flex-col md:flex-row gap-6 md:gap-8 lg:-mr-32" 
              // The -mr-32 creates intentional horizontal bleed off the right edge of the screen on desktop
            >
              {testimonials.map((t, index) => (
                <motion.div
                  key={t.name}
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className={`bg-[#121214] border border-white/5 rounded-none flex flex-col min-w-[300px] md:min-w-[400px] hover:bg-[#18181b] hover:border-primary/20 transition-all duration-500 p-8 md:p-10 ${index === 1 ? 'md:-mt-12' : index === 2 ? 'md:mt-12' : ''}`}
                >
                  <p className="text-zinc-300 mb-10 leading-relaxed text-lg font-light tracking-wide">"{t.quote}"</p>
                  <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-6">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale" />
                    <div>
                      <p className="text-base font-bold text-white tracking-tight">{t.name}</p>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{t.role}</p>
                      <p className="text-sm font-semibold text-primary mt-0.5">{t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA - Cinematic Dark Section */}
      <section className="py-40 px-5 bg-[#050507] relative overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Deep volumetric lighting matching curriculum */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(132,0,255,0.1),transparent_70%)] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl container mx-auto"
        >
          <div className="flex items-center justify-center mx-auto mb-8">
            <Logo size="lg" showText={false} className="grayscale brightness-200 scale-125" />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.05]">
            Ready to engineer <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">your future?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-xl mx-auto leading-relaxed">
            Applications for Cohort 12 are closing soon. Take the first step towards a career you love. No credit card required to apply.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="xl" className="h-14 px-10 text-base bg-white text-black hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-transform active:scale-95 font-semibold rounded-full">
                Apply Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="xl" variant="ghost" className="h-14 px-10 text-base text-zinc-300 hover:text-white hover:bg-white/5 transition-transform active:scale-95 font-medium rounded-full border border-white/10">
                Contact Admissions
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Fat Footer - Structured & Architectural */}
      <footer className="pt-32 pb-12 px-5 bg-black border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">
            
            <div className="md:col-span-5 pr-12">
              <div className="flex items-center mb-6">
                <Logo size="md" className="grayscale brightness-200" />
              </div>
              <p className="text-base text-zinc-500 leading-relaxed max-w-sm mb-8">
                Empowering the next generation of digital builders through structured mentorship, rigorous engineering, and real-world product delivery.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2 md:col-start-7">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-100 mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                <li><a href="#curriculum" className="hover:text-white transition-colors">Curriculum</a></li>
                <li><a href="#mentorship" className="hover:text-white transition-colors">Faculty</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Outcomes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuition</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-100 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-100 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-zinc-500 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-600">
            <p> 2025 E-Academy Institute of Technology. All rights reserved.</p>
            <p>Designed in India. Shipped Globally.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
