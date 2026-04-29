import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2, User, Search, CheckCircle2, XCircle, Calendar, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface Booking {
  id: string;
  student_id: string;
  booking_date: string;
  status: string;
  student_name: string;
  student_avatar: string;
}

interface ChatPartner {
  id: string;
  full_name: string;
  avatar_seed: string;
}

const TeacherMessages = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner.id);
      
      const channel = supabase
        .channel(`teacher-chat-${selectedPartner.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          const newMsg = payload.new as Message;
          if ((newMsg.sender_id === selectedPartner.id) || (newMsg.receiver_id === selectedPartner.id)) {
            setMessages(prev => [...prev, newMsg]);
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedPartner]);

  const fetchData = async () => {
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
      const teacherId = sessionUser.id;

      // 1. Fetch Chat Partners (Students who messaged)
      const { data: allMsgs, error: msgError } = await supabase
        .from('messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${teacherId},receiver_id.eq.${teacherId}`)
        .order('created_at', { ascending: false });

      if (msgError) throw msgError;

      const partnerIds = new Set<string>();
      allMsgs?.forEach(m => {
        if (m.sender_id !== teacherId) partnerIds.add(m.sender_id);
        if (m.receiver_id !== teacherId) partnerIds.add(m.receiver_id);
      });

      if (partnerIds.size > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_seed')
          .in('id', Array.from(partnerIds));
        
        setPartners(profiles || []);
      }

      // 2. Fetch Bookings
      const { data: bookData, error: bookError } = await supabase
        .from('bookings')
        .select(`
          *,
          student:profiles!student_id (full_name, avatar_seed)
        `)
        .eq('teacher_id', teacherId)
        .order('booking_date', { ascending: true });

      if (bookError) throw bookError;

      setBookings((bookData || []).map((b: any) => ({
        ...b,
        student_name: b.student?.full_name || "Unknown",
        student_avatar: b.student?.avatar_seed || "default"
      })));

    } catch (error: any) {
      toast.error("Error loading data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${sessionUser.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${sessionUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast.error("Error loading messages: " + error.message);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPartner || isSending) return;
    setIsSending(true);
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: sessionUser.id,
          receiver_id: selectedPartner.id,
          content: newMessage
        }]);

      if (error) throw error;
      setNewMessage("");
      fetchMessages(selectedPartner.id);
    } catch (error: any) {
      toast.error("Failed to send: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleBookingAction = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Booking ${status}!`);
      fetchData();
    } catch (error: any) {
      toast.error("Action failed: " + error.message);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageCircle className="h-4 w-4 mr-2" />
              Direct Messages
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Session Bookings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="messages" className="flex-1 mt-0">
          <div className="h-[calc(100vh-14rem)] flex overflow-hidden rounded-2xl border bg-card shadow-sm">
            {/* Sidebar */}
            <div className="w-80 border-r flex flex-col bg-muted/5">
              <div className="p-4 border-b">
                <h3 className="font-bold">Students</h3>
                <div className="mt-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search chats..." className="pl-9 h-8 text-xs" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {partners.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPartner(p)}
                    className={cn(
                      "w-full p-3 flex items-center gap-3 rounded-xl transition-all",
                      selectedPartner?.id === p.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                  >
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.avatar_seed}`} />
                      <AvatarFallback>{p.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{p.full_name}</div>
                      <div className="text-[10px] opacity-70">Student</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col bg-background">
              {selectedPartner ? (
                <>
                  <div className="p-4 border-b flex items-center gap-3 bg-card/50">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPartner.avatar_seed}`} />
                      <AvatarFallback>{selectedPartner.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="font-bold">{selectedPartner.full_name}</div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, i) => {
                      const isMe = m.sender_id !== selectedPartner.id;
                      return (
                        <div key={m.id || i} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[70%] p-3 rounded-2xl shadow-sm",
                            isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm border"
                          )}>
                            <p className="text-sm">{m.content}</p>
                            <div className="text-[10px] mt-1 opacity-50 text-right">
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 border-t bg-card">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a response..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button variant="premium" size="icon" onClick={handleSendMessage} disabled={isSending}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-xl font-bold text-foreground">Teacher Inbox</h3>
                  <p className="max-w-xs mt-2">Select a student from the sidebar to start replying to messages.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="flex-1 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.length === 0 ? (
              <div className="col-span-full p-20 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                No session bookings found.
              </div>
            ) : bookings.map(b => (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={b.id} className="premium-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${b.student_avatar}`} />
                      <AvatarFallback>{b.student_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold">{b.student_name}</h4>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(b.booking_date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge className={
                    b.status === 'approved' ? 'bg-success' : 
                    b.status === 'rejected' ? 'bg-destructive' : 'bg-warning'
                  }>
                    {b.status}
                  </Badge>
                </div>
                {b.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-success text-success hover:bg-success hover:text-white" onClick={() => handleBookingAction(b.id, 'approved')}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={() => handleBookingAction(b.id, 'rejected')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TeacherMessages;
