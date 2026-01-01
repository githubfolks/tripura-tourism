CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),

    user_type VARCHAR(50) NOT NULL,
    -- PORTAL_ADMIN | PORTAL_STAFF | PARTNER_ADMIN | PARTNER_USER

    partner_id UUID NULL REFERENCES api_partners(id),

    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    password_hash TEXT NOT NULL,
    password_algo VARCHAR(50) DEFAULT 'bcrypt',

    last_login TIMESTAMP,
    password_updated_at TIMESTAMP,

    is_locked BOOLEAN DEFAULT FALSE
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(120) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE asset_manager_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    asset_type VARCHAR(50) NOT NULL, 
    -- DESTINATION | EXPERIENCE | PACKAGE
    
    asset_id UUID NOT NULL, 
    -- ID of the destination/experience/package
    
    assigned_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),

    refresh_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,

    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),

    action VARCHAR(150),
    resource_type VARCHAR(100),
    resource_id UUID,

    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    district VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    best_time_to_visit VARCHAR(100),
    how_to_reach TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE destination_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(200),
    sort_order INT DEFAULT 0
);

CREATE TABLE accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    
    name VARCHAR(150) NOT NULL, -- e.g. Deluxe Room, Camping Tent
    description TEXT,
    
    type VARCHAR(50), 
    -- ROOM | TENT | COTTAGE | DORMITORY
    
    base_price NUMERIC(10,2) NOT NULL,
    base_occupancy INT DEFAULT 2,          -- Number of pax included in base_price
    extra_boarder_price NUMERIC(10,2) DEFAULT 0, -- Cost per extra person
    max_occupancy INT DEFAULT 3,           -- Total capacity (base + extra)
    total_units INT DEFAULT 1,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accommodation_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accommodation_id UUID REFERENCES accommodations(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    available_units INT NOT NULL,
    
    price_override NUMERIC(10,2), -- Optional override for peak days
    is_blocked BOOLEAN DEFAULT FALSE,
    
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(accommodation_id, date)
);
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(160) UNIQUE NOT NULL,
    description TEXT,
    experience_type VARCHAR(50), -- Adventure, Culture, Nature, Spiritual
    duration_hours INT,
    difficulty_level VARCHAR(50), -- Easy, Moderate, Hard
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE experience_destinations (
    experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    PRIMARY KEY (experience_id, destination_id)
);
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(210) UNIQUE NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    price_inr NUMERIC(10,2),
    package_type VARCHAR(50), -- Budget, Luxury, Family, Adventure
    inclusions TEXT,
    exclusions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE package_destinations (
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    day_number INT,
    PRIMARY KEY (package_id, destination_id)
);
CREATE TABLE package_experiences (
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
    PRIMARY KEY (package_id, experience_id)
);
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    category VARCHAR(50), -- Transport, Stay, Meals, Safety, Guide
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE package_amenities (
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (package_id, amenity_id)
);
CREATE TABLE api_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    domain VARCHAR(200),
    contact_email VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE api_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES api_partners(id) ON DELETE CASCADE,
    client_id VARCHAR(120) UNIQUE NOT NULL,
    client_secret TEXT NOT NULL,
    scopes TEXT[],
    rate_limit_per_min INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE api_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID,
    endpoint TEXT,
    request_ip INET,
    status_code INT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TYPE payment_status_enum AS ENUM (
    'PENDING',
    'PAID',
    'PARTIAL',
    'FAILED',
    'REFUNDED'
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    booking_reference VARCHAR(20) UNIQUE NOT NULL, -- TRP-2025-000123
    source VARCHAR(50) NOT NULL, 
    -- PORTAL | MAKEMYTRIP | GOIBIBO | API

    partner_id UUID NULL REFERENCES api_partners(id),
    
    package_id UUID REFERENCES packages(id),
    
    booking_status VARCHAR(30) NOT NULL,
    -- PENDING | CONFIRMED | CANCELLED | COMPLETED | FAILED | ON_HOLD

    travel_start_date DATE NOT NULL,
    travel_end_date DATE NOT NULL,

    pax_adults INT NOT NULL,
    pax_children INT DEFAULT 0,

    total_amount NUMERIC(12,2) NOT NULL,
    amount_paid NUMERIC(12,2) DEFAULT 0,
    payment_status payment_status_enum DEFAULT 'PENDING',
    currency VARCHAR(10) DEFAULT 'INR',

    booked_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    is_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT,

    created_by UUID REFERENCES users(id), -- User who created the booking (Admin/Asset Manager)
    booking_channel VARCHAR(50) DEFAULT 'ONLINE' 
    -- ONLINE | WALK_IN | AGENT_DESK
);
CREATE TYPE booking_status_enum AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'FAILED',
    'ON_HOLD'
);
CREATE TABLE booking_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,

    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),

    id_type VARCHAR(50), -- Aadhaar, Passport
    id_number VARCHAR(50),
    id_proof_url TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,

    item_type VARCHAR(50), -- PACKAGE | EXPERIENCE | ACCOMMODATION
    item_id UUID,
    
    item_name VARCHAR(200),
    quantity INT DEFAULT 1,
    price NUMERIC(10,2)
);
CREATE TABLE booking_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,

    payment_gateway VARCHAR(50), -- Razorpay, PayGov, Cash
    transaction_id VARCHAR(100),

    amount NUMERIC(12,2),
    payment_status VARCHAR(30),
    -- INITIATED | SUCCESS | FAILED | REFUNDED

    paid_at TIMESTAMP
);
CREATE TABLE booking_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    booking_id UUID REFERENCES bookings(id),
    partner_id UUID REFERENCES api_partners(id),

    action VARCHAR(50),
    -- MODIFY | CANCEL | FORCE_CONFIRM | DATE_CHANGE

    previous_status VARCHAR(30),
    new_status VARCHAR(30),

    reason TEXT,
    performed_by VARCHAR(150), -- email / system
    performed_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE booking_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),

    action VARCHAR(100),
    actor_type VARCHAR(50), -- PORTAL | PARTNER | SYSTEM
    actor_id UUID,

    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE MATERIALIZED VIEW booking_daily_stats AS
SELECT
    DATE(booked_at) AS booking_date,
    source,
    COUNT(*) AS total_bookings,
    SUM(total_amount) AS total_revenue,
    COUNT(*) FILTER (WHERE booking_status = 'CONFIRMED') AS confirmed,
    COUNT(*) FILTER (WHERE booking_status = 'CANCELLED') AS cancelled
FROM bookings
GROUP BY DATE(booked_at), source;

CREATE VIEW partner_booking_stats AS
SELECT
    p.name AS partner_name,
    COUNT(b.id) AS total_bookings,
    SUM(b.total_amount) AS revenue
FROM bookings b
JOIN api_partners p ON b.partner_id = p.id
GROUP BY p.name;

CREATE TABLE booking_access_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    partner_id UUID REFERENCES api_partners(id),
    access_level VARCHAR(50),
    -- READ_ONLY | MODIFY | FULL_OVERRIDE

    applies_to_source VARCHAR(50),
    -- ALL | PORTAL | API | MAKEMYTRIP

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE booking_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),

    version_no INT,
    snapshot JSONB,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cancellation_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    source VARCHAR(50),
    -- PORTAL | MAKEMYTRIP

    hours_before_travel INT,
    refund_percentage INT,

    is_active BOOLEAN DEFAULT TRUE
);
 

CREATE TABLE booking_customer_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_customer_id UUID REFERENCES booking_customers(id),
    contact_type VARCHAR(50), -- EMERGENCY, ALTERNATE
    phone VARCHAR(20)
);

CREATE TABLE package_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,

    pax_type VARCHAR(20) NOT NULL,
    -- ADULT | CHILD | INFANT

    price_per_pax NUMERIC(10,2) NOT NULL,

    min_pax INT DEFAULT 1,
    max_pax INT,

    valid_from DATE,
    valid_to DATE,

    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),

    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(100),

    amount NUMERIC(10,2),
    status VARCHAR(20),
    paid_at TIMESTAMP,

    settlement_status VARCHAR(20),
    settled_at TIMESTAMP
);

CREATE TABLE partner_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES api_partners(id),

    settlement_period_start DATE,
    settlement_period_end DATE,

    total_bookings INT,
    payable_amount NUMERIC(12,2),

    status VARCHAR(20),
    settled_at TIMESTAMP
);
