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
      
      {/* Navbar - Clean, bright, and highly professional */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springTransition}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/5"
      >
        <div className="container mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-8">
            {["Curriculum", "Mentorship", "Outcomes", "Reviews"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, ...springTransition }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex font-medium text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm border border-primary/20 transition-all active:scale-95">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Realistic, grounded, editorial */}
      <section ref={heroRef} className="pt-32 md:pt-40 pb-24 px-5 relative">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Text & CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-xl"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-white border border-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6 shadow-sm"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Applications open for Fall Cohort
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-[-0.02em] leading-[1.1] relative">
                Start your tech career with<br />
                <RotatingText 
                  texts={['real experience.', 'EIT.']} 
                  mainClassName="relative inline-flex text-primary overflow-hidden pt-1 -mb-1 whitespace-nowrap" 
                  staggerFrom={"last"} 
                  initial={{ y: "100%", opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  exit={{ y: "-120%", opacity: 0 }} 
                  staggerDuration={0.025} 
                  splitLevelClassName="inline-flex whitespace-nowrap" 
                  transition={{ type: "spring", damping: 30, stiffness: 400 }} 
                  rotationInterval={3000} 
                />
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-10 leading-relaxed text-balance">
                Stop watching tutorials and start building. Join <CountUp from={0} to={1200} separator="," duration={2} className="font-bold text-foreground" />+ learners who built production-ready portfolios under the guidance of active industry professionals.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="xl" className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm border border-primary/20 transition-all active:scale-95 text-base h-12 px-8">
                    Start Your Application
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="#curriculum" className="w-full sm:w-auto">
                  <Button size="xl" variant="outline" className="w-full gap-2 border-primary/10 hover:bg-muted text-foreground h-12 px-8 bg-white transition-all active:scale-95">
                    View Curriculum
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" className="w-8 h-8 rounded-full border-2 border-background" alt="Student" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces" className="w-8 h-8 rounded-full border-2 border-background" alt="Student" />
                  <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=faces" className="w-8 h-8 rounded-full border-2 border-background" alt="Student" />
                </div>
                <p>Join <span className="font-semibold text-foreground"><CountUp from={0} to={1200} separator="," duration={2} />+</span> graduates hired globally.</p>
              </motion.div>
            </motion.div>

            {/* Right Column: Realistic UI Composition */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Realistic Internship Roadmap UI Card */}
              <div className="bg-white border border-primary/10 rounded-2xl shadow-xl p-6 relative z-10 max-w-md ml-auto">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-muted">
                  <div>
                    <h3 className="font-semibold text-foreground">Full-Stack Track</h3>
                    <p className="text-xs text-muted-foreground">12-Week Internship Plan</p>
                  </div>
                  <div className="bg-muted text-primary text-xs font-semibold px-2 py-1 rounded">In Progress</div>
                </div>
                
                <div className="space-y-6">
                  {/* Milestone 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <div className="w-[2px] h-10 bg-primary mt-1" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Week 1-3: Foundation</p>
                      <p className="text-xs text-muted-foreground mt-1">Database schema design and authentication setup.</p>
                    </div>
                  </div>
                  {/* Milestone 2 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-5 h-5 rounded-full border-2 border-primary bg-white flex items-center justify-center relative">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="w-[2px] h-10 bg-muted mt-1" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Week 4-7: API Development</p>
                      <p className="text-xs text-muted-foreground mt-1">Building RESTful endpoints and connecting the UI.</p>
                      <div className="mt-2 bg-muted p-2 rounded-md text-xs text-foreground flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces" className="w-4 h-4 rounded-full" alt="Mentor" />
                        <span>Code review scheduled for Friday</span>
                      </div>
                    </div>
                  </div>
                  {/* Milestone 3 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-5 h-5 rounded-full border-2 border-muted bg-white" />
                    </div>
                    <div className="opacity-50">
                      <p className="text-sm font-semibold text-foreground">Week 8-12: Deployment</p>
                      <p className="text-xs text-muted-foreground mt-1">CI/CD pipelines, AWS deployment, and final presentation.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative background accent */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent/20 rounded-full blur-[80px] -z-10" />
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

      {/* Study Items / Programs */}
      <section id="curriculum" className="py-24 md:py-32 px-5 bg-white border-y border-primary/5">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-[-0.02em]">
              Focused Career Tracks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl text-balance">
              Designed in collaboration with hiring managers. We only teach what the industry actually demands right now.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="w-full flex justify-center mt-8"
          >
            <MagicBento 
              cards={studyItems}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              glowColor="132, 0, 255"
            />
          </motion.div>
        </div>
      </section>

      {/* Team / Mentorship Section */}
      <section id="mentorship" className="py-24 md:py-32 px-5">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-[-0.02em]">
              Learn from professionals, not academics.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Our mentorship team consists of active industry practitioners who know exactly what it takes to pass a technical interview today.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-primary/5 p-6 shadow-sm flex flex-col"
              >
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover mb-4 border border-primary/10" />
                <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                <p className="text-xs font-semibold text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 md:py-32 px-5 bg-white border-y border-primary/5">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-[-0.02em]">
              Real outcomes from real students.
            </h2>
            <div className="flex items-center justify-center gap-2 text-foreground font-medium">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <span>4.9/5 Average Rating</span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-background p-8 rounded-2xl border border-primary/5 shadow-sm flex flex-col"
              >
                <p className="text-foreground/80 mb-8 leading-relaxed text-sm italic">"{t.quote}"</p>
                <div className="mt-auto flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-primary/10" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} — <span className="font-semibold text-primary">{t.company}</span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition}
            className="rounded-[32px] p-10 md:p-20 text-center border border-primary/10 bg-white shadow-lg relative overflow-hidden"
          >
            {/* Very subtle background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-[-0.02em] leading-tight">
                Ready to build your <br/> professional portfolio?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
                Applications for the next cohort are closing soon. Take the first step towards a career you love.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="xl" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-sm transition-transform active:scale-95">
                    Start Application
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="xl" variant="outline" className="h-12 px-8 text-base border-primary/10 bg-white hover:bg-muted text-foreground transition-transform active:scale-95">
                    Contact Admissions
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-5 border-t border-primary/10 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xs">
                Empowering the next generation of digital builders through structured mentorship and real-world projects.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-5 text-sm">Platform</h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Curriculum</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mentorship</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Student Outcomes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-5 text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-5 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-medium">© 2025 EIT Education. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary text-muted-foreground hover:text-white transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary text-muted-foreground hover:text-white transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
