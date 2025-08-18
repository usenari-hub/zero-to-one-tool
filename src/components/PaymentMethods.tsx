import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Building2, Wallet, Plus, Shield, Check, DollarSign, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { paymentService } from "@/services/paymentService";

export const PaymentMethods = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMethod, setNewMethod] = useState({
    payment_type: 'stripe_card',
    account_name: '',
    account_details: '',
    routing_number: ''
  });
  const [verifyingMethod, setVerifyingMethod] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async () => {
    try {
      // Validate required fields based on payment type
      if (newMethod.payment_type === 'bank_account' && !newMethod.routing_number) {
        toast({ title: "Error", description: "Routing number is required for bank accounts", variant: "destructive" });
        return;
      }

      // Calculate fees based on payment method type
      const fees = paymentService.calculatePayoutFees(100, { payment_type: newMethod.payment_type });
      
      const { error } = await supabase
        .from('payment_methods')
        .insert([{
          payment_type: newMethod.payment_type,
          account_name: newMethod.account_name,
          account_details: newMethod.account_details,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          is_default: paymentMethods.length === 0,
          is_verified: newMethod.payment_type === 'venmo', // Auto-verify email-based methods
          fees: {
            percentage: fees === 0 ? 0 : 2.0,
            fixed: newMethod.payment_type === 'bank_account' ? 5.0 : 0,
            minimum: 0
          },
          metadata: newMethod.payment_type === 'bank_account' ? { routing_number: newMethod.routing_number } : {}
        }]);
      
      if (error) throw error;
      
      setNewMethod({ payment_type: 'stripe_card', account_name: '', account_details: '', routing_number: '' });
      loadPaymentMethods();
      toast({ title: "Success", description: "Payment method added successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const verifyPaymentMethod = async (methodId: string) => {
    setVerifyingMethod(methodId);
    try {
      // In a real implementation, this would trigger verification process
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate verification
      
      await supabase
        .from('payment_methods')
        .update({ is_verified: true })
        .eq('id', methodId);
      
      loadPaymentMethods();
      toast({ title: "Success", description: "Payment method verified successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setVerifyingMethod(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bank_account': return Building2;
      
      case 'venmo': return DollarSign;
      case 'stripe_card': return CreditCard;
      default: return CreditCard;
    }
  };

  const getPaymentMethodDescription = (type: string) => {
    switch (type) {
      case 'stripe_card': return 'Credit/Debit Card (via Stripe)';
      
      case 'venmo': return 'Venmo Account';
      case 'bank_account': return 'Bank Account (ACH Transfer)';
      default: return type.replace('_', ' ');
    }
  };

  const getFeeDescription = (type: string) => {
    switch (type) {
      case 'stripe_card': return '2.9% + $0.30 per transaction';
      
      case 'venmo': return '1.5% per transaction (manual processing)';
      case 'bank_account': return '$5.00 flat fee per transfer';
      default: return 'Fees vary';
    }
  };

  const payoutSchedule = {
    frequency: 'Weekly',
    nextPayout: '2025-08-15',
    minimumAmount: 50
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Methods</span>
        </CardTitle>
        <CardDescription>
          Manage how you receive your bacon earnings and set payout preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payout Schedule */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Payout Schedule</span>
          </h4>
          <div className="grid gap-2 md:grid-cols-3 text-sm">
            <div>
              <span className="text-muted-foreground">Frequency:</span>
              <p className="font-medium">{payoutSchedule.frequency}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Next Payout:</span>
              <p className="font-medium">{payoutSchedule.nextPayout}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Minimum:</span>
              <p className="font-medium">${payoutSchedule.minimumAmount}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Your Payment Methods</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Method</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="method-type">Payment Type</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newMethod.payment_type}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, payment_type: e.target.value }))}
                      >
                        <option value="stripe_card">Credit/Debit Card (Stripe)</option>
                        
                        <option value="venmo">Venmo</option>
                        <option value="bank_account">Bank Account (ACH)</option>
                      </select>
                      <div className="text-xs text-muted-foreground mt-1">
                        Fee: {getFeeDescription(newMethod.payment_type)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Name</Label>
                      <Input 
                        id="account-name" 
                        placeholder="Enter account name"
                        value={newMethod.account_name}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, account_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-details">
                        {newMethod.payment_type === 'venmo' 
                          ? 'Email or Username' 
                          : newMethod.payment_type === 'stripe_card'
                          ? 'Last 4 digits (for reference)'
                          : 'Account Number'}
                      </Label>
                      <Input 
                        id="account-details" 
                        placeholder={
                          newMethod.payment_type === 'venmo' ? '@your-venmo-username' :
                          newMethod.payment_type === 'stripe_card' ? '1234 (for reference only)' :
                          'Account number'
                        }
                        value={newMethod.account_details}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, account_details: e.target.value }))}
                      />
                    </div>
                    
                    {newMethod.payment_type === 'bank_account' && (
                      <div className="space-y-2">
                        <Label htmlFor="routing-number">Routing Number</Label>
                        <Input 
                          id="routing-number" 
                          placeholder="9-digit routing number"
                          value={newMethod.routing_number}
                          onChange={(e) => setNewMethod(prev => ({ ...prev, routing_number: e.target.value }))}
                        />
                      </div>
                    )}

                    {newMethod.payment_type === 'stripe_card' && (
                      <div className="p-3 bg-blue-50 rounded-lg text-sm">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800">Stripe Card Setup</p>
                            <p className="text-blue-700">You'll be redirected to Stripe to securely add your card details after saving this method.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={addPaymentMethod}
                    disabled={!newMethod.account_name || !newMethod.account_details}
                  >
                    Add Payment Method
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center p-4">Loading payment methods...</div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">No payment methods added yet</div>
          ) : (
            paymentMethods.map((method) => {
              const IconComponent = getIcon(method.payment_type);
              return (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-full">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{method.account_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getPaymentMethodDescription(method.payment_type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {method.payment_type === 'venmo' 
                          ? method.account_details 
                          : `•••• ${method.account_details.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.is_verified ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Unverified
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => verifyPaymentMethod(method.id)}
                          disabled={verifyingMethod === method.id}
                        >
                          {verifyingMethod === method.id ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                    )}
                    {method.is_default && (
                      <Badge variant="default">Default</Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Payment Settings */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3">Payment Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-payout</p>
                <p className="text-sm text-muted-foreground">Automatically withdraw when threshold is met</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email notifications</p>
                <p className="text-sm text-muted-foreground">Get notified when payments are processed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};