import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2, User, Search, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface ChatPartner {
  id: string;
  full_name: string;
  avatar_seed: string;
  lastMessage?: string;
  lastTime?: string;
}

const StudentMessages = () => {
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner.id);
      // Set up real-time subscription
      const channel = supabase
        .channel(`chat-${selectedPartner.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, payload => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === selectedPartner.id) || 
            (newMsg.receiver_id === selectedPartner.id)
          ) {
            setMessages(prev => [...prev, newMsg]);
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedPartner]);

  const fetchPartners = async () => {
    try {
      const sessionUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Fetch all messages where user is involved
      const { data: allMsgs, error: msgError } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at')
        .or(`sender_id.eq.${sessionUser.id},receiver_id.eq.${sessionUser.id}`)
        .order('created_at', { ascending: false });

      if (msgError) throw msgError;

      // Extract unique partners
      const partnerIds = new Set<string>();
      allMsgs?.forEach(m => {
        if (m.sender_id !== sessionUser.id) partnerIds.add(m.sender_id);
        if (m.receiver_id !== sessionUser.id) partnerIds.add(m.receiver_id);
      });

      if (partnerIds.size === 0) {
        // Fallback: If no messages, show assigned mentor if exists
        const { data: profile } = await supabase.from('profiles').select('mentor_id').eq('id', sessionUser.id).single();
        if (profile?.mentor_id) partnerIds.add(profile.mentor_id);
      }

      if (partnerIds.size > 0) {
        const { data: profiles, error: pError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_seed')
          .in('id', Array.from(partnerIds));

        if (pError) throw pError;

        setPartners(profiles.map(p => ({
          id: p.id,
          full_name: p.full_name,
          avatar_seed: p.avatar_seed
        })));
      }
    } catch (error: any) {
      toast.error("Error loading contacts: " + error.message);
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
      // Local fetch if subscription is slow
      fetchMessages(selectedPartner.id);
    } catch (error: any) {
      toast.error("Failed to send: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="h-[calc(100vh-10rem)] flex overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Sidebar - Contacts */}
        <div className="w-full md:w-80 border-r flex flex-col bg-muted/10">
          <div className="p-4 border-b bg-card/50">
            <h2 className="font-bold text-lg">Messages</h2>
            <div className="mt-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search mentors..." className="pl-9 h-9 text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
            ) : partners.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No conversations yet. Start one from the Support page!</div>
            ) : partners.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPartner(p)}
                className={cn(
                  "w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200",
                  selectedPartner?.id === p.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"
                )}
              >
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.avatar_seed}`} />
                  <AvatarFallback>{p.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-semibold text-sm truncate">{p.full_name}</div>
                  <div className={cn("text-[10px] truncate opacity-70", selectedPartner?.id === p.id ? "text-white" : "text-muted-foreground")}>
                    Online
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedPartner ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center gap-3 bg-card/50 backdrop-blur-sm">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPartner.avatar_seed}`} />
                  <AvatarFallback>{selectedPartner.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold">{selectedPartner.full_name}</div>
                  <div className="text-[10px] text-success flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    Online Mentor
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => {
                  const isMe = m.sender_id !== selectedPartner.id;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={m.id || i}
                      className={cn("flex", isMe ? "justify-end" : "justify-start")}
                    >
                      <div className={cn(
                        "max-w-[75%] p-3 rounded-2xl shadow-sm",
                        isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm border"
                      )}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                        <div className={cn("text-[10px] mt-1 opacity-50", isMe ? "text-right" : "text-left")}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer Input */}
              <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-muted/30 border-none focus-visible:ring-1 ring-primary/20"
                  />
                  <Button variant="premium" size="icon" onClick={handleSendMessage} disabled={isSending}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <MessageCircle className="h-10 w-10 opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Your Inbox</h3>
              <p className="max-w-xs mt-2">Select a mentor from the sidebar to start a conversation or view previous chats.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentMessages;
