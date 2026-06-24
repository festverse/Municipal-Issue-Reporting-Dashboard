-- ==========================================
-- Municipal Issue Reporting Dashboard
-- PostgreSQL Schema Definition
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Create Custom ENUM Types
-- ==========================================
CREATE TYPE user_role AS ENUM ('CITIZEN', 'ENGINEER', 'ADMIN');
CREATE TYPE issue_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
CREATE TYPE activity_type AS ENUM ('STATUS_CHANGE', 'COMMENT', 'ASSIGNMENT', 'CREATE');

-- ==========================================
-- 2. Create Core Tables
-- ==========================================

-- Users Table
-- Stores all platform users with role-based access (Citizen, Engineer, Admin)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'CITIZEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Administrative Zones Table
-- Represents geographic administrative divisions within the municipality
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Issue Categories Table
-- Classifies the type of municipal issue being reported
CREATE TABLE issue_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    priority_default issue_priority DEFAULT 'MEDIUM'
);

-- Tickets Table
-- Core table storing all reported municipal issues
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
    upvotes_count INT DEFAULT 0,
    sla_due_at TIMESTAMP WITH TIME ZONE,
    sla_breached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE  -- Set when status transitions to RESOLVED
);

-- Ticket Activities (Audit Trail)
-- Immutable log of every action taken on a ticket for full traceability
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

-- Ticket Comments
-- Stores public discussion comments on tickets
CREATE TABLE ticket_comments (
    id SERIAL PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Upvotes
-- Tracks user upvotes on tickets to calculate community priority
CREATE TABLE ticket_upvotes (
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (ticket_id, user_id)
);

-- ==========================================
-- 3. Automation & Triggers
-- ==========================================

-- Function to automatically update the 'updated_at' column on any ticket modification
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

-- Function to automatically set 'resolved_at' when ticket status changes to RESOLVED
CREATE OR REPLACE FUNCTION set_resolved_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'RESOLVED' AND (OLD.status IS NULL OR OLD.status != 'RESOLVED') THEN
        NEW.resolved_at = NOW();
    END IF;
    -- Clear resolved_at if status moves away from RESOLVED (e.g., reopened)
    IF NEW.status != 'RESOLVED' AND OLD.status = 'RESOLVED' THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_resolved_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION set_resolved_timestamp();

-- ==========================================
-- 4. Indexes for Query Performance
-- ==========================================

-- Single-column indexes for frequently filtered columns
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_zone ON tickets(zone_id);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_engineer_id);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_category ON tickets(category_id);
CREATE INDEX idx_tickets_citizen ON tickets(citizen_id);

-- Composite indexes for common filter combinations
CREATE INDEX idx_tickets_status_zone ON tickets(status, zone_id);
CREATE INDEX idx_tickets_status_priority ON tickets(status, priority);
CREATE INDEX idx_tickets_zone_priority ON tickets(zone_id, priority);

-- Index for activity timeline queries
CREATE INDEX idx_activities_ticket ON ticket_activities(ticket_id);
CREATE INDEX idx_activities_created ON ticket_activities(created_at DESC);

-- Full-text search index on ticket title and description
CREATE INDEX idx_tickets_search ON tickets USING gin(to_tsvector('english', title || ' ' || description));