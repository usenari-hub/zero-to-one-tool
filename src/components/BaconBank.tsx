import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Gift } from "lucide-react";
import { useBaconBank } from "@/hooks/useBaconBank";
import { useToast } from "@/hooks/use-toast";

export const BaconBank = () => {
  const { toast } = useToast();
  const { 
    balance, 
    transactions, 
    loading, 
    error, 
    requestWithdrawal,
    calculateFees 
  } = useBaconBank();

  const baconBalance = balance?.availableBalance || 0;
  const pendingEarnings = balance?.pendingBalance || 0;
  const lifetimeEarnings = balance?.lifetimeEarnings || 0;

  const recentTransactions = transactions.slice(0, 4).map(t => ({
    id: t.id,
    type: t.transaction_type,
    amount: t.transaction_type === 'withdrawal' ? -t.amount : t.amount,
    source: t.description || 'Transaction',
    date: new Date(t.created_at).toLocaleDateString(),
    status: t.payout_status
  }));

  const milestones = [
    { title: 'First Referral', earned: true, reward: 25 },
    { title: '10 Successful Referrals', earned: true, reward: 100 },
    { title: '100 Bacon Earned', earned: true, reward: 50 },
    { title: '1000 Bacon Earned', earned: false, reward: 200, progress: 52 },
    { title: 'VIP Status', earned: false, reward: 500, progress: 24 },
  ];

  return (
    <div className="space-y-6">
      {/* Bacon Balance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
      <div className="flex items-center space-x-2">
        <Wallet className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Available Bacon</span>
      </div>
      <div className="text-3xl font-bold text-foreground mt-2">${baconBalance.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-5 w-5 text-accent" />
        <span className="text-sm font-medium text-muted-foreground">Pending Earnings</span>
      </div>
      <div className="text-3xl font-bold text-foreground mt-2">${pendingEarnings.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">Processing payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
      <div className="flex items-center space-x-2">
        <Gift className="h-5 w-5 text-secondary" />
        <span className="text-sm font-medium text-muted-foreground">Lifetime Earnings</span>
      </div>
      <div className="text-3xl font-bold text-foreground mt-2">${lifetimeEarnings.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">Total bacon earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Bacon Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Bacon Bank</span>
          </CardTitle>
          <CardDescription>
            Manage your bacon earnings, withdrawals, and financial milestones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'earned' ? 'bg-primary/10 text-primary' :
                      transaction.type === 'withdrawal' ? 'bg-destructive/10 text-destructive' :
                      'bg-accent/10 text-accent'
                    }`}>
                        {transaction.type === 'withdrawal' ? 
                          <ArrowDownLeft className="h-4 w-4" /> : 
                          <ArrowUpRight className="h-4 w-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{transaction.source}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-primary' : 'text-destructive'
                    }`}>
                        {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                      </p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Withdrawal Information</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Minimum withdrawal: $50.00 • Processing time: 1-3 business days
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    Available to withdraw: ${baconBalance.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={baconBalance < 50 || loading}
                    onClick={async () => {
                      try {
                        await requestWithdrawal({
                          amount: baconBalance,
                          paymentMethodId: "default-bank"
                        });
                        toast({ title: "Withdrawal Requested", description: "Your withdrawal is being processed" });
                      } catch (error) {
                        toast({ title: "Error", description: "Failed to process withdrawal", variant: "destructive" });
                      }
                    }}
                  >
                    {loading ? "Processing..." : "Withdraw to Bank Account"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    disabled={baconBalance < 50 || loading}
                    onClick={async () => {
                      try {
                        await requestWithdrawal({
                          amount: baconBalance,
                          paymentMethodId: "default-paypal"
                        });
                        toast({ title: "Withdrawal Requested", description: "Your PayPal withdrawal is being processed" });
                      } catch (error) {
                        toast({ title: "Error", description: "Failed to process withdrawal", variant: "destructive" });
                      }
                    }}
                  >
                    Withdraw to PayPal
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" disabled>
                    Convert to Store Credit
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge variant={milestone.earned ? 'default' : 'secondary'}>
                        ${milestone.reward} Bonus
                      </Badge>
                    </div>
                    {milestone.earned ? (
                      <p className="text-sm text-primary font-medium">✓ Completed</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};