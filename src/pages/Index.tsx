import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Code,
  Database,
  Palette,
  BarChart3,
  Globe,
  Cpu,
  Star,
  CheckCircle2,
  Play,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useRef } from "react";

const teamMembers = [
  { name: "Dr. Anand Sharma", role: "Founder & CEO", bio: "15+ years in EdTech & Software Engineering", avatar: "AS" },
  { name: "Priya Patel", role: "Head of Programs", bio: "Ex-Google, Curriculum Design Expert", avatar: "PP" },
  { name: "Rahul Verma", role: "Lead Mentor", bio: "Full-Stack Developer & Tech Educator", avatar: "RV" },
  { name: "Sneha Iyer", role: "Student Success Manager", bio: "Passionate about learner outcomes", avatar: "SI" },
];

const studyItems = [
  { icon: Code, title: "Web Development", desc: "React, Node.js, TypeScript & modern frameworks", students: "180+" },
  { icon: Database, title: "Data Science", desc: "Python, ML, AI & data visualization", students: "120+" },
  { icon: Palette, title: "UI/UX Design", desc: "Figma, prototyping & design systems", students: "85+" },
  { icon: BarChart3, title: "Digital Marketing", desc: "SEO, analytics & growth strategies", students: "65+" },
  { icon: Globe, title: "Cloud Computing", desc: "AWS, Azure & DevOps practices", students: "70+" },
  { icon: Cpu, title: "Embedded Systems", desc: "IoT, Arduino & hardware programming", students: "45+" },
];

const testimonials = [
  { name: "Aisha Khan", role: "Web Dev Intern '24", quote: "EIT transformed my career. I landed a job at a top startup within 2 months of completing.", rating: 5 },
  { name: "Rohan Das", role: "Data Science Intern '24", quote: "The mentorship quality is unmatched. Every session felt like a masterclass.", rating: 5 },
  { name: "Meera Joshi", role: "UI/UX Intern '24", quote: "From zero design skills to a professional portfolio — EIT made it possible.", rating: 5 },
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: easeOut },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: easeOut },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOut } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOut } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="hidden md:flex items-center gap-6">
            {["Programs", "Team", "Reviews", "Contact"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase() === "reviews" ? "testimonials" : item.toLowerCase()}`}
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
              <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero / Banner Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated background orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 w-56 h-56 bg-primary/5 rounded-full blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              Now enrolling for 2025 batch
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Launch Your Career with{" "}
              <motion.span
                className="text-primary inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                EIT
              </motion.span>{" "}
              Internship Program
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your skills with industry-focused internships, expert mentorship, and hands-on projects. Join 500+ students already building their future.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button size="xl" variant="premium">
                    Start Your Journey
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Play className="h-4 w-4" />
                    Explore Programs
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, value: "500+", label: "Students Enrolled" },
              { icon: BookOpen, value: "50+", label: "Programs" },
              { icon: GraduationCap, value: "95%", label: "Completion Rate" },
              { icon: Award, value: "100+", label: "Certificates Issued" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                custom={index + 4}
                whileHover={{ y: -6, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.15)" }}
                className="text-center p-6 rounded-2xl bg-card border border-border shadow-card transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center"
                >
                  <stat.icon className="h-6 w-6 text-primary" />
                </motion.div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Banner / Highlight Strip */}
      <section className="py-6 bg-primary text-primary-foreground overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto"
        >
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap text-center">
            {["Industry-Ready Skills", "1-on-1 Mentorship", "Real Projects", "Certified Programs", "Placement Support"].map((item, i) => (
              <motion.div
                key={item}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-2 text-sm md:text-base font-medium"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Study Items / Programs */}
      <section id="programs" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Programs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Explore In-Demand Skills
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from industry-aligned programs designed to get you job-ready in months, not years.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {studyItems.map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={index}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="premium-card p-6 group hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg mb-5"
                >
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{item.students} students</span>
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and support for your learning journey.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Structured Learning", description: "Follow a clear path with modules, tasks, and milestones to track your progress.", icon: BookOpen },
              { title: "Expert Mentorship", description: "Get guidance from industry professionals who help you grow and learn.", icon: Users },
              { title: "Industry Certification", description: "Earn recognized certificates that boost your resume and career prospects.", icon: Award },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                custom={index}
                whileHover={{ y: -10, boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.12)" }}
                className="premium-card p-8 text-center transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg"
                >
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section id="team" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Meet the People Behind EIT
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to shaping the next generation of tech professionals.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={index}
                whileHover={{ y: -8 }}
                className="premium-card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg"
                >
                  {member.avatar}
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex items-center justify-center gap-3">
                  <motion.button whileHover={{ scale: 1.2, y: -2 }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.2, y: -2 }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              What Our Students Say
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                variants={scaleIn}
                custom={index}
                whileHover={{ y: -6, scale: 1.02 }}
                className="premium-card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-foreground mb-6 italic leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our programs? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
              className="lg:col-span-2 space-y-6"
            >
              {[
                { icon: Mail, label: "Email Us", value: "hello@eit.edu", href: "mailto:hello@eit.edu" },
                { icon: Phone, label: "Call Us", value: "+91 98765 43210", href: "tel:+919876543210" },
                { icon: MapPin, label: "Visit Us", value: "Tech Park, Bangalore, India", href: "#" },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </motion.a>
              ))}

              <div className="pt-4">
                <p className="text-sm font-medium text-foreground mb-3">Follow Us</p>
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.2, y: -2 }} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.2, y: -2 }} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
              className="lg:col-span-3"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
                  (e.target as HTMLFormElement).reset();
                }}
                className="premium-card p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required maxLength={255} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" required maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." rows={5} required maxLength={1000} className="rounded-lg" />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button type="submit" variant="premium" size="lg" className="w-full">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-12 text-center text-primary-foreground relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
            {/* Floating animated circles */}
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-6 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute bottom-8 right-16 w-32 h-32 bg-white/5 rounded-full blur-xl"
            />
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to Start Your Journey?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto"
              >
                Join hundreds of students who are already building their careers with EIT's internship programs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link to="/register">
                  <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                      Create Free Account
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      Already have an account?
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 border-t border-border bg-muted/20"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground mt-3">
                Empowering the next generation of tech professionals through hands-on internship programs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Programs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Web Development</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Data Science</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">UI/UX Design</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Cloud Computing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">About Us</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Careers</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Blog</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Help Center</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Privacy Policy</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">Terms of Service</li>
                <li className="hover:text-foreground transition-colors cursor-pointer hover-scale inline-block">FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 EIT. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.2, y: -2 }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.2, y: -2 }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
