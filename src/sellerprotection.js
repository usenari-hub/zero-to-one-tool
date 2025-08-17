class SellerAnonymityProtection {
    
    // Scrub all API responses of seller-identifying information
    sanitizeListingForPublic(listing) {
        const sanitized = {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            images: this.watermarkImages(listing.images),
            price_range: listing.price_range,
            bacon_reward: listing.bacon_reward,
            department: listing.department,
            verification_level: listing.seller.verification_level,
            location: {
                city: listing.seller.city,
                state: listing.seller.state,
                country: listing.seller.country
                // NO specific address, ZIP, or coordinates
            },
            seller_stats: {
                display_name: "Anonymous Professor",
                avatar: this.generateAnonymousAvatar(listing.seller.id),
                rating: listing.seller.average_rating,
                total_sales: listing.seller.total_sales,
                total_bacon_distributed: listing.seller.total_bacon,
                member_since: listing.seller.member_since.getFullYear(),
                verification_badges: listing.seller.verification_badges
            },
            // NEVER include:
            seller_name: undefined,
            seller_email: undefined,
            seller_phone: undefined,
            seller_address: undefined,
            seller_social_media: undefined,
            seller_website: undefined
        };
        
        return sanitized;
    }
    
    // Watermark images to prevent reverse lookup
    watermarkImages(images) {
        return images.map(image => ({
            ...image,
            url: this.addUniversityWatermark(image.url),
            exif_data: null, // Remove metadata
            reverse_search_protection: true
        }));
    }
    
    // Generate consistent anonymous avatar for each seller
    generateAnonymousAvatar(sellerId) {
        const seed = this.hashForAvatar(sellerId);
        const avatarStyles = ['👨‍🏫', '👩‍🏫', '🧑‍🏫'];
        const backgroundColors = ['#FF6B35', '#1e3a8a', '#FFD700'];
        
        return {
            emoji: avatarStyles[seed % avatarStyles.length],
            backgroundColor: backgroundColors[seed % backgroundColors.length],
            consistent: true // Same avatar every time for this seller
        };
    }
    
    // Prevent seller identity leakage through any API endpoint
    enforceAnonymityMiddleware(req, res, next) {
        const originalSend = res.send;
        
        res.send = function(data) {
            // Scan response for potential seller information leaks
            if (typeof data === 'object') {
                data = this.deepScrubSellerInfo(data);
            }
            originalSend.call(this, data);
        }.bind(this);
        
        next();
    }
}
