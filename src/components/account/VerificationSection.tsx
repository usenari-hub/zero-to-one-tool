import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface VerificationRequest {
  id: string;
  verification_type: string;
  verification_level: string;
  status: string;
  created_at: string;
  notes?: string;
}

export const VerificationSection = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVerificationRequests();
  }, []);

  const loadVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createVerificationRequest = async (type: string, level: string, notes: string) => {
    try {
      setIsCreating(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('verification_requests')
        .insert([{
          user_id: user.user.id,
          verification_type: type,
          verification_level: level,
          status: 'pending',
          notes: notes
        }]);

      if (error) throw error;
      
      await loadVerificationRequests();
      toast({ title: "Verification request submitted", description: "We'll review your request within 24-48 hours." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Levels</CardTitle>
        <CardDescription>Building trust throughout the University of Bacon network. Level 1 enables sharing listings, Level 2 unlocks purchases and bacon redemption, Level 3 maximizes earnings and grants access to premium features.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Verification Requests */}
        {requests.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Your Verification Requests</h4>
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <div className="font-medium">{request.verification_type} - Level {request.verification_level}</div>
                    <div className="text-sm text-muted-foreground">
                      Submitted {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>
            ))}
          </div>
        )}

        {/* Verification Levels */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">Level 1: Email / Phone</div>
            <p className="text-sm text-muted-foreground mt-1">Confirm your email and phone. Required to start.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="mt-3">Verify</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Email/Phone Verification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Verify your email and phone number to establish basic trust.
                  </p>
                  <Button 
                    onClick={() => createVerificationRequest('basic', 'basic', 'Email and phone verification request')}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? "Submitting..." : "Request Basic Verification"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">Level 2: ID + Utility Bill</div>
            <p className="text-sm text-muted-foreground mt-1">Upload documents for manual review.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="mt-3">Upload Docs</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Document Verification</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const notes = formData.get('notes') as string;
                  createVerificationRequest('document', 'intermediate', notes);
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      name="notes"
                      placeholder="Describe the documents you'll be providing..."
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please prepare to upload: government-issued ID and utility bill or bank statement.
                  </p>
                  <Button type="submit" disabled={isCreating} className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    {isCreating ? "Submitting..." : "Request Document Verification"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-lg border p-4">
            <div className="text-sm font-semibold">Level 3: Trusted Seller</div>
            <p className="text-sm text-muted-foreground mt-1">Earn the badge with consistent successful history.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="mt-3">Learn More</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Trusted Seller Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Become a Trusted Seller by maintaining:
                  </p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>10+ successful transactions</li>
                    <li>4.8+ average rating</li>
                    <li>No disputes in last 6 months</li>
                    <li>Complete profile information</li>
                  </ul>
                  <Button 
                    onClick={() => createVerificationRequest('trusted_seller', 'advanced', 'Trusted seller status application')}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating ? "Submitting..." : "Apply for Trusted Status"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};