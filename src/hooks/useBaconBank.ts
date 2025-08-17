import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BaconBalance {
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  totalWithdrawn: number;
}

interface BaconTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  payout_status: string;
  created_at: string;
}

interface WithdrawalRequest {
  amount: number;
  paymentMethodId: string;
  notes?: string;
}

export const useBaconBank = (autoLoad = true) => {
  const [balance, setBalance] = useState<BaconBalance | null>(null);
  const [transactions, setTransactions] = useState<BaconTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: transactionData, error: transactionError } = await supabase
        .from('bacon_transactions')
        .select('*')
        .eq('user_id', user.user.id);

      if (transactionError) throw transactionError;

      // Calculate balances from transactions
      const completedTransactions = transactionData?.filter(t => t.payout_status === 'completed') || [];
      const pendingTransactions = transactionData?.filter(t => t.payout_status === 'pending') || [];
      
      const availableBalance = completedTransactions
        .filter(t => t.transaction_type !== 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0) - 
        completedTransactions
        .filter(t => t.transaction_type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);

      const pendingBalance = pendingTransactions
        .filter(t => t.transaction_type !== 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);

      const lifetimeEarnings = (transactionData || [])
        .filter(t => ['earned', 'bonus'].includes(t.transaction_type))
        .reduce((sum, t) => sum + t.amount, 0);

      const totalWithdrawn = (transactionData || [])
        .filter(t => t.transaction_type === 'withdrawal' && t.payout_status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      setBalance({
        availableBalance: Math.max(0, availableBalance),
        pendingBalance: Math.max(0, pendingBalance),
        lifetimeEarnings: Math.max(0, lifetimeEarnings),
        totalWithdrawn: Math.max(0, totalWithdrawn)
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bacon_transactions')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestWithdrawal = async (request: WithdrawalRequest) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Check if user has sufficient balance
      if (!balance || balance.availableBalance < request.amount) {
        throw new Error('Insufficient balance');
      }

      // Create withdrawal transaction
      const newBalance = balance.availableBalance - request.amount;
      const { error } = await supabase
        .from('bacon_transactions')
        .insert([{
          user_id: user.user.id,
          transaction_type: 'withdrawal',
          amount: request.amount,
          running_balance: newBalance,
          description: request.notes || 'Withdrawal request',
          payout_status: 'pending',
          payout_method: request.paymentMethodId
        }]);

      if (error) throw error;

      // Refresh data
      await Promise.all([refreshBalance(), refreshTransactions()]);
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addEarnings = async (amount: number, source: string, sourceId?: string, sourceType?: string) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Calculate new running balance
      const currentBalance = balance?.availableBalance || 0;
      const newBalance = currentBalance + amount;
      
      const { error } = await supabase
        .from('bacon_transactions')
        .insert([{
          user_id: user.user.id,
          transaction_type: 'earned',
          amount: amount,
          running_balance: newBalance,
          description: source,
          source_id: sourceId,
          source_type: sourceType,
          payout_status: 'completed'
        }]);

      if (error) throw error;

      // Refresh data
      await Promise.all([refreshBalance(), refreshTransactions()]);
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateFees = (amount: number, paymentMethod: string) => {
    // Simple fee calculation based on payment method
    const feeRates = {
      'bank_account': 0.01, // 1%
      'paypal': 0.025, // 2.5%
      'crypto': 0.02, // 2%
      'venmo': 0.015 // 1.5%
    };
    
    const rate = feeRates[paymentMethod as keyof typeof feeRates] || 0.02;
    return Math.max(1, amount * rate); // Minimum $1 fee
  };

  useEffect(() => {
    if (autoLoad) {
      Promise.all([refreshBalance(), refreshTransactions()]);
    }
  }, [autoLoad]);

  return {
    balance,
    transactions,
    loading,
    error,
    refreshBalance,
    refreshTransactions,
    requestWithdrawal,
    addEarnings,
    calculateFees
  };
};