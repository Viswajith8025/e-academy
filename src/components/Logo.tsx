import { GraduationCap } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
        <div className={`relative bg-gradient-to-br from-primary to-blue-400 rounded-xl ${sizeClasses[size]} flex items-center justify-center shadow-lg`}>
          <GraduationCap className="h-1/2 w-1/2 text-primary-foreground" />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} tracking-tight`}>
          <span className="text-primary">EIT</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
