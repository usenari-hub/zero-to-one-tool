-- Users table with academic progression
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_photo TEXT,
    
    -- Academic Status
    academic_level VARCHAR(20) DEFAULT 'freshman', -- freshman, graduate, professor
    verification_level INTEGER DEFAULT 1, -- 1=basic, 2=enhanced, 3=premium
    trust_score DECIMAL(10,2) DEFAULT 100.0,
    bacon_balance DECIMAL(10,2) DEFAULT 0.00,
    total_bacon_earned DECIMAL(10,2) DEFAULT 0.00,
    
    -- Contact & Location
    address JSONB,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'US',
    timezone VARCHAR(50),
    
    -- Verification Data
    verification_documents JSONB,
    id_verification_status VARCHAR(20) DEFAULT 'pending',
    background_check_status VARCHAR(20),
    social_media_verified JSONB,
    
    -- Platform Stats
    successful_referrals INTEGER DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    -- Settings
    notification_preferences JSONB,
    privacy_settings JSONB,
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Indexes
    INDEX(email),
    INDEX(academic_level, verification_level),
    INDEX(city, state),
    INDEX(created_at)
);

-- Listings (Courses) table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) NOT NULL,
    
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(50) NOT NULL, -- technology, automotive, realestate, arts, services, luxury
    category VARCHAR(100),
    subcategory VARCHAR(100),
    
    -- Pricing
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    suggested_price DECIMAL(10,2),
    
    -- Bacon Rewards
    bacon_percentage DECIMAL(5,2) NOT NULL, -- 5.00 = 5%
    total_bacon_pool DECIMAL(10,2),
    max_referral_degrees INTEGER DEFAULT 6,
    degree_distribution JSONB, -- Custom or default distribution
    
    -- Media
    images JSONB, -- Array of image URLs with metadata
    videos JSONB, -- Array of video URLs
    documents JSONB, -- PDFs, receipts, certificates
    
    -- Details
    condition_rating INTEGER, -- 1-10 scale
    age_years DECIMAL(4,2),
    brand VARCHAR(100),
    model VARCHAR(100),
    specifications JSONB,
    
    -- Location & Delivery
    pickup_location JSONB,
    delivery_options JSONB,
    shipping_cost DECIMAL(10,2),
    
    -- Status & Timing
    status VARCHAR(20) DEFAULT 'active', -- active, paused, sold, expired
    expires_at TIMESTAMP,
    featured_until TIMESTAMP,
    priority_score DECIMAL(10,2) DEFAULT 0,
    
    -- Engagement Stats
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    interest_count INTEGER DEFAULT 0,
    active_chains INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX(seller_id, status),
    INDEX(department, status),
    INDEX(min_price, max_price),
    INDEX(priority_score DESC, created_at DESC),
    INDEX(expires_at),
    FULLTEXT(title, description)
);

-- Referral Chains
CREATE TABLE referral_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) NOT NULL,
    chain_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Chain Configuration
    max_degrees INTEGER DEFAULT 6,
    degree_distribution JSONB, -- Percentage for each degree
    total_bacon_pool DECIMAL(10,2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, completed, expired
    current_degree_count INTEGER DEFAULT 0,
    purchase_completed BOOLEAN DEFAULT FALSE,
    seller_revealed BOOLEAN DEFAULT FALSE,
    
    -- Timing
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Indexes
    INDEX(chain_code),
    INDEX(listing_id, status),
    INDEX(status, expires_at)
);

-- Chain Links (Individual Referrers)
CREATE TABLE chain_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chain_id UUID REFERENCES referral_chains(id) NOT NULL,
    referrer_id UUID REFERENCES users(id) NOT NULL,
    
    -- Position in Chain
    degree_position INTEGER NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    
    -- Contact Protection
    contact_hash VARCHAR(255),
    contact_lock_expires TIMESTAMP,
    
    -- Earnings
    bacon_percentage DECIMAL(5,2),
    bacon_amount DECIMAL(10,2) DEFAULT 0.00,
    bacon_paid BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, paid, expired
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints & Indexes
    UNIQUE(chain_id, degree_position),
    INDEX(referral_code),
    INDEX(referrer_id, status),
    INDEX(contact_hash, contact_lock_expires)
);

-- Purchase Tracking
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) NOT NULL,
    buyer_id UUID REFERENCES users(id) NOT NULL,
    seller_id UUID REFERENCES users(id) NOT NULL,
    chain_id UUID REFERENCES referral_chains(id),
    
    -- Purchase Details
    final_price DECIMAL(10,2) NOT NULL,
    escrow_fee DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    
    -- Status Tracking
    status VARCHAR(30) DEFAULT 'intent_expressed',
    -- Possible values: intent_expressed, escrow_setup, payment_confirmed, 
    -- seller_revealed, item_delivered, completed, disputed, refunded
    
    -- Payment Information
    payment_method VARCHAR(50),
    payment_processor VARCHAR(50),
    escrow_transaction_id VARCHAR(100),
    stripe_payment_intent_id VARCHAR(100),
    
    -- Delivery Information
    delivery_method VARCHAR(50),
    delivery_address JSONB,
    tracking_info JSONB,
    
    -- Bacon Distribution
    total_bacon_distributed DECIMAL(10,2) DEFAULT 0.00,
    platform_fee DECIMAL(10,2),
    seller_payout DECIMAL(10,2),
    
    -- Timing
    created_at TIMESTAMP DEFAULT NOW(),
    escrow_confirmed_at TIMESTAMP,
    seller_revealed_at TIMESTAMP,
    delivered_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Indexes
    INDEX(buyer_id, status),
    INDEX(seller_id, status),
    INDEX(chain_id),
    INDEX(status, created_at)
);

-- Share Tracking & Analytics
CREATE TABLE share_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chain_link_id UUID REFERENCES chain_links(id) NOT NULL,
    
    -- Share Details
    platform VARCHAR(50) NOT NULL, -- facebook, twitter, linkedin, email, etc.
    share_url TEXT,
    custom_message TEXT,
    
    -- Tracking Data
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    utm_parameters JSONB,
    
    -- Engagement
    click_count INTEGER DEFAULT 0,
    signup_conversions INTEGER DEFAULT 0,
    purchase_conversions INTEGER DEFAULT 0,
    
    -- Metadata
    shared_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX(chain_link_id, platform),
    INDEX(shared_at),
    INDEX(platform, shared_at)
);

-- Click Tracking
CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_event_id UUID REFERENCES share_events(id),
    chain_code VARCHAR(20),
    referral_code VARCHAR(20),
    
    -- Click Details
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(20),
    browser VARCHAR(50),
    
    -- Conversion Tracking
    converted_to_signup BOOLEAN DEFAULT FALSE,
    converted_to_purchase BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id), -- If they sign up
    
    -- Timing
    clicked_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX(share_event_id),
    INDEX(chain_code, clicked_at),
    INDEX(ip_address, clicked_at)
);

-- Bacon Transactions
CREATE TABLE bacon_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    
    -- Transaction Details
    transaction_type VARCHAR(30) NOT NULL, -- earned, withdrawn, bonus, penalty
    amount DECIMAL(10,2) NOT NULL,
    running_balance DECIMAL(10,2) NOT NULL,
    
    -- Source Information
    source_type VARCHAR(30), -- referral_commission, purchase_bonus, etc.
    source_id UUID, -- ID of the purchase, referral, etc.
    chain_id UUID REFERENCES referral_chains(id),
    purchase_id UUID REFERENCES purchases(id),
    
    -- Payout Information
    payout_method VARCHAR(30), -- paypal, stripe, bank_transfer, platform_credit
    payout_reference VARCHAR(100),
    payout_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    
    -- Metadata
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    
    -- Indexes
    INDEX(user_id, created_at),
    INDEX(transaction_type, created_at),
    INDEX(payout_status, created_at)
);

-- Contact Locks (Anti-Gaming)
CREATE TABLE contact_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) NOT NULL,
    contact_hash VARCHAR(255) NOT NULL,
    chain_id UUID REFERENCES referral_chains(id) NOT NULL,
    
    -- Lock Details
    lock_type VARCHAR(20) DEFAULT 'referral', -- referral, purchase_intent
    locked_until TIMESTAMP NOT NULL,
    lock_strength INTEGER DEFAULT 1, -- 1=soft, 2=medium, 3=hard
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints & Indexes
    UNIQUE(listing_id, contact_hash),
    INDEX(contact_hash, locked_until),
    INDEX(listing_id, locked_until)
);

-- Fraud Detection
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    -- Alert Details
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    risk_score DECIMAL(5,2),
    
    -- Detection Data
    detection_method VARCHAR(50),
    suspicious_activity JSONB,
    evidence JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved, false_positive
    assigned_to VARCHAR(100),
    resolution_notes TEXT,
    
    -- Related Data
    related_listing_id UUID REFERENCES listings(id),
    related_purchase_id UUID REFERENCES purchases(id),
    related_chain_id UUID REFERENCES referral_chains(id),
    
    -- Timing
    created_at TIMESTAMP DEFAULT NOW(),
    investigated_at TIMESTAMP,
    resolved_at TIMESTAMP,
    
    -- Indexes
    INDEX(user_id, severity),
    INDEX(status, created_at),
    INDEX(alert_type, severity)
);
