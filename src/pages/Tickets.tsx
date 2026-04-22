import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Send, MessageCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "user" | "support";
  message: string;
  time: string;
}

interface Ticket {
  id: number;
  subject: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  messages: Message[];
}

const ticketsData: Ticket[] = [
  {
    id: 1,
    subject: "Unable to access Module 3 content",
    category: "Technical",
    status: "in-progress",
    priority: "high",
    createdAt: "Jan 30, 2025",
    messages: [
      { id: 1, sender: "user", message: "I'm unable to access the Module 3 video content. It shows an error.", time: "Jan 30, 10:00 AM" },
      { id: 2, sender: "support", message: "Hi! I'm looking into this issue. Could you tell me which browser you're using?", time: "Jan 30, 10:30 AM" },
      { id: 3, sender: "user", message: "I'm using Chrome on Windows 11.", time: "Jan 30, 10:35 AM" },
    ],
  },
  {
    id: 2,
    subject: "Certificate not generated after completion",
    category: "Certificate",
    status: "resolved",
    priority: "medium",
    createdAt: "Jan 25, 2025",
    messages: [
      { id: 1, sender: "user", message: "I completed Module 2 but my certificate wasn't generated.", time: "Jan 25, 2:00 PM" },
      { id: 2, sender: "support", message: "Certificate has been generated and sent to your email!", time: "Jan 25, 3:00 PM" },
    ],
  },
  {
    id: 3,
    subject: "Query about internship extension",
    category: "General",
    status: "open",
    priority: "low",
    createdAt: "Feb 1, 2025",
    messages: [
      { id: 1, sender: "user", message: "Can I extend my internship for 1 more month?", time: "Feb 1, 9:00 AM" },
    ],
  },
];

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

const Tickets = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(ticketsData[0]);
  const [newMessage, setNewMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Support Tickets
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and track your support requests
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="premium">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="general">General Query</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe your issue in detail..." rows={4} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="premium">
                    Create Ticket
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-3">
            {ticketsData.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedTicket(ticket)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  selectedTicket?.id === ticket.id
                    ? "border-primary bg-accent shadow-md"
                    : "border-border bg-card hover:bg-muted/50"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm line-clamp-1">{ticket.subject}</h4>
                  {getStatusBadge(ticket.status)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>#{ticket.id}</span>
                  <span>•</span>
                  <span>{ticket.category}</span>
                  <span>•</span>
                  <span>{ticket.createdAt}</span>
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
                className="premium-card h-[600px] flex flex-col"
              >
                {/* Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedTicket.subject}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>Ticket #{selectedTicket.id}</span>
                        <span>•</span>
                        <span>{selectedTicket.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(selectedTicket.priority)}
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] p-3 rounded-xl",
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        )}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="premium" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="premium-card h-[600px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view the conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tickets;
