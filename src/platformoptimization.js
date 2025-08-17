const viralContent = {
    facebook: {
        openGraph: {
            title: "🎓 Found an amazing [ITEM] deal at University of Bacon!",
            description: "I can earn $[AMOUNT] just by referring this to the right person. Free to join, real payouts! 🥓",
            image: generateOptimizedImage(listing, 'facebook'), // 1200x630
            type: "website"
        },
        postText: "🔥 Just discovered University of Bacon - where your network literally pays you!\n\nFound this [ITEM] and thought someone in my network might want it. If they buy it through my referral, I earn $[AMOUNT] 🥓\n\nAnyone interested or know someone who might be?"
    },
    
    twitter: {
        text: "🎓 Found a great [ITEM] deal!\n\n💰 I earn $[AMOUNT] if someone buys through my referral\n🔗 University of Bacon - where networking pays\n\n#UniversityOfBacon #EarnYourBacon #SocialCommerce",
        hashtags: ["UniversityOfBacon", "EarnYourBacon", "SocialCommerce"],
        imageAlt: "[ITEM] available through University of Bacon referral program"
    },
    
    linkedin: {
        title: "Innovative Social Commerce: Earn $[AMOUNT] Through Professional Networking",
        description: "I'm exploring University of Bacon - a platform that monetizes professional connections. Found this [ITEM] and can earn bacon by connecting it with the right buyer. Fascinating business model!",
        content: "Just discovered an interesting social commerce platform called University of Bacon. The concept: earn real money by making connections in your network.\n\nCase in point - found this [ITEM] listing. If I refer it to someone who purchases, I earn $[AMOUNT]. No MLM, no spam - just rewarding good networking.\n\nAnyone in my network interested in [ITEM_CATEGORY]?"
    },
    
    email: {
        subject: "🎓 Thought you'd be interested in this [ITEM]",
        template: `
        Hi [FRIEND_NAME],
        
        Hope you're doing well! I came across this [ITEM] and immediately thought of you.
        
        I found it through this new platform called University of Bacon - it's basically a marketplace where people earn money by making good connections. If someone purchases something through your referral, you get a percentage as "bacon" (real cash).
        
        The [ITEM]: [DESCRIPTION]
        Price Range: $[PRICE_RANGE]
        
        Even if you're not interested, I thought the platform concept was pretty clever - turning networking into actual income!
        
        Let me know what you think!
        
        Best,
        [YOUR_NAME]
        
        P.S. If you do check it out and end up purchasing, I'll earn a little bacon - but no pressure at all! 😊
        `
    }
};
