class AnonymousPurchaseFlow {
    
    // Entry point: User clicks referral link and wants to buy
    async handlePurchaseInterest(listingId, chainCode, referralCode, userId) {
        
        if (!userId) {
            return this.redirectToSignup({
                intent: 'purchase',
                listingId,
                chainCode,
                referralCode
            });
        }
        
        // Show anonymous purchase modal
        return this.showAnonymousPurchaseModal({
            listing: await this.getAnonymousListing(listingId),
            chainContext: await this.getChainContext(chainCode, referralCode),
            user: await this.getUser(userId)
        });
    }
    
    // Step 1: Express purchase intent (still anonymous)
    async expressPurchaseIntent(listingId, chainCode, userId, intendedPrice) {
        const intent = await this.recordPurchaseIntent({
            listingId,
            buyerId: userId,
            chainCode,
            intendedPrice,
            stage: 'interest_expressed'
        });
        
        // Move to escrow setup - still no seller contact
        return this.initiateEscrowSetup(intent.id);
    }
    
    // Step 2: Set up escrow payment
    async initiateEscrowSetup(intentId) {
        const intent = await this.getPurchaseIntent(intentId);
        
        return {
            escrowOptions: {
                paymentMethods: ['credit_card', 'paypal', 'bank_transfer', 'crypto'],
                escrowProtection: [
                    'Seller only paid after buyer confirms receipt',
                    'Full refund protection for 7 days',
                    'Dispute resolution service included',
                    'Bacon distributed automatically on completion'
                ],
                fees: {
                    escrowFee: '2.9% + $0.30',
                    disputeFee: '$25 (refunded if you win)',
                    internationalFee: '1.5% additional'
                }
            },
            nextSteps: [
                'Verify payment method',
                'Fund escrow account',
                'Seller contact revealed after payment confirmed',
                'Coordinate delivery/pickup with seller',
                'Confirm receipt to release payment'
            ]
        };
    }
    
    // Step 3: Process escrow payment
    async processEscrowPayment(intentId, paymentDetails) {
        const intent = await this.getPurchaseIntent(intentId);
        
        // Charge payment method and hold in escrow
        const escrowTransaction = await this.createEscrowHold({
            amount: intent.intendedPrice,
            paymentMethod: paymentDetails,
            buyerId: intent.buyerId,
            listingId: intent.listingId,
            chainId: intent.chainCode
        });
        
        // Update purchase stage
        await this.updatePurchaseStage(intentId, 'payment_confirmed');
        
        // NOW reveal seller contact information
        const sellerInfo = await this.revealSellerContact(intent.listingId, intent.buyerId);
        
        // Notify seller of purchase
        await this.notifySeller({
            listingId: intent.listingId,
            buyerInfo: await this.getBuyerContactInfo(intent.buyerId),
            escrowAmount: intent.intendedPrice,
            chainInfo: await this.getChainInfo(intent.chainCode)
        });
        
        return {
            success: true,
            escrowId: escrowTransaction.id,
            sellerContact: sellerInfo,
            nextSteps: 'Contact seller to arrange delivery/pickup'
        };
    }
    
    // Step 4: Reveal seller contact (ONLY after payment)
    async revealSellerContact(listingId, buyerId) {
        const purchase = await this.getPurchaseRecord(listingId, buyerId);
        
        if (purchase.stage !== 'payment_confirmed') {
            throw new Error('Seller contact can only be revealed after payment confirmation');
        }
        
        const seller = await this.getSellerInfo(listingId);
        
        // Mark seller as revealed
        await this.updatePurchaseStage(purchase.id, 'seller_revealed');
        
        // Return complete seller information
        return {
            name: seller.name,
            email: seller.email,
            phone: seller.phone,
            address: seller.address,
            profilePhoto: seller.photo,
            verificationDocuments: seller.verificationLevel,
            preferredContact: seller.preferredContactMethod,
            availability: seller.availability,
            deliveryOptions: seller.deliveryOptions
        };
    }
    
    // Step 5: Complete transaction
    async completePurchase(escrowId, buyerConfirmation) {
        const escrow = await this.getEscrowTransaction(escrowId);
        
        // Release payment to seller
        await this.releaseEscrowToSeller(escrowId);
        
        // Distribute bacon to referral chain
        await this.distributeBaconToChain(escrow.chainId, escrow.amount);
        
        // Update all records
        await this.markTransactionComplete(escrowId);
        
        return {
            success: true,
            sellerPaid: escrow.amount,
            baconDistributed: await this.getBaconDistribution(escrow.chainId),
            transactionComplete: true
        };
    }
}
