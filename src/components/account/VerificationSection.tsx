import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Clock, AlertCircle, Shield, Phone, Mail, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerificationStatus {
  id: string;
  user_id: string;
  email_verified: boolean;
  phone_verified: boolean;
  identity_verified: boolean;
  phone_number?: string;
  verification_status: string;
  stripe_verification_session_id?: string;
  created_at: string;
  updated_at: string;
}

export const VerificationSection = () => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeStep, setCodeStep] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setVerificationStatus(data);
    } catch (error) {
      console.error('Error loading verification status:', error);
      toast({
        title: "Error",
        description: "Failed to load verification status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startStripeVerification = async () => {
    try {
      setProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('stripe-identity-verification', {
        body: { action: 'create_session' }
      });

      if (error) throw error;

      // Open Stripe verification in new tab
      window.open(data.url, '_blank');

      toast({
        title: "Verification Started",
        description: "Complete your identity verification in the new tab",
      });

      // Check status after a delay
      setTimeout(() => {
        checkVerificationStatus(data.session_id);
      }, 5000);

    } catch (error) {
      console.error('Error starting verification:', error);
      toast({
        title: "Error",
        description: "Failed to start identity verification",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const checkVerificationStatus = async (sessionId?: string) => {
    try {
      const session_id = sessionId || verificationStatus?.stripe_verification_session_id;
      if (!session_id) return;

      const { data, error } = await supabase.functions.invoke('stripe-identity-verification', {
        body: { 
          action: 'check_status', 
          verification_session_id: session_id 
        }
      });

      if (error) throw error;

      loadVerificationStatus();

      if (data.identity_verified) {
        toast({
          title: "Verification Complete",
          description: "Your identity has been successfully verified!",
        });
      }

    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const sendPhoneVerification = async () => {
    try {
      setProcessing(true);
      
      // In a real implementation, you would send an SMS here
      // For now, we'll simulate it
      toast({
        title: "SMS Sent",
        description: "Verification code sent to your phone",
      });
      
      setCodeStep(true);
    } catch (error) {
      console.error('Error sending verification:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const verifyPhoneCode = async () => {
    try {
      setProcessing(true);
      
      // In a real implementation, you would verify the code here
      // For now, we'll simulate success
      const { error } = await supabase
        .from('user_verifications')
        .update({
          phone_verified: true,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified!",
      });

      setCodeStep(false);
      setPhoneNumber('');
      setVerificationCode('');
      loadVerificationStatus();
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getVerificationIcon = (verified: boolean) => {
    return verified ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? 
      <Badge variant="default" className="bg-green-500">Verified</Badge> : 
      <Badge variant="secondary">Not Verified</Badge>;
  };

  if (loading) {
    return <div>Loading verification status...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Verification
        </CardTitle>
        <CardDescription>
          Verify your account to unlock sharing features and increase your trustworthiness.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Verification Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Verification Status</h3>
          
          {/* Email Verification */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-muted-foreground">Required for basic features</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getVerificationIcon(verificationStatus?.email_verified || false)}
              {getVerificationBadge(verificationStatus?.email_verified || false)}
            </div>
          </div>

          {/* Phone Verification */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Phone Verification</p>
                <p className="text-sm text-muted-foreground">Required for sharing listings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getVerificationIcon(verificationStatus?.phone_verified || false)}
              {getVerificationBadge(verificationStatus?.phone_verified || false)}
              {!verificationStatus?.phone_verified && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Verify Phone</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Phone Verification</DialogTitle>
                      <DialogDescription>
                        Enter your phone number to receive a verification code.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {!codeStep ? (
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                          <Button 
                            onClick={sendPhoneVerification}
                            disabled={processing || !phoneNumber}
                            className="w-full"
                          >
                            {processing ? 'Sending...' : 'Send Code'}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="code">Verification Code</Label>
                          <Input
                            id="code"
                            type="text"
                            placeholder="123456"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                          />
                          <Button 
                            onClick={verifyPhoneCode}
                            disabled={processing || !verificationCode}
                            className="w-full"
                          >
                            {processing ? 'Verifying...' : 'Verify Code'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setCodeStep(false)}
                            className="w-full"
                          >
                            Back
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Identity Verification */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Identity Verification</p>
                <p className="text-sm text-muted-foreground">Alternative to phone verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getVerificationIcon(verificationStatus?.identity_verified || false)}
              {getVerificationBadge(verificationStatus?.identity_verified || false)}
              {!verificationStatus?.identity_verified && (
                <Button 
                  onClick={startStripeVerification}
                  disabled={processing}
                  variant="outline" 
                  size="sm"
                >
                  {processing ? 'Starting...' : 'Verify Identity'}
                </Button>
              )}
              {verificationStatus?.stripe_verification_session_id && !verificationStatus?.identity_verified && (
                <Button 
                  onClick={() => checkVerificationStatus()}
                  variant="outline" 
                  size="sm"
                >
                  Check Status
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sharing Eligibility */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            <p className="font-medium">Sharing Eligibility</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {verificationStatus?.email_verified && (verificationStatus?.phone_verified || verificationStatus?.identity_verified) ? 
              "✅ You can share listings and earn rewards!" : 
              "❌ Email verification + (phone OR identity) verification required to share listings"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};