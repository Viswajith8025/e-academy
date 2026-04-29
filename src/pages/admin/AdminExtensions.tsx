import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Loader2, Calendar, User, Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/badge"; // Wait, I need Button from ui/button
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button as UIButton } from "@/components/ui/button";

interface ExtensionRequest {
  id: string;
  user_id: string;
  current_end_date: string;
  requested_duration: string;
  type: string;
  reason: string;
  status: string;
  created_at: string;
  student_name?: string;
  student_email?: string;
}

const AdminExtensions = () => {
  const [requests, setRequests] = useState<ExtensionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('extension_requests')
        .select(`
          *,
          student:profiles!user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map((req: any) => ({
        ...req,
        student_name: req.student?.full_name || "Unknown",
        student_email: req.student?.email || "N/A"
      }));

      setRequests(formattedData);
    } catch (error: any) {
      toast.error("Error fetching requests: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('extension_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Request ${status} successfully`);
      fetchRequests();
    } catch (error: any) {
      toast.error("Action failed: " + error.message);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.student_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Extension Requests</h1>
            <p className="text-muted-foreground mt-1">Review and manage internship extensions</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search students..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-4 font-semibold text-sm">Student</th>
                  <th className="p-4 font-semibold text-sm">Type</th>
                  <th className="p-4 font-semibold text-sm">Requested</th>
                  <th className="p-4 font-semibold text-sm">End Date</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      Loading requests...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-muted-foreground">
                      No extension requests found.
                    </td>
                  </tr>
                ) : filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{req.student_name}</div>
                      <div className="text-xs text-muted-foreground">{req.student_email}</div>
                    </td>
                    <td className="p-4 capitalize">
                      <Badge variant={req.type === 'free' ? 'secondary' : 'default'} className={req.type === 'paid' ? 'bg-primary' : ''}>
                        {req.type}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">{req.requested_duration}</td>
                    <td className="p-4 text-sm">{new Date(req.current_end_date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Badge className={
                        req.status === 'approved' ? 'bg-success' : 
                        req.status === 'rejected' ? 'bg-destructive' : 'bg-warning'
                      }>
                        {req.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <UIButton size="sm" variant="outline" className="h-8 text-success border-success" onClick={() => handleAction(req.id, 'approved')}>
                            <CheckCircle2 className="h-4 w-4" />
                          </UIButton>
                          <UIButton size="sm" variant="outline" className="h-8 text-destructive border-destructive" onClick={() => handleAction(req.id, 'rejected')}>
                            <XCircle className="h-4 w-4" />
                          </UIButton>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminExtensions;
