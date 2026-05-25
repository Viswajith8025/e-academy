import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";

const springTransition = { type: "spring", stiffness: 400, damping: 40 };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...springTransition, delay: i * 0.1 },
  }),
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20 selection:text-primary">
      {/* Left side - Editorial Storytelling */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-foreground items-end p-12">
        {/* High-quality realistic imagery with a subtle purple overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000" 
            alt="Students collaborating" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-color" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg"
        >
          <Logo size="lg" className="text-white mb-16 filter brightness-0 invert" />
          
          <div className="mb-8">
            <Quote className="w-10 h-10 text-primary/80 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6 tracking-[-0.02em] leading-[1.2] text-balance">
              "Joining EIT was the inflection point of my career. I stopped watching tutorials and started building real products."
            </h2>
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                alt="Sarah Jenkins" 
                className="w-12 h-12 rounded-full border border-white/20 object-cover"
              />
              <div>
                <p className="font-semibold text-white">Sarah Jenkins</p>
                <p className="text-sm text-white/60">Hired at TechFlow, 2024 Cohort</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-white/60 border-t border-white/10 pt-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Project-Based Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Industry Mentors</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Premium Form */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 xl:p-24 bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Logo size="md" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springTransition}
          className="w-full max-w-[440px] mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your details below to start your application process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12 bg-background border-primary/10 focus-visible:ring-primary/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 bg-background border-primary/10 focus-visible:ring-primary/20 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I am applying as a</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="h-12 bg-background border-primary/10 focus:ring-primary/20 transition-all rounded-xl">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10 shadow-lg">
                    <SelectItem value="student" className="py-3">Student / Intern</SelectItem>
                    <SelectItem value="teacher" className="py-3">Mentor / Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 h-12 bg-background border-primary/10 focus-visible:ring-primary/20 transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 h-12 bg-background border-primary/10 focus-visible:ring-primary/20 transition-all rounded-xl pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-medium shadow-sm active:scale-[0.98] transition-transform" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Sign in to EIT
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
