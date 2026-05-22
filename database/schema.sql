-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Create Custom ENUM Types
-- ==========================================
CREATE TYPE user_role AS ENUM ('CITIZEN', 'ENGINEER', 'ADMIN');
CREATE TYPE issue_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
CREATE TYPE activity_type AS ENUM ('STATUS_CHANGE', 'COMMENT', 'ASSIGNMENT');

-- ==========================================
-- 2. Create Core Tables
-- ==========================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zones Table
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Categories Table
CREATE TABLE issue_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    priority_default issue_priority DEFAULT 'MEDIUM'
);

-- Tickets Table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id INT REFERENCES issue_categories(id) ON DELETE RESTRICT,
    zone_id INT REFERENCES zones(id) ON DELETE RESTRICT,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    status ticket_status DEFAULT 'OPEN',
    priority issue_priority NOT NULL,
    assigned_engineer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    media_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Activities (Audit Trail)
CREATE TABLE ticket_activities (
    id SERIAL PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    old_status ticket_status,
    new_status ticket_status,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. Automation & Indexes
-- ==========================================

-- Function to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger attached to the tickets table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Indexes for performance on frequently queried columns
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_zone ON tickets(zone_id);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_engineer_id);