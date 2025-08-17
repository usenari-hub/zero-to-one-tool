-- Core referral chains table
CREATE TABLE referral_chains (
    id UUID PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) NOT NULL,
    chain_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "BACON-MAC-A1B2"
    total_degrees INTEGER DEFAULT 1,
    max_degrees INTEGER DEFAULT 6,
    total_bacon_pool DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active', -- active, completed, expired
    purchase_completed BOOLEAN DEFAULT FALSE,
    seller_revealed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    INDEX(chain_code),
    INDEX(listing_id, status)
);

-- Individual chain links (degrees)
CREATE TABLE chain_links (
    id UUID PRIMARY KEY,
    chain_id UUID REFERENCES referral_chains(id) NOT NULL,
    referrer_id UUID REFERENCES users(id) NOT NULL,
    degree_position INTEGER NOT NULL, -- 1, 2, 3, 4, 5, 6
    referral_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., "UOB-JOHN-X9Z"
    contact_hash VARCHAR(255), -- Hashed contact info for lock protection
    bacon_percentage DECIMAL(5,2), -- 40%, 25%, 15%, etc.
    bacon_earned DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, paid
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(chain_id, degree_position),
    INDEX(referral_code),
    INDEX(referrer_id, status)
);

-- Contact locks to prevent gaming
CREATE TABLE contact_locks (
    id UUID PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) NOT NULL,
    contact_hash VARCHAR(255) NOT NULL,
    chain_id UUID REFERENCES referral_chains(id) NOT NULL,
    locked_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(listing_id, contact_hash),
    INDEX(contact_hash, locked_until)
);

-- Share tracking for analytics
CREATE TABLE share_tracking (
    id UUID PRIMARY KEY,
    chain_link_id UUID REFERENCES chain_links(id) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- facebook, twitter, email, etc.
    share_url TEXT,
    clicked_at TIMESTAMP DEFAULT NOW(),
    click_ip INET,
    click_user_agent TEXT,
    converted_to_signup BOOLEAN DEFAULT FALSE,
    converted_to_purchase BOOLEAN DEFAULT FALSE,
    INDEX(chain_link_id, platform),
    INDEX(clicked_at)
);

-- Purchase tracking through the funnel
CREATE TABLE purchase_funnel (
    id UUID PRIMARY KEY,
    listing_id UUID REFERENCES listings(id) NOT NULL,
    buyer_id UUID REFERENCES users(id) NOT NULL,
    chain_id UUID REFERENCES referral_chains(id),
    funnel_stage VARCHAR(50) NOT NULL, -- 'interest', 'escrow_setup', 'payment_confirmed', 'seller_revealed', 'completed'
    stage_data JSONB, -- Store stage-specific information
    escrow_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    INDEX(listing_id, buyer_id),
    INDEX(chain_id, funnel_stage)
);
