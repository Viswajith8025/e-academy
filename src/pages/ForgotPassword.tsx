import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-accent/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Check your email
            </h1>
            <p className="text-muted-foreground mb-6">
              We've sent password reset instructions to <span className="font-medium text-foreground">{email}</span>
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to login
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Forgot password?
              </h1>
              <p className="text-muted-foreground">
                No worries, we'll send you reset instructions.
              </p>
            </div>

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
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                variant="premium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>

            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 mt-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
