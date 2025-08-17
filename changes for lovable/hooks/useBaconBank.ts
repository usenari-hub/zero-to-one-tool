import { useState, useEffect, useCallback } from 'react';
import { 
  baconBankService, 
  BaconBalance, 
  BaconTransaction, 
  PaymentMethod, 
  WithdrawalRequest 
} from '@/services/baconBankService';

interface BaconBankState {
  balance: BaconBalance | null;
  transactions: BaconTransaction[];
  paymentMethods: PaymentMethod[];
  earningStats: {
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
    averagePerTransaction: number;
    topEarningSource: string;
    totalTransactions: number;
  };
  loading: boolean;
  error: string | null;
}

interface UseBaconBankReturn extends BaconBankState {
  refreshData: () => Promise<void>;
  requestWithdrawal: (request: WithdrawalRequest) => Promise<BaconTransaction>;
  addEarnings: (amount: number, source: string, sourceId?: string, sourceType?: string) => Promise<BaconTransaction>;
  awardBonus: (amount: number, reason: string, bonusType: string) => Promise<BaconTransaction>;
  loadTransactions: (limit?: number, offset?: number) => Promise<BaconTransaction[]>;
  calculateWithdrawalFees: (amount: number, paymentMethodId: string) => number;
}

export const useBaconBank = (autoLoad = true): UseBaconBankReturn => {
  const [state, setState] = useState<BaconBankState>({
    balance: null,
    transactions: [],
    paymentMethods: [],
    earningStats: {
      thisWeek: 0,
      thisMonth: 0,
      thisYear: 0,
      averagePerTransaction: 0,
      topEarningSource: 'none',
      totalTransactions: 0
    },
    loading: false,
    error: null
  });

  const refreshData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const [balance, transactions, paymentMethods, earningStats] = await Promise.all([
        baconBankService.getBalance(),
        baconBankService.getTransactions(50),
        baconBankService.getPaymentMethods(),
        baconBankService.getEarningStats()
      ]);

      setState(prev => ({
        ...prev,
        balance,
        transactions,
        paymentMethods,
        earningStats,
        loading: false
      }));

    } catch (error) {
      console.error('Error refreshing bacon bank data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load banking data'
      }));
    }
  }, []);

  const requestWithdrawal = useCallback(async (request: WithdrawalRequest): Promise<BaconTransaction> => {
    try {
      const transaction = await baconBankService.requestWithdrawal(request);
      
      // Update local state immediately
      setState(prev => ({
        ...prev,
        transactions: [transaction, ...prev.transactions]
      }));
      
      // Refresh balance to get updated amount
      const newBalance = await baconBankService.getBalance();
      setState(prev => ({
        ...prev,
        balance: newBalance
      }));
      
      return transaction;
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      throw error;
    }
  }, []);

  const addEarnings = useCallback(async (
    amount: number,
    source: string,
    sourceId?: string,
    sourceType?: string,
    metadata?: Record<string, any>
  ): Promise<BaconTransaction> => {
    try {
      const transaction = await baconBankService.addEarnings(
        amount, 
        source, 
        sourceId, 
        sourceType, 
        metadata
      );
      
      // Update local state immediately
      setState(prev => ({
        ...prev,
        transactions: [transaction, ...prev.transactions]
      }));
      
      // Refresh balance and stats
      const [newBalance, newStats] = await Promise.all([
        baconBankService.getBalance(),
        baconBankService.getEarningStats()
      ]);
      
      setState(prev => ({
        ...prev,
        balance: newBalance,
        earningStats: newStats
      }));
      
      return transaction;
    } catch (error) {
      console.error('Error adding earnings:', error);
      throw error;
    }
  }, []);

  const awardBonus = useCallback(async (
    amount: number,
    reason: string,
    bonusType: 'streak' | 'achievement' | 'milestone' | 'academic' | 'promotion',
    metadata?: Record<string, any>
  ): Promise<BaconTransaction> => {
    try {
      const transaction = await baconBankService.awardBonus(amount, reason, bonusType, metadata);
      
      // Update local state immediately
      setState(prev => ({
        ...prev,
        transactions: [transaction, ...prev.transactions]
      }));
      
      // Refresh balance
      const newBalance = await baconBankService.getBalance();
      setState(prev => ({
        ...prev,
        balance: newBalance
      }));
      
      return transaction;
    } catch (error) {
      console.error('Error awarding bonus:', error);
      throw error;
    }
  }, []);

  const loadTransactions = useCallback(async (
    limit = 50, 
    offset = 0
  ): Promise<BaconTransaction[]> => {
    try {
      const transactions = await baconBankService.getTransactions(limit, offset);
      
      if (offset === 0) {
        // Replace transactions if loading from start
        setState(prev => ({
          ...prev,
          transactions
        }));
      } else {
        // Append transactions if loading more
        setState(prev => ({
          ...prev,
          transactions: [...prev.transactions, ...transactions]
        }));
      }
      
      return transactions;
    } catch (error) {
      console.error('Error loading transactions:', error);
      throw error;
    }
  }, []);

  const calculateWithdrawalFees = useCallback((
    amount: number, 
    paymentMethodId: string
  ): number => {
    const paymentMethod = state.paymentMethods.find(pm => pm.id === paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }
    
    return baconBankService.calculateWithdrawalFees(amount, paymentMethod);
  }, [state.paymentMethods]);

  // Auto-load data on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      refreshData();
    }
  }, [autoLoad, refreshData]);

  return {
    ...state,
    refreshData,
    requestWithdrawal,
    addEarnings,
    awardBonus,
    loadTransactions,
    calculateWithdrawalFees
  };
};