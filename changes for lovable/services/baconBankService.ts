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
        .single()

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
      return data || []
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

      // TODO: Integrate with actual payment processor
      // For now, we'll simulate the withdrawal process
      await this.processWithdrawalSimulation(data.id)

      return data
    } catch (error) {
      console.error('Error requesting withdrawal:', error)
      throw new Error(error.message || 'Failed to request withdrawal')
    }
  },

  /**
   * Simulate withdrawal processing (replace with real payment processor)
   */
  async processWithdrawalSimulation(transactionId: string): Promise<void> {
    try {
      // Simulate processing delay
      setTimeout(async () => {
        await supabase
          .from('bacon_transactions')
          .update({
            payout_status: 'processing',
            processed_at: new Date().toISOString()
          })
          .eq('id', transactionId)

        // Simulate completion after another delay
        setTimeout(async () => {
          await supabase
            .from('bacon_transactions')
            .update({
              payout_status: 'completed'
            })
            .eq('id', transactionId)
        }, 5000)
      }, 2000)
    } catch (error) {
      console.error('Error processing withdrawal simulation:', error)
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

      // Update academic progress
      await this.updateAcademicProgress(user.id, amount)

      return data
    } catch (error) {
      console.error('Error adding earnings:', error)
      throw new Error('Failed to add earnings')
    }
  },

  /**
   * Award bonus bacon
   */
  async awardBonus(
    amount: number,
    reason: string,
    bonusType: 'streak' | 'achievement' | 'milestone' | 'academic' | 'promotion',
    metadata?: Record<string, any>
  ): Promise<BaconTransaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const balance = await this.getBalance()
      const newBalance = balance.availableBalance + amount

      const { data, error } = await supabase
        .from('bacon_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'bonus',
          amount: amount,
          running_balance: newBalance,
          description: reason,
          metadata: {
            bonus_type: bonusType,
            ...metadata
          },
          payout_status: 'completed'
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error awarding bonus:', error)
      throw new Error('Failed to award bonus')
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
  },

  /**
   * Get earning statistics
   */
  async getEarningStats(): Promise<{
    thisWeek: number
    thisMonth: number
    thisYear: number
    averagePerTransaction: number
    topEarningSource: string
    totalTransactions: number
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

      const [weeklyResult, monthlyResult, yearlyResult, allEarningsResult] = await Promise.all([
        supabase
          .from('bacon_transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('transaction_type', 'earned')
          .gte('created_at', oneWeekAgo.toISOString()),

        supabase
          .from('bacon_transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('transaction_type', 'earned')
          .gte('created_at', oneMonthAgo.toISOString()),

        supabase
          .from('bacon_transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('transaction_type', 'earned')
          .gte('created_at', oneYearAgo.toISOString()),

        supabase
          .from('bacon_transactions')
          .select('amount, source_type')
          .eq('user_id', user.id)
          .eq('transaction_type', 'earned')
      ])

      const thisWeek = weeklyResult.data?.reduce((sum, t) => sum + t.amount, 0) || 0
      const thisMonth = monthlyResult.data?.reduce((sum, t) => sum + t.amount, 0) || 0
      const thisYear = yearlyResult.data?.reduce((sum, t) => sum + t.amount, 0) || 0
      
      const allEarnings = allEarningsResult.data || []
      const totalTransactions = allEarnings.length
      const averagePerTransaction = totalTransactions > 0 ? thisYear / totalTransactions : 0

      // Calculate top earning source
      const sourceCounts: Record<string, number> = {}
      allEarnings.forEach(t => {
        const source = t.source_type || 'other'
        sourceCounts[source] = (sourceCounts[source] || 0) + t.amount
      })
      
      const topEarningSource = Object.keys(sourceCounts).length > 0 
        ? Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b)
        : 'none'

      return {
        thisWeek,
        thisMonth,
        thisYear,
        averagePerTransaction,
        topEarningSource,
        totalTransactions
      }
    } catch (error) {
      console.error('Error fetching earning stats:', error)
      return {
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0,
        averagePerTransaction: 0,
        topEarningSource: 'none',
        totalTransactions: 0
      }
    }
  },

  /**
   * Update academic progress based on earnings
   */
  async updateAcademicProgress(userId: string, newEarnings: number): Promise<void> {
    try {
      // Update degree progression with new earnings
      const { data: progression } = await supabase
        .from('degree_progression')
        .select('total_bacon_earned, current_degree')
        .eq('user_id', userId)
        .single()

      if (progression) {
        const newTotal = progression.total_bacon_earned + newEarnings

        // Check if user should advance degree level
        let newDegree = progression.current_degree
        if (newTotal >= 100000 && progression.current_degree !== 'dean') {
          newDegree = 'dean'
        } else if (newTotal >= 50000 && !['professor', 'dean'].includes(progression.current_degree)) {
          newDegree = 'professor'
        } else if (newTotal >= 20000 && !['graduate', 'professor', 'dean'].includes(progression.current_degree)) {
          newDegree = 'graduate'
        } else if (newTotal >= 5000 && !['senior', 'graduate', 'professor', 'dean'].includes(progression.current_degree)) {
          newDegree = 'senior'
        } else if (newTotal >= 2000 && !['junior', 'senior', 'graduate', 'professor', 'dean'].includes(progression.current_degree)) {
          newDegree = 'junior'
        } else if (newTotal >= 500 && progression.current_degree === 'freshman') {
          newDegree = 'sophomore'
        }

        await supabase
          .from('degree_progression')
          .update({
            total_bacon_earned: newTotal,
            current_degree: newDegree,
            last_activity_date: new Date().toISOString()
          })
          .eq('user_id', userId)

        // Award achievement if degree advanced
        if (newDegree !== progression.current_degree) {
          await this.awardDegreeAdvancementBonus(userId, newDegree)
        }
      }
    } catch (error) {
      console.error('Error updating academic progress:', error)
    }
  },

  /**
   * Award bonus for degree advancement
   */
  async awardDegreeAdvancementBonus(userId: string, newDegree: string): Promise<void> {
    try {
      const bonusAmounts: Record<string, number> = {
        sophomore: 50,
        junior: 100,
        senior: 200,
        graduate: 500,
        professor: 1000,
        dean: 2500
      }

      const bonusAmount = bonusAmounts[newDegree]
      if (!bonusAmount) return

      const balance = await this.getBalance()
      const newBalance = balance.availableBalance + bonusAmount

      await supabase
        .from('bacon_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'bonus',
          amount: bonusAmount,
          running_balance: newBalance,
          description: `Academic advancement bonus - ${newDegree} level achieved`,
          metadata: {
            bonus_type: 'academic',
            degree_level: newDegree
          },
          payout_status: 'completed'
        })

    } catch (error) {
      console.error('Error awarding degree advancement bonus:', error)
    }
  },

  /**
   * Check for and award streak bonuses
   */
  async checkStreakBonuses(userId: string): Promise<void> {
    try {
      // Get sharing momentum
      const { data: momentum } = await supabase
        .from('sharing_momentum')
        .select('current_streak_days, bonus_multiplier')
        .eq('user_id', userId)
        .single()

      if (!momentum) return

      // Award weekly streak bonuses
      if (momentum.current_streak_days % 7 === 0 && momentum.current_streak_days > 0) {
        const bonusAmount = 25 * (momentum.current_streak_days / 7)
        
        await this.awardBonus(
          bonusAmount,
          `${momentum.current_streak_days}-day sharing streak bonus`,
          'streak',
          { streak_days: momentum.current_streak_days }
        )
      }

    } catch (error) {
      console.error('Error checking streak bonuses:', error)
    }
  }
}