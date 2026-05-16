import React from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Star } from "lucide-react";
import Logo from "@/components/Logo";

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

const CertificateTemplate = ({ studentName, courseName, completionDate, certificateId }: CertificateTemplateProps) => {
  return (
    <div id="certificate-content" className="relative w-full aspect-[1.414/1] bg-white text-slate-900 overflow-hidden border-[16px] border-double border-slate-200 p-1">
      {/* Decorative Border Layer */}
      <div className="absolute inset-0 border-[2px] border-slate-400 m-2 pointer-events-none" />
      
      {/* Corner Ornaments */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-4 border-l-4 border-primary/20" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t-4 border-r-4 border-primary/20" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-4 border-l-4 border-primary/20" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-4 border-r-4 border-primary/20" />

      {/* Main Content */}
      <div className="h-full flex flex-col items-center justify-center text-center p-16 space-y-8 relative">
        {/* Logo and Header */}
        <div className="space-y-4">
          <Logo size="lg" className="mx-auto" />
          <div className="space-y-1">
            <h1 className="text-4xl font-serif tracking-widest uppercase text-slate-800">Certificate of Achievement</h1>
            <div className="h-0.5 w-64 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>
        </div>

        {/* Recipient Info */}
        <div className="space-y-4">
          <p className="text-lg font-medium text-slate-500 italic">This is to certify that</p>
          <h2 className="text-6xl font-serif font-bold text-primary">{studentName}</h2>
          <div className="h-px w-96 bg-slate-200 mx-auto" />
        </div>

        {/* Completion Info */}
        <div className="space-y-6 max-w-2xl">
          <p className="text-xl text-slate-600">
            has successfully completed all requirements for the intensive program in
          </p>
          <h3 className="text-3xl font-bold text-slate-800">{courseName}</h3>
          <p className="text-md text-slate-500 leading-relaxed">
            demonstrating exceptional dedication, technical proficiency, and mastery of industry-standard practices through hands-on modules and rigorous assessments.
          </p>
        </div>

        {/* Footer Area with Seal and Signatures */}
        <div className="w-full flex justify-between items-end mt-12 pt-8">
          <div className="text-left space-y-2">
            <div className="w-48 h-px bg-slate-300" />
            <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Dr. Anand Sharma</p>
            <p className="text-xs text-slate-500">Founder & CEO, EIT</p>
          </div>

          {/* Golden Seal */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 shadow-xl flex items-center justify-center border-4 border-amber-200">
              <div className="w-28 h-28 rounded-full border-2 border-amber-200/50 border-dashed animate-spin-slow flex items-center justify-center">
                <Award className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
              {/* Seal Ribbon */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-4 h-12 bg-amber-600/80 -rotate-12 origin-top rounded-b-sm" />
                <div className="w-4 h-12 bg-amber-600/80 rotate-12 origin-top rounded-b-sm" />
              </div>
            </div>
          </motion.div>

          <div className="text-right space-y-2">
            <div className="w-48 h-px bg-slate-300 ml-auto" />
            <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Priya Patel</p>
            <p className="text-xs text-slate-500">Head of Programs</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full flex justify-center gap-12 text-[10px] text-slate-400 font-mono">
          <span>Date: {completionDate}</span>
          <span>Certificate ID: {certificateId}</span>
          <span>Verify at: verify.eit.edu</span>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="grid grid-cols-12 gap-4 w-full h-full p-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-slate-900" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
