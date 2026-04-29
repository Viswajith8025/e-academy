import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, Calendar, Mail, UserPlus, Shield, Loader2, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendNotification } from "@/lib/notifications";

interface TeacherProfile {
  id: string;
  full_name: string;
  avatar_seed: string;
  email: string;
  role: string;
}

const Support = () => {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("student");
  
  // Interaction State
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sessionUserStr = localStorage.getItem("user");
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      setUserRole(sessionUser.role || "student");
    }
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_seed, email, role')
        .eq('role', 'teacher');

      if (error) throw error;
      setTeachers(data || []);
    } catch (error: any) {
      toast.error("Error fetching teachers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTeacher || !message.trim()) return;
    setIsSubmitting(true);
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: sessionUser.id,
          receiver_id: selectedTeacher.id,
          content: message
        }]);

      if (error) throw error;

      // Notify the teacher
      await sendNotification(
        "New Message",
        `You have a new message from ${sessionUser.full_name}`,
        "info",
        selectedTeacher.id
      );

      toast.success(`Message sent to ${selectedTeacher.full_name}`);
      setIsMessageOpen(false);
      setMessage("");
    } catch (error: any) {
      toast.error("Failed to send: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedTeacher || !bookingDate) return;
    setIsSubmitting(true);
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
      const { error } = await supabase
        .from('bookings')
        .insert([{
          student_id: sessionUser.id,
          teacher_id: selectedTeacher.id,
          booking_date: bookingDate
        }]);

      if (error) throw error;

      // Notify the teacher
      await sendNotification(
        "Session Request",
        `${sessionUser.full_name} has requested a session for ${new Date(bookingDate).toLocaleString()}`,
        "info",
        selectedTeacher.id
      );

      toast.success(`Session requested with ${selectedTeacher.full_name}`);
      setIsBookingOpen(false);
      setBookingDate("");
    } catch (error: any) {
      toast.error("Booking failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole === 'teacher') {
    return (
      <DashboardLayout role="teacher">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-bold">Mentor Support</h1>
            <p className="text-muted-foreground mt-1">Resources and help for our expert mentors</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="premium-card p-6">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold">Admin Support</h3>
              <p className="text-sm text-muted-foreground mt-2">Need help with the platform? Contact our administrative team.</p>
              <Button className="mt-4 w-full" variant="outline" onClick={() => window.location.href = "mailto:support@eit.com"}>
                <Mail className="h-4 w-4 mr-2" /> Email Admin Team
              </Button>
            </div>
            <div className="premium-card p-6">
              <UserPlus className="h-10 w-10 text-success mb-4" />
              <h3 className="text-lg font-bold">Teacher Dashboard</h3>
              <p className="text-sm text-muted-foreground mt-2">View your messages and bookings from students.</p>
              <Button className="mt-4 w-full" variant="premium" onClick={() => window.location.href = '/teacher/messages'}>
                <MessageCircle className="h-4 w-4 mr-2" /> View Inbox
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold">Support & Mentors</h1>
          <p className="text-muted-foreground mt-1">Get guidance from our expert industry mentors</p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading available mentors...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-card text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No mentors are currently listed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="premium-card p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.avatar_seed}`} />
                    <AvatarFallback>{teacher.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{teacher.full_name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">Verified Mentor</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs font-medium">4.9 / 5.0</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => { setSelectedTeacher(teacher); setIsMessageOpen(true); }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" /> Message
                  </Button>
                  <Button 
                    variant="premium" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => { setSelectedTeacher(teacher); setIsBookingOpen(true); }}
                  >
                    <Calendar className="h-4 w-4 mr-1" /> Book Slot
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Message {selectedTeacher?.full_name}</DialogTitle></DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Type your question or message here..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>Cancel</Button>
            <Button variant="premium" onClick={handleSendMessage} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"} <Send className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request Session with {selectedTeacher?.full_name}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Select Date and Time</Label>
              <Input 
                type="datetime-local" 
                value={bookingDate} 
                onChange={(e) => setBookingDate(e.target.value)} 
              />
            </div>
            <p className="text-xs text-muted-foreground">The mentor will review your request and confirm the slot.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
            <Button variant="premium" onClick={handleBooking} disabled={isSubmitting}>
              {isSubmitting ? "Requesting..." : "Confirm Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Support;
