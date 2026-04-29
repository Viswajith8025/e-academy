import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, MoreVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "support";
  message: string;
  time: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  messages: Message[];
}

const getStatusBadge = (status: Ticket["status"]) => {
  switch (status) {
    case "open":
      return <Badge className="bg-info text-info-foreground">Open</Badge>;
    case "in-progress":
      return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>;
    case "resolved":
      return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
  }
};

const getPriorityBadge = (priority: Ticket["priority"]) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
    case "low":
      return <Badge variant="secondary">Low</Badge>;
  }
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          ticket_messages (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTickets: Ticket[] = (data || []).map((t: any) => ({
        id: t.id,
        subject: t.subject,
        category: t.category,
        status: t.status,
        priority: t.priority,
        createdAt: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        messages: (t.ticket_messages || []).map((m: any) => ({
          id: m.id,
          sender: m.sender,
          message: m.message,
          time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        })).sort((a: any, b: any) => new Date(`1970/01/01 ${a.time}`).getTime() - new Date(`1970/01/01 ${b.time}`).getTime())
      }));

      setTickets(formattedTickets);
      
      // Update selected ticket if it exists
      if (selectedTicket) {
        const updatedSelected = formattedTickets.find(t => t.id === selectedTicket.id);
        if (updatedSelected) setSelectedTicket(updatedSelected);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert([{ ticket_id: selectedTicket.id, sender: 'support', message: newMessage }]);

      if (error) throw error;

      setNewMessage("");
      fetchTickets(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUpdateStatus = async (newStatus: Ticket["status"]) => {
    if (!selectedTicket) return;
    
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', selectedTicket.id);

      if (error) throw error;
      
      fetchTickets(); // Refresh data
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const filteredTickets = tickets.filter(t => filterStatus === "all" || t.status === filterStatus);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Support Desk
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to student/employee support tickets
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Tickets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredTickets.length === 0 && (
              <div className="text-center p-8 text-muted-foreground border rounded-xl bg-card">
                No tickets found for this filter.
              </div>
            )}
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTicket(ticket)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  selectedTicket?.id === ticket.id
                    ? "border-primary bg-accent/50 shadow-md ring-1 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/50 hover:border-primary/30"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm line-clamp-1 flex-1">{ticket.subject}</h4>
                  {getStatusBadge(ticket.status)}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span>{ticket.createdAt}</span>
                  </div>
                  {getPriorityBadge(ticket.priority)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <motion.div
                key={selectedTicket.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="premium-card h-[700px] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-border bg-card/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>Ticket #{selectedTicket.id.substring(0, 8)}</span>
                        <span>•</span>
                        <span>{selectedTicket.category}</span>
                        <span>•</span>
                        <span>{selectedTicket.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Select 
                          value={selectedTicket.status} 
                          onValueChange={(val: any) => handleUpdateStatus(val)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                  {selectedTicket.messages.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                      No messages yet.
                    </div>
                  ) : (
                    selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex w-full",
                          message.sender === "support" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className="flex flex-col max-w-[75%]">
                          <span className={cn(
                            "text-[10px] mb-1 px-1",
                            message.sender === "support" ? "text-right text-primary" : "text-left text-muted-foreground"
                          )}>
                            {message.sender === "support" ? "Support Agent" : "Student/Employee"}
                          </span>
                          <div
                            className={cn(
                              "p-3 rounded-xl shadow-sm",
                              message.sender === "support"
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-card border rounded-tl-none"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            <p className={cn(
                              "text-[10px] mt-2 text-right",
                              message.sender === "support" ? "text-primary-foreground/70" : "text-muted-foreground/70"
                            )}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-background"
                      disabled={selectedTicket.status === 'closed'}
                    />
                    <Button 
                      variant="premium" 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={selectedTicket.status === 'closed' || !newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedTicket.status === 'closed' && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      This ticket is closed. Change the status to reply.
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="premium-card h-[700px] flex items-center justify-center border-dashed">
                <div className="text-center text-muted-foreground flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">No Ticket Selected</h3>
                  <p className="max-w-[250px]">Select a ticket from the list to view the conversation and respond.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTickets;
