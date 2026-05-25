import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, GraduationCap, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const springTransition = { type: "spring", stiffness: 400, damping: 40 };

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear legacy sessions
    const oldUser = localStorage.getItem("user");
    if (oldUser && (oldUser.includes("student-master") || oldUser.includes("teacher-master") || oldUser.includes("admin-master"))) {
      localStorage.removeItem("user");
    }

    try {
      // 1. Check for Admin Override
      const masterAccounts: Record<string, any> = {
        "admin@eit.com": { 
          id: "00000000-0000-0000-0000-000000000001", 
          full_name: "Master Admin", 
          role: "admin",
          email: "admin@eit.com",
          avatar_seed: "admin"
        },
        "teacher@eit.com": { 
          id: "00000000-0000-0000-0000-000000000002", 
          full_name: "Master Teacher", 
          role: "teacher",
          email: "teacher@eit.com",
          avatar_seed: "teacher"
        },
        "student@eit.com": { 
          id: "00000000-0000-0000-0000-000000000003", 
          full_name: "Master Student", 
          role: "student",
          email: "student@eit.com",
          avatar_seed: "student",
          mentor: "Master Teacher"
        }
      };

      if (masterAccounts[email.toLowerCase()] && password === "12345678") {
        const user = masterAccounts[email.toLowerCase()];
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome back, ${user.full_name}!`);
        
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "teacher") navigate("/teacher-dashboard");
        else navigate("/dashboard");
        return;
      }

      // 2. Regular Authentication Check
      const { data: profileByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (emailError || !profileByEmail) {
        throw new Error("No account found with this email");
      }

      // Compare passwords
      if (profileByEmail.password !== password.trim()) {
        throw new Error("Incorrect password");
      }

      const data = profileByEmail;

      // Store user session info
      localStorage.setItem("user", JSON.stringify(data));
      
      toast.success(`Welcome back, ${data.full_name}!`);

      // 3. Role-based Redirection
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20 selection:text-primary">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 xl:p-24 bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Logo size="md" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springTransition}
          className="w-full max-w-[440px] mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access your dashboard and continue your journey.
            </p>
          </div>

          <Tabs defaultValue="student" className="mb-10" onValueChange={setRole}>
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/60 rounded-xl h-12 border border-primary/5">
              <TabsTrigger 
                value="student" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all gap-2 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger 
                value="teacher"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all gap-2 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
              >
                <User className="h-4 w-4" />
                Mentor
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-background border-primary/10 focus-visible:ring-primary/20 transition-all rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background border-primary/10 focus-visible:ring-primary/20 transition-all rounded-xl"
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

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-medium shadow-sm active:scale-[0.98] transition-transform" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Editorial Storytelling */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-foreground items-end p-12">
        {/* High-quality realistic imagery with a subtle purple overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000" 
            alt="Mentorship session" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-color" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 w-full max-w-lg mx-auto"
        >
          <Logo size="lg" className="text-white mb-16 filter brightness-0 invert" />
          
          <div className="mb-8">
            <Quote className="w-10 h-10 text-primary/80 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6 tracking-[-0.02em] leading-[1.2] text-balance">
              "The mentorship ecosystem here is unmatched. It feels less like a course and more like my first day at an elite agency."
            </h2>
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" 
                alt="David Chen" 
                className="w-12 h-12 rounded-full border border-white/20 object-cover"
              />
              <div>
                <p className="font-semibold text-white">David Chen</p>
                <p className="text-sm text-white/60">Senior Frontend Engineer</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-white/60 border-t border-white/10 pt-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>150+ Hiring Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Active Community</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
