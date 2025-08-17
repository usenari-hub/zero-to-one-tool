class ChainIntegritySystem {
    
    // Prevent contact from being used in multiple chains
    async enforceContactLocking(listingId, contactInfo, newReferrerId) {
        const fingerprint = this.createContactFingerprint(contactInfo);
        
        // Check for active locks
        const activeLock = await this.findActiveContactLock(listingId, fingerprint);
        
        if (activeLock) {
            if (activeLock.chainId && !this.isExpired(activeLock)) {
                // Contact is locked to existing chain - add as next degree
                return await this.addToExistingChain(activeLock.chainId, newReferrerId);
            } else {
                throw new Error(`Contact is already being referred in another active chain. Lock expires: ${activeLock.expiresAt}`);
            }
        }
        
        // Create new chain with contact lock
        const newChain = await this.createNewChainWithLock(listingId, newReferrerId, fingerprint);
        
        return newChain;
    }
    
    // Contact fingerprinting for lock system
    createContactFingerprint(contactInfo) {
        // Normalize all contact information
        const normalized = {
            email: contactInfo.email?.toLowerCase().replace(/\./g, '').trim(),
            phone: this.normalizePhoneNumber(contactInfo.phone),
            name: this.normalizeName(contactInfo.name)
        };
        
        // Create multiple hashes for fuzzy matching
        const hashes = [
            this.sha256(normalized.email || ''),
            this.sha256(normalized.phone || ''),
            this.sha256(normalized.name || ''),
            this.sha256((normalized.email || '') + (normalized.name || '')),
            this.sha256((normalized.phone || '') + (normalized.name || ''))
        ].filter(hash => hash !== this.sha256(''));
        
        return {
            primaryHash: hashes[0],
            allHashes: hashes,
            lockDuration: 72 // hours
        };
    }
    
    // Detect and prevent gaming attempts
    async detectGamingAttempts(userId, listingId, action) {
        const suspiciousPatterns = await this.checkForPatterns(userId, {
            rapidMultipleReferrals: await this.countRecentReferrals(userId, '1 hour') > 10,
            sameDeviceMultipleAccounts: await this.checkDeviceFingerprint(userId),
            artificialChainBuilding: await this.detectFakeChains(userId),
            contactManipulation: await this.detectContactVariations(userId, listingId)
        });
        
        if (suspiciousPatterns.riskScore > 0.7) {
            await this.flagForReview(userId, suspiciousPatterns);
            throw new Error('Account flagged for suspicious activity');
        }
        
        return suspiciousPatterns;
    }
}
