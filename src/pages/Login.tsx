import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
      // First check if email exists, then verify password
      const { data: profileByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (emailError || !profileByEmail) {
        throw new Error("No account found with this email");
      }

      // Compare passwords (trim whitespace to avoid mismatch)
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
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Logo size="lg" />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Choose your role and enter credentials
            </p>
          </div>

          <Tabs defaultValue="student" className="mb-8" onValueChange={setRole}>
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl h-12">
              <TabsTrigger 
                value="student" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md transition-all gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger 
                value="teacher"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md transition-all gap-2"
              >
                <User className="h-4 w-4" />
                Teacher
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base" 
              variant="premium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-blue-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 text-center text-white"
        >
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center mb-6 animate-float">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Start Your Learning Journey
            </h2>
            <p className="text-white/80 text-lg max-w-sm mx-auto">
              Access premium internship programs, track your progress, and connect with expert mentors.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>100+ Programs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Expert Teachers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span>Certificates</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
