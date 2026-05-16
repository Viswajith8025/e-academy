import React from "react";
import { motion } from "framer-motion";
import { Shield, MapPin, Globe, Phone, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentIDCardProps {
  student: {
    full_name: string;
    avatar_url?: string;
    program?: string;
    id_number?: string;
    email?: string;
  };
}

const StudentIDCard = ({ student }: StudentIDCardProps) => {
  return (
    <div id="student-id-card" className="relative w-[350px] h-[550px] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-800">
      {/* Top Banner / Gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-primary via-primary/80 to-blue-600" />
      
      {/* Curved Background Shape */}
      <div className="absolute top-32 left-0 right-0 h-24 bg-slate-900 rounded-t-[3rem]" />

      <div className="relative z-10 flex flex-col items-center pt-10 px-6 h-full">
        {/* Logo */}
        <div className="mb-6">
          <Logo size="sm" className="text-white brightness-0 invert" />
        </div>

        {/* Photo Container */}
        <div className="relative group mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Avatar className="relative h-40 w-40 border-4 border-slate-900 shadow-2xl">
            <AvatarImage src={student.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`} />
            <AvatarFallback className="text-4xl bg-slate-800 text-white">{student.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        {/* Name and Program */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">{student.full_name}</h2>
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            {student.program || "Student Intern"}
          </div>
        </div>

        {/* Info Grid */}
        <div className="w-full space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Student ID</p>
              <p className="text-sm font-mono text-white">{student.id_number || "PENDING"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Email Address</p>
              <p className="text-sm font-medium text-slate-300 truncate max-w-[180px]">{student.email || "hello@eit.edu"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Validation</p>
              <p className="text-sm font-medium text-slate-300">verified.eit.edu</p>
            </div>
          </div>
        </div>

        {/* Footer / QR Area Mockup */}
        <div className="mt-auto pb-6 w-full flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`h-8 w-1 bg-slate-700 ${i % 3 === 0 ? 'h-10 bg-slate-600' : ''}`} />
              ))}
            </div>
            <p className="text-[8px] text-slate-600 font-mono">EIT SYSTEM AUTH-V2</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-white uppercase italic">Elite Institute</p>
             <p className="text-[8px] text-slate-500">of Technology</p>
          </div>
        </div>
      </div>

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full" />
      </div>
    </div>
  );
};

export default StudentIDCard;
