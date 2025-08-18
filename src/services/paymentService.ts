import { supabase } from '@/integrations/supabase/client'

export interface PaymentMethod {
  id: string
  type: 'stripe_card' | 'venmo' | 'bank_account'
  name: string
  details: string
  isVerified: boolean
  isDefault: boolean
  fees: {
    percentage: number
    fixed: number
    minimum: number
  }
  metadata?: Record<string, any>
}

export interface EscrowTransaction {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  amount: number
  escrow_fee: number
  referral_pool: number
  status: 'created' | 'funded' | 'seller_revealed' | 'completed' | 'disputed' | 'refunded'
  stripe_payment_intent_id?: string
  
  created_at: string
  funded_at?: string
  completed_at?: string
}

export const paymentService = {
  /**
   * Create Stripe payment for listing fees or purchases
   */
  async createStripePayment(params: {
    amount: number
    currency?: string
    description: string
    listingId?: string
    referralId?: string
    type: 'listing_fee' | 'purchase' | 'escrow'
  }): Promise<{ url: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: Math.round(params.amount * 100), // Convert to cents
          currency: params.currency || 'usd',
          item_name: params.description,
          listing_id: params.listingId,
          referral_id: params.referralId,
          payment_type: params.type,
          successPath: params.type === 'listing_fee' 
            ? '/account?section=listings&status=success'
            : '/purchase-success',
          cancelPath: params.type === 'listing_fee'
            ? '/account?section=listings&status=canceled'
            : '/purchase-canceled'
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Stripe payment error:', error)
      throw new Error('Failed to create payment session')
    }
  },

  /**
   * Create escrow transaction for secure purchases
   */
  async createEscrowTransaction(params: {
    listingId: string
    sellerId: string
    offerAmount: number
    referralChainData?: any[]
  }): Promise<EscrowTransaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Calculate fees and referral pool
      const escrowFee = Math.round(params.offerAmount * 0.03) // 3% escrow fee
      const referralPool = Math.round(params.offerAmount * 0.20) // 20% to referral chain
      const sellerAmount = params.offerAmount - escrowFee - referralPool

      // For now, simulate escrow creation since we need the table structure
      // In production, this would create a proper escrow record
      const escrowTransaction: EscrowTransaction = {
        id: crypto.randomUUID(),
        listing_id: params.listingId,
        buyer_id: user.id,
        seller_id: params.sellerId,
        amount: params.offerAmount,
        escrow_fee: escrowFee,
        referral_pool: referralPool,
        status: 'created',
        created_at: new Date().toISOString()
      };

      return escrowTransaction
    } catch (error) {
      console.error('Escrow creation error:', error)
      throw new Error('Failed to create escrow transaction')
    }
  },

  /**
   * Fund escrow via Stripe
   */
  async fundEscrow(escrowId: string): Promise<{ url: string }> {
    try {
      // For demo purposes, assume a $500 escrow amount
      // In production, you'd fetch the actual escrow data
      return await this.createStripePayment({
        amount: 500,
        description: `Escrow payment for transaction ${escrowId}`,
        type: 'escrow'
      })
    } catch (error) {
      console.error('Escrow funding error:', error)
      throw new Error('Failed to fund escrow')
    }
  },

  /**
   * Process payout to seller or referrers
   */
  async processPayout(params: {
    userId: string
    amount: number
    paymentMethodId: string
    description: string
    escrowTransactionId?: string
  }): Promise<boolean> {
    try {
      // Get payment method details
      const { data: paymentMethod, error: pmError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', params.paymentMethodId)
        .eq('user_id', params.userId)
        .single()

      if (pmError) throw pmError

      // Calculate fees
      const fees = this.calculatePayoutFees(params.amount, paymentMethod)
      const netAmount = params.amount - fees

      // Create payout transaction with required running_balance
      const { data: transaction, error: txError } = await supabase
        .from('bacon_transactions')
        .insert({
          user_id: params.userId,
          transaction_type: 'withdrawal',
          amount: -params.amount,
          running_balance: 0, // Would be calculated from current balance
          description: params.description,
          payout_method: paymentMethod.payment_type,
          payout_reference: paymentMethod.account_details,
          payout_status: 'processing',
          metadata: {
            gross_amount: params.amount,
            fees: fees,
            net_amount: netAmount,
            escrow_transaction_id: params.escrowTransactionId
          }
        })
        .select()
        .single()

      if (txError) throw txError

      // Process actual payout based on method type
      switch (paymentMethod.payment_type) {
        case 'venmo':
          return await this.processVenmoPayout(paymentMethod, netAmount, transaction.id)
        case 'bank_account':
          return await this.processBankTransfer(paymentMethod, netAmount, transaction.id)
        default:
          throw new Error('Unsupported payment method')
      }
    } catch (error) {
      console.error('Payout processing error:', error)
      throw new Error('Failed to process payout')
    }
  },


  /**
   * Venmo payout processing (simulated)
   */
  async processVenmoPayout(paymentMethod: any, amount: number, transactionId: string): Promise<boolean> {
    try {
      // Note: Venmo doesn't have a direct payout API
      // This would typically require manual processing or third-party service
      
      // For now, mark as pending manual review
      await supabase
        .from('bacon_transactions')
        .update({
          payout_status: 'processing',
          metadata: {
            venmo_username: paymentMethod.account_details,
            amount: amount,
            requires_manual_processing: true,
            transaction_id: transactionId
          }
        })
        .eq('id', transactionId)

      // In a real implementation, this would trigger a manual payout process
      console.log(`Manual Venmo payout required: $${amount} to @${paymentMethod.account_details}`)
      
      return true
    } catch (error) {
      console.error('Venmo payout error:', error)
      return false
    }
  },

  /**
   * Bank transfer processing
   */
  async processBankTransfer(paymentMethod: any, amount: number, transactionId: string): Promise<boolean> {
    try {
      // This would integrate with ACH/bank transfer service
      // For now, mark as pending manual review
      
      await supabase
        .from('bacon_transactions')
        .update({
          payout_status: 'processing',
          metadata: {
            bank_account: paymentMethod.account_details,
            routing_number: paymentMethod.metadata?.routing_number,
            amount: amount,
            requires_manual_processing: true,
            transaction_id: transactionId
          }
        })
        .eq('id', transactionId)

      return true
    } catch (error) {
      console.error('Bank transfer error:', error)
      return false
    }
  },

  /**
   * Calculate payout fees based on payment method
   */
  calculatePayoutFees(amount: number, paymentMethod: any): number {
    const fees = {
      
      venmo: { percentage: 1.5, fixed: 0 },
      bank_account: { percentage: 0, fixed: 5 },
      stripe_card: { percentage: 2.9, fixed: 0.30 }
    }

    const methodFees = fees[paymentMethod.payment_type as keyof typeof fees] || fees.stripe_card
    const percentageFee = amount * (methodFees.percentage / 100)
    return Math.round((percentageFee + methodFees.fixed) * 100) / 100
  },

  /**
   * Distribute referral payments when purchase is completed
   */
  async distributeReferralPayments(escrowTransactionId: string): Promise<void> {
    try {
      // Simplified referral distribution for demo
      // In production, this would fetch the actual escrow and referral chain data
      console.log(`Distributing referral payments for escrow: ${escrowTransactionId}`)
    } catch (error) {
      console.error('Referral distribution error:', error)
      throw new Error('Failed to distribute referral payments')
    }
  },

  /**
   * Complete escrow transaction and release funds
   */
  async completeEscrowTransaction(escrowId: string, buyerConfirmation: boolean): Promise<void> {
    try {
      // Simplified escrow completion for demo
      if (buyerConfirmation) {
        console.log(`Completing escrow transaction: ${escrowId}`)
        await this.distributeReferralPayments(escrowId)
      } else {
        console.log(`Refunding escrow transaction: ${escrowId}`)
      }
    } catch (error) {
      console.error('Escrow completion error:', error)
      throw new Error('Failed to complete escrow transaction')
    }
  }
}