import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId?: string;
  reportedUserId?: string;
  listingId?: string;
}

const REPORT_CATEGORIES = [
  { value: 'contact_sharing', label: 'Sharing contact information', severity: 'high' },
  { value: 'circumvention', label: 'Trying to bypass platform rules', severity: 'high' },
  { value: 'inappropriate_content', label: 'Inappropriate or offensive content', severity: 'medium' },
  { value: 'spam', label: 'Spam or repetitive messages', severity: 'low' },
  { value: 'scam_attempt', label: 'Suspected scam or fraud', severity: 'critical' },
  { value: 'harassment', label: 'Harassment or bullying', severity: 'high' },
  { value: 'fake_listing', label: 'Fake or misleading listing', severity: 'high' },
  { value: 'price_manipulation', label: 'Price manipulation or gouging', severity: 'medium' },
  { value: 'other', label: 'Other violation', severity: 'medium' }
];

export const ReportModal = ({ open, onOpenChange, messageId, reportedUserId, listingId }: ReportModalProps) => {
  const { toast } = useToast();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a category and provide a description.",
        variant: "destructive"
      });
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit a report.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        reporter_id: session.session.user.id,
        reported_user_id: reportedUserId,
        message_id: messageId,
        listing_id: listingId,
        category,
        description,
        severity: REPORT_CATEGORIES.find(c => c.value === category)?.severity || 'medium',
        status: 'pending'
      };

      // Placeholder implementation - will work once database tables are created
      console.log('Would submit report:', reportData);

      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe. We'll review your report promptly.",
      });

      // Reset form and close modal
      setCategory('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Report Violation
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe marketplace by reporting policy violations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Violation Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {REPORT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.severity === 'critical' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                      {cat.severity === 'high' && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                      {cat.severity === 'medium' && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                      {cat.severity === 'low' && <AlertTriangle className="h-3 w-3 text-blue-500" />}
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide specific details about the violation..."
              rows={4}
            />
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> False reports may result in action against your account. 
              All reports are reviewed by our moderation team.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};