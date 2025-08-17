import { supabase } from '@/integrations/supabase/client'

export interface BaconTransaction {
  id: string
  user_id: string
  transaction_type: 'earned' | 'withdrawal' | 'bonus' | 'penalty' | 'transfer'
  amount: number
  running_balance: number
  source_id?: string
  source_type?: string
  description: string
  metadata?: Record<string, any>
  payout_method?: string
  payout_reference?: string
  payout_status?: 'pending' | 'processing' | 'completed' | 'failed'
  processed_at?: string
  created_at: string
}

export interface BaconBalance {
  availableBalance: number
  pendingEarnings: number
  lifetimeEarnings: number
  totalWithdrawn: number
  lastTransactionDate?: string
}

export interface PaymentMethod {
  id: string
  type: 'bank_account' | 'paypal' | 'venmo' | 'crypto' | 'gift_card'
  name: string
  details: string
  isVerified: boolean
  isDefault: boolean
  fees: {
    percentage: number
    fixed: number
    minimum: number
  }
}

export interface WithdrawalRequest {
  amount: number
  paymentMethodId: string
  estimatedFees: number
  netAmount: number
}

export const baconBankService = {
  /**
   * Get user's current bacon balance
   */
  async getBalance(): Promise<BaconBalance> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get latest transaction to get current balance
      const { data: latestTransaction } = await supabase
        .from('bacon_transactions')
        .select('running_balance, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Get pending earnings
      const { data: pendingTransactions } = await supabase
        .from('bacon_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earned')
        .eq('payout_status', 'pending')

      // Get lifetime earnings
      const { data: earningsTransactions } = await supabase
        .from('bacon_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earned')

      // Get total withdrawn
      const { data: withdrawalTransactions } = await supabase
        .from('bacon_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('transaction_type', 'withdrawal')

      const availableBalance = latestTransaction?.running_balance || 0
      const pendingEarnings = pendingTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0
      const lifetimeEarnings = earningsTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0
      const totalWithdrawn = Math.abs(withdrawalTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0)

      return {
        availableBalance,
        pendingEarnings,
        lifetimeEarnings,
        totalWithdrawn,
        lastTransactionDate: latestTransaction?.created_at
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
      throw new Error('Failed to fetch balance')
    }
  },

  /**
   * Get transaction history
   */
  async getTransactions(limit = 50, offset = 0): Promise<BaconTransaction[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('bacon_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return (data || []).map(transaction => ({
        ...transaction,
        transaction_type: transaction.transaction_type as 'earned' | 'withdrawal' | 'bonus' | 'penalty' | 'transfer',
        payout_status: transaction.payout_status as 'pending' | 'processing' | 'completed' | 'failed' | undefined,
        metadata: transaction.metadata as Record<string, any> | undefined
      }))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw new Error('Failed to fetch transactions')
    }
  },

  /**
   * Create withdrawal request
   */
  async requestWithdrawal(withdrawalRequest: WithdrawalRequest): Promise<BaconTransaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Validate minimum withdrawal
      if (withdrawalRequest.amount < 5) {
        throw new Error('Minimum withdrawal amount is $5.00')
      }

      // Get current balance
      const balance = await this.getBalance()
      if (withdrawalRequest.amount > balance.availableBalance) {
        throw new Error('Insufficient funds')
      }

      // Calculate new running balance
      const newBalance = balance.availableBalance - withdrawalRequest.amount

      const { data, error } = await supabase
        .from('bacon_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'withdrawal',
          amount: -withdrawalRequest.amount,
          running_balance: newBalance,
          description: `Withdrawal to ${withdrawalRequest.paymentMethodId}`,
          payout_method: withdrawalRequest.paymentMethodId,
          payout_status: 'pending',
          metadata: {
            gross_amount: withdrawalRequest.amount,
            fees: withdrawalRequest.estimatedFees,
            net_amount: withdrawalRequest.netAmount
          }
        })
        .select()
        .single()

      if (error) throw error
      return {
        ...data,
        transaction_type: data.transaction_type as 'earned' | 'withdrawal' | 'bonus' | 'penalty' | 'transfer',
        payout_status: data.payout_status as 'pending' | 'processing' | 'completed' | 'failed',
        metadata: data.metadata as Record<string, any>
      }
    } catch (error) {
      console.error('Error requesting withdrawal:', error)
      throw new Error(error.message || 'Failed to request withdrawal')
    }
  },

  /**
   * Add bacon earnings
   */
  async addEarnings(
    amount: number,
    source: string,
    sourceId?: string,
    sourceType?: string,
    metadata?: Record<string, any>
  ): Promise<BaconTransaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get current balance
      const balance = await this.getBalance()
      const newBalance = balance.availableBalance + amount

      const { data, error } = await supabase
        .from('bacon_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'earned',
          amount: amount,
          running_balance: newBalance,
          source_id: sourceId,
          source_type: sourceType,
          description: source,
          metadata: metadata,
          payout_status: 'completed'
        })
        .select()
        .single()

      if (error) throw error
      return {
        ...data,
        transaction_type: data.transaction_type as 'earned' | 'withdrawal' | 'bonus' | 'penalty' | 'transfer',
        payout_status: data.payout_status as 'pending' | 'processing' | 'completed' | 'failed',
        metadata: data.metadata as Record<string, any>
      }
    } catch (error) {
      console.error('Error adding earnings:', error)
      throw new Error('Failed to add earnings')
    }
  },

  /**
   * Calculate withdrawal fees
   */
  calculateWithdrawalFees(amount: number, paymentMethod: PaymentMethod): number {
    const percentageFee = amount * (paymentMethod.fees.percentage / 100)
    const totalFee = percentageFee + paymentMethod.fees.fixed
    return Math.max(totalFee, paymentMethod.fees.minimum)
  },

  /**
   * Get available payment methods (mock data for now)
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // In a real implementation, this would fetch from the database
    return [
      {
        id: '1',
        type: 'bank_account',
        name: 'Chase Checking',
        details: '****1234',
        isVerified: true,
        isDefault: true,
        fees: { percentage: 0, fixed: 0, minimum: 0 }
      },
      {
        id: '2',
        type: 'paypal',
        name: 'PayPal',
        details: 'user@email.com',
        isVerified: true,
        isDefault: false,
        fees: { percentage: 2.9, fixed: 0.30, minimum: 0.30 }
      },
      {
        id: '3',
        type: 'crypto',
        name: 'Bitcoin Wallet',
        details: '1A1z...Xy9Z',
        isVerified: false,
        isDefault: false,
        fees: { percentage: 1.5, fixed: 5.00, minimum: 5.00 }
      }
    ]
  }
}