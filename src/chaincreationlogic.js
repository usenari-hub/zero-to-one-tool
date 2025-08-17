class ReferralChainManager {
    
    // Create referral link when user shares
    async createReferralLink(listingId, userId, contactInfo = null) {
        // Check if contact already exists in a chain for this listing
        if (contactInfo) {
            const existingChain = await this.checkContactLock(listingId, contactInfo);
            
            if (existingChain && !this.isExpired(existingChain)) {
                // Add to existing chain as next degree
                return await this.addToExistingChain(existingChain.chainId, userId);
            }
        }
        
        // Create new chain or start fresh
        const chainCode = this.generateChainCode(); // "BACON-MAC-A1B2"
        const referralCode = this.generateReferralCode(userId); // "UOB-JOHN-X9Z"
        
        const chain = await this.createNewChain({
            listingId,
            chainCode,
            initialReferrerId: userId,
            referralCode
        });
        
        // Lock contact if provided
        if (contactInfo) {
            await this.createContactLock(listingId, contactInfo, chain.id);
        }
        
        return {
            chainId: chain.id,
            chainCode,
            referralCode,
            shareUrl: `${process.env.BASE_URL}/course/${listingId}?chain=${chainCode}&ref=${referralCode}`,
            degreePosition: 1,
            potentialBacon: this.calculatePotentialBacon(listingId, 1)
        };
    }
    
    // Handle clicks on referral links
    async handleReferralClick(listingId, chainCode, referralCode, clickerIP, userAgent) {
        // Track the click
        await this.trackShare({
            chainCode,
            referralCode,
            platform: 'direct_link',
            clickIP: clickerIP,
            userAgent
        });
        
        // Get chain information
        const chain = await this.getChainByCode(chainCode);
        const referrerLink = await this.getLinkByReferralCode(referralCode);
        
        // Return listing with chain context
        return {
            listing: await this.getAnonymousListing(listingId),
            chainContext: {
                chainCode,
                referralCode,
                degreePosition: referrerLink.degreePosition,
                referrerName: await this.getAnonymousReferrerName(referrerLink.referrerId),
                potentialBaconIfShare: this.calculatePotentialBacon(listingId, referrerLink.degreePosition + 1),
                potentialBaconIfBuy: this.calculateTotalChainPayout(chain.id)
            }
        };
    }
    
    // Anti-gaming: Contact fingerprinting
    createContactFingerprint(contactInfo) {
        const normalized = {
            email: contactInfo.email?.toLowerCase().trim(),
            phone: this.normalizePhoneNumber(contactInfo.phone),
            name: this.normalizeName(contactInfo.name)
        };
        
        return {
            primaryHash: this.sha256(normalized.email || normalized.phone),
            secondaryHashes: [
                this.sha256(normalized.name + normalized.email),
                this.sha256(normalized.phone + normalized.name)
            ],
            lockDuration: 72 // hours
        };
    }
    
    // Bacon distribution calculation
    calculateBaconDistribution(salePrice, rewardPercentage) {
        const totalBacon = salePrice * (rewardPercentage / 100);
        
        // Default distribution: 50%, 25%, 10%, 7.5%, 5%, 2.5%
        const degreePercentages = [50, 25, 10, 7.5, 5, 2.5];
        
        return degreePercentages.map((percentage, index) => ({
            degree: index + 1,
            percentage,
            amount: totalBacon * (percentage / 100)
        }));
    }
}
