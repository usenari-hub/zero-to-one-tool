import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Banknote,
  Target,
  Award,
  Calendar,
  BarChart3,
  Download,
  Shield,
  Zap,
  Trophy,
  Star,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  History,
  Gift,
  Calculator,
  PiggyBank
} from 'lucide-react';

// Import services
import { 
  baconBankService, 
  BaconBalance, 
  BaconTransaction, 
  PaymentMethod, 
  WithdrawalRequest 
} from '@/services/baconBankService';

interface BaconBankProps {
  userId?: string;
}

// Helper functions
const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'earned': return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'withdrawal': return <TrendingDown className="w-4 h-4 text-red-500" />;
    case 'bonus': return <Gift className="w-4 h-4 text-purple-500" />;
    case 'penalty': return <AlertCircle className="w-4 h-4 text-orange-500" />;
    default: return <Banknote className="w-4 h-4 text-blue-500" />;
  }
};

const getPaymentMethodIcon = (type: string) => {
  switch (type) {
    case 'bank_account': return '🏦';
    case 'paypal': return '📧';
    case 'venmo': return '📱';
    case 'crypto': return '₿';
    case 'gift_card': return '🎁';
    default: return '💳';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const BaconBank: React.FC<BaconBankProps> = ({ userId }) => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data state
  const [balance, setBalance] = useState<BaconBalance | null>(null);
  const [transactions, setTransactions] = useState<BaconTransaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [earningStats, setEarningStats] = useState({
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    averagePerTransaction: 0,
    topEarningSource: 'none',
    totalTransactions: 0
  });

  // Withdrawal form state
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [estimatedFees, setEstimatedFees] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const { toast } = useToast();

  // Load all data
  useEffect(() => {
    loadBankData();
  }, [userId]);

  // Calculate withdrawal fees when amount or payment method changes
  useEffect(() => {
    if (withdrawalAmount && selectedPaymentMethod) {
      const amount = parseFloat(withdrawalAmount);
      const paymentMethod = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
      
      if (amount > 0 && paymentMethod) {
        const fees = baconBankService.calculateWithdrawalFees(amount, paymentMethod);
        setEstimatedFees(fees);
        setNetAmount(amount - fees);
      } else {
        setEstimatedFees(0);
        setNetAmount(0);
      }
    }
  }, [withdrawalAmount, selectedPaymentMethod, paymentMethods]);

  const loadBankData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [balanceData, transactionData, paymentMethodData, statsData] = await Promise.all([
        baconBankService.getBalance(),
        baconBankService.getTransactions(20),
        baconBankService.getPaymentMethods(),
        baconBankService.getEarningStats()
      ]);

      setBalance(balanceData);
      setTransactions(transactionData);
      setPaymentMethods(paymentMethodData);
      setEarningStats(statsData);

    } catch (err) {
      console.error('Error loading bank data:', err);
      setError('Failed to load banking data');
      toast({
        title: "Error Loading Bank Data",
        description: "Some information may not be up to date. Please try refreshing.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBankData();
    setRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Your banking information has been updated."
    });
  };

  const handleWithdrawal = async () => {
    if (!selectedPaymentMethod || !withdrawalAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a payment method and enter an amount.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount < 5) {
      toast({
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal amount is $5.00",
        variant: "destructive"
      });
      return;
    }

    if (!balance || amount > balance.availableBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough available balance for this withdrawal.",
        variant: "destructive"
      });
      return;
    }

    setWithdrawalLoading(true);
    try {
      const withdrawalRequest: WithdrawalRequest = {
        amount,
        paymentMethodId: selectedPaymentMethod,
        estimatedFees,
        netAmount
      };

      const transaction = await baconBankService.requestWithdrawal(withdrawalRequest);
      
      // Update local state
      setTransactions(prev => [transaction, ...prev]);
      await loadBankData(); // Refresh balance

      setWithdrawalAmount('');
      setSelectedPaymentMethod('');

      toast({
        title: "🥓 Withdrawal Requested!",
        description: `Your withdrawal of $${amount.toFixed(2)} is being processed. You'll receive $${netAmount.toFixed(2)} after fees.`
      });

    } catch (err) {
      console.error('Error processing withdrawal:', err);
      toast({
        title: "Withdrawal Failed",
        description: err.message || "Failed to process withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 p-6">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-12 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error && !balance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Banking Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50">
      {/* Bank Header */}
      <div className="bg-gradient-to-r from-green-900 via-amber-900 to-orange-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <PiggyBank className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">🥓 Bacon Bank</h1>
                <p className="text-green-200">Your Academic Earnings Hub</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-600" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {balanceVisible ? `$${balance?.availableBalance?.toFixed(2) || '0.00'}` : '****'}
              </div>
              <div className="text-sm text-green-700 mt-1">
                Ready for withdrawal
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Pending Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {balanceVisible ? `$${balance?.pendingEarnings?.toFixed(2) || '0.00'}` : '****'}
              </div>
              <div className="text-sm text-amber-700 mt-1">
                Processing...
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                Lifetime Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {balanceVisible ? `$${balance?.lifetimeEarnings?.toFixed(2) || '0.00'}` : '****'}
              </div>
              <div className="text-sm text-purple-700 mt-1">
                Total earned to date
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {balanceVisible ? `$${earningStats.thisMonth.toFixed(2)}` : '****'}
              </div>
              <div className="text-sm text-blue-700 mt-1">
                Monthly earnings
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {getTransactionIcon(transaction.transaction_type)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{transaction.description}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          {transaction.payout_status && (
                            <Badge className={`text-xs ${getStatusColor(transaction.payout_status)}`}>
                              {transaction.payout_status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Earning Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Earning Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>This Week</span>
                        <span className="font-bold text-green-600">${earningStats.thisWeek.toFixed(2)}</span>
                      </div>
                      <Progress value={(earningStats.thisWeek / Math.max(earningStats.thisMonth, 1)) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>This Month</span>
                        <span className="font-bold text-blue-600">${earningStats.thisMonth.toFixed(2)}</span>
                      </div>
                      <Progress value={(earningStats.thisMonth / Math.max(earningStats.thisYear, 1)) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>This Year</span>
                        <span className="font-bold text-purple-600">${earningStats.thisYear.toFixed(2)}</span>
                      </div>
                      <Progress value={100} />
                    </div>
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Average/Transaction</div>
                          <div className="font-bold">${earningStats.averagePerTransaction.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Total Transactions</div>
                          <div className="font-bold">{earningStats.totalTransactions}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Progress Tied to Earnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  🎓 Academic Progress Through Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎓</div>
                    <div className="font-semibold">Current Degree</div>
                    <div className="text-sm text-gray-600">Determined by bacon earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="font-semibold">Academic Standing</div>
                    <div className="text-sm text-gray-600">Based on earning consistency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌟</div>
                    <div className="font-semibold">Honor Status</div>
                    <div className="text-sm text-gray-600">High-performing earners</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Withdrawal Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-green-600" />
                    Request Withdrawal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount to Withdraw</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min="5"
                      max={balance?.availableBalance || 0}
                      step="0.01"
                    />
                    <div className="text-xs text-gray-600 mt-1">
                      Available: ${balance?.availableBalance?.toFixed(2) || '0.00'} • Minimum: $5.00
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Payment Method</label>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              <span>{getPaymentMethodIcon(method.type)}</span>
                              <span>{method.name}</span>
                              <span className="text-gray-500">({method.details})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {estimatedFees > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-blue-800">Withdrawal Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Withdrawal Amount:</span>
                          <span>${parseFloat(withdrawalAmount || '0').toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Fees:</span>
                          <span>-${estimatedFees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-blue-800 border-t pt-1">
                          <span>Net Amount:</span>
                          <span>${netAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full"
                    onClick={handleWithdrawal}
                    disabled={!withdrawalAmount || !selectedPaymentMethod || withdrawalLoading}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {withdrawalLoading ? 'Processing...' : 'Request Withdrawal'}
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="text-2xl">{getPaymentMethodIcon(method.type)}</div>
                        <div className="flex-1">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.details}</div>
                          <div className="text-xs text-gray-500">
                            Fee: {method.fees.percentage}% + ${method.fees.fixed}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {method.isVerified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {method.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-blue-600" />
                    Transaction History
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="p-2 rounded-full bg-gray-100">
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.created_at).toLocaleDateString()} • 
                          {transaction.source_type && ` Source: ${transaction.source_type}`}
                        </div>
                        {transaction.metadata && (
                          <div className="text-xs text-gray-500 mt-1">
                            {JSON.stringify(transaction.metadata)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">${transaction.running_balance.toFixed(2)} balance</div>
                        {transaction.payout_status && (
                          <Badge className={`text-xs mt-1 ${getStatusColor(transaction.payout_status)}`}>
                            {transaction.payout_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Top Earning Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{earningStats.topEarningSource}</div>
                  <div className="text-sm text-gray-600">Primary income stream</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Avg per Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">${earningStats.averagePerTransaction.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Typical earning amount</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{earningStats.totalTransactions}</div>
                  <div className="text-sm text-gray-600">All time activity</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Based on your earning pattern, here are some insights to maximize your bacon income:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-semibold text-green-800 mb-2">🔥 Strengths</div>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Consistent earning pattern</li>
                        <li>• High-value transactions</li>
                        <li>• Regular withdrawal habit</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="font-semibold text-amber-800 mb-2">💡 Opportunities</div>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Explore new earning sources</li>
                        <li>• Increase sharing frequency</li>
                        <li>• Build longer referral chains</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Banking Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-withdrawal</div>
                      <div className="text-sm text-gray-600">Automatically withdraw earnings above $100</div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Earning notifications</div>
                      <div className="text-sm text-gray-600">Get notified when you earn bacon</div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Tax documents</div>
                      <div className="text-sm text-gray-600">Download 1099 forms for tax filing</div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};