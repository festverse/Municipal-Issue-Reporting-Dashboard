-- ==========================================
-- Municipal Dashboard — Seed Data
-- ==========================================
-- This script populates the database with realistic demo data
-- for development and demonstration purposes.

-- ==========================================
-- 1. Administrative Zones
-- ==========================================
INSERT INTO zones (zone_name, description) VALUES 
('Central Zone', 'Main city center and municipal headquarters area'),
('Varachha Zone', 'Eastern residential and commercial district'),
('Athwa Zone', 'Western district including riverfront areas'),
('Udhna Zone', 'Southern industrial and residential sectors'),
('Katargam Zone', 'Northern suburban residential area'),
('Rander Zone', 'Historic western township and market area');

-- ==========================================
-- 2. Issue Categories
-- ==========================================
INSERT INTO issue_categories (name, priority_default) VALUES 
('Pothole / Road Damage', 'MEDIUM'),
('Streetlight Malfunction', 'LOW'),
('Water Pipe Leak', 'HIGH'),
('Drainage Blockage', 'HIGH'),
('Fallen Tree / Debris', 'MEDIUM'),
('Garbage Overflow', 'MEDIUM'),
('Traffic Signal Issue', 'HIGH'),
('Footpath Damage', 'LOW');

-- ==========================================
-- 3. Demo Users
-- ==========================================
-- Passwords are pre-hashed with bcrypt (12 rounds)
-- citizen@demo.com  → password: citizen123
-- engineer@demo.com → password: engineer123
-- admin@demo.com    → password: admin123

INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES 
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'citizen@demo.com',
  '$2b$12$RQ2DXRtg/3P3n.rLS8L9a.YGHNA97WxD7LeJY934tGLrtgQ4KCI2q',
  'Rahul Sharma',
  '+91-9876543210',
  'CITIZEN'
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'engineer@demo.com',
  '$2b$12$HMyyv/XCZvmg4ULP4eG1Je4NwiFCDgf.WOgg5enzrv5kFcK2kWpSi',
  'Priya Patel',
  '+91-9876543211',
  'ENGINEER'
),
(
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'admin@demo.com',
  '$2b$12$RICgcHczUmBZDsuKwIS8huHvTPKDecF.4f4x2Lpqc6YqUqA/9M3qS',
  'Municipal Admin',
  '+91-9876543212',
  'ADMIN'
);

-- ==========================================
-- 4. Sample Tickets (across different statuses for rich demo)
-- ==========================================
INSERT INTO tickets (citizen_id, category_id, zone_id, title, description, latitude, longitude, status, priority, assigned_engineer_id) VALUES

-- OPEN tickets
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1, 1,
  'Large pothole near City Hall',
  'A deep pothole approximately 2 feet wide has formed on the main road near the city hall entrance. Multiple vehicles have been damaged. Urgent repair needed.',
  21.1702, 72.8311,
  'OPEN', 'HIGH', NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3, 2,
  'Water pipe burst on Varachha Main Road',
  'A major water pipe has burst causing flooding on the main road. Water is wasting continuously and the road is becoming slippery.',
  21.1850, 72.8540,
  'OPEN', 'CRITICAL', NULL
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  6, 5,
  'Overflowing garbage bin at Katargam junction',
  'The public garbage bin at the main junction has not been collected for 4 days. Waste is overflowing onto the sidewalk and causing foul odor.',
  21.2100, 72.8200,
  'OPEN', 'MEDIUM', NULL
),

-- ASSIGNED tickets
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2, 3,
  'Streetlight not working on Athwa Lines',
  'Three consecutive streetlights on Athwa Lines near the park are non-functional for over a week. The area becomes very dark and unsafe after 7 PM.',
  21.1600, 72.7900,
  'ASSIGNED', 'MEDIUM',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901'
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  7, 1,
  'Traffic signal malfunction at Ring Road junction',
  'The traffic signal at the Ring Road and Station Road junction is stuck on red in all directions, causing major traffic jams during peak hours.',
  21.1750, 72.8400,
  'ASSIGNED', 'HIGH',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901'
),

-- IN_PROGRESS tickets
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4, 4,
  'Drainage blockage causing waterlogging in Udhna',
  'The main drainage channel near the industrial area is completely blocked, causing severe waterlogging in the residential colony during rains.',
  21.1500, 72.8600,
  'IN_PROGRESS', 'HIGH',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901'
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1, 6,
  'Road surface deteriorated on Rander Road',
  'The entire stretch of road near the bridge has developed multiple cracks and potholes. The asphalt has broken down significantly.',
  21.2000, 72.7800,
  'IN_PROGRESS', 'MEDIUM',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901'
),

-- RESOLVED tickets
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5, 2,
  'Fallen tree blocking Varachha residential street',
  'A large banyan tree fell during last night''s storm and is completely blocking the residential street. No vehicles can pass.',
  21.1900, 72.8450,
  'RESOLVED', 'HIGH',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901'
),
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  8, 3,
  'Broken footpath near Athwa Gate',
  'Multiple tiles on the footpath near Athwa Gate are broken and uneven, creating tripping hazards for pedestrians.',
  21.1580, 72.7950,
  'RESOLVED', 'LOW',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901'
),

-- REJECTED ticket
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2, 4,
  'Dim streetlight on private property',
  'The streetlight near the private factory compound appears dim. However, this light is maintained by the factory, not the municipality.',
  21.1480, 72.8650,
  'REJECTED', 'LOW',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901'
);

-- ==========================================
-- 5. Sample Audit Trail / Activity Logs
-- ==========================================
-- These demonstrate the transactional audit logging feature

-- Activities for the ASSIGNED streetlight ticket
INSERT INTO ticket_activities (ticket_id, user_id, activity_type, old_status, new_status, note)
SELECT t.id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STATUS_CHANGE', 'OPEN', 'ASSIGNED', 
  'Assigned to electrical maintenance team. Will inspect within 48 hours.'
FROM tickets t WHERE t.title = 'Streetlight not working on Athwa Lines';

-- Activities for the IN_PROGRESS drainage ticket
INSERT INTO ticket_activities (ticket_id, user_id, activity_type, old_status, new_status, note)
SELECT t.id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STATUS_CHANGE', 'OPEN', 'ASSIGNED', 
  'Assigned to drainage division.'
FROM tickets t WHERE t.title = 'Drainage blockage causing waterlogging in Udhna';

INSERT INTO ticket_activities (ticket_id, user_id, activity_type, old_status, new_status, note)
SELECT t.id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STATUS_CHANGE', 'ASSIGNED', 'IN_PROGRESS', 
  'JCB machine deployed. Clearing the blockage now. Expected completion in 2 days.'
FROM tickets t WHERE t.title = 'Drainage blockage causing waterlogging in Udhna';

-- Activities for the RESOLVED fallen tree ticket
INSERT INTO ticket_activities (ticket_id, user_id, activity_type, old_status, new_status, note)
SELECT t.id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STATUS_CHANGE', 'OPEN', 'ASSIGNED', 
  'Emergency response team dispatched.'
FROM tickets t WHERE t.title = 'Fallen tree blocking Varachha residential street';

INSERT INTO ticket_activities (ticket_id, user_id, activity_type, old_status, new_status, note)
SELECT t.id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STATUS_CHANGE', 'ASSIGNED', 'IN_PROGRESS', 
  'Team on site. Cutting tree branches to clear the road.'
FROM tickets t WHERE t.title = 'Fallen tree blocking Varachha residential street';

INSERT INTO ticket_activities (ticket_id, user_id, activity_type, old_status, new_status, note)
SELECT t.id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STATUS_CHANGE', 'IN_PROGRESS', 'RESOLVED', 
  'Road cleared. Tree debris removed. Street is now fully accessible.'
FROM tickets t WHERE t.title = 'Fallen tree blocking Varachha residential street';

-- Activity for the REJECTED ticket
INSERT INTO ticket_activities (ticket_id, user_id, activity_type, old_status, new_status, note)
SELECT t.id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'STATUS_CHANGE', 'OPEN', 'REJECTED', 
  'This light is maintained by the private factory. Please contact the factory management directly. Not under municipal jurisdiction.'
FROM tickets t WHERE t.title = 'Dim streetlight on private property';

-- ==========================================
-- 6. Sample Upvotes, Comments, and SLA settings
-- ==========================================

UPDATE tickets SET upvotes_count = 14, sla_due_at = NOW() + INTERVAL '12 hours', sla_breached = false WHERE title = 'Large pothole near City Hall';
UPDATE tickets SET upvotes_count = 28, sla_due_at = NOW() - INTERVAL '1 hour', sla_breached = true WHERE title = 'Water pipe burst on Varachha Main Road';
UPDATE tickets SET upvotes_count = 5, sla_due_at = NOW() + INTERVAL '3 days', sla_breached = false WHERE title = 'Overflowing garbage bin at Katargam junction';
UPDATE tickets SET upvotes_count = 12, sla_due_at = NOW() + INTERVAL '1 day', sla_breached = false WHERE title = 'Streetlight not working on Athwa Lines';
UPDATE tickets SET upvotes_count = 19, sla_due_at = NOW() - INTERVAL '30 minutes', sla_breached = true WHERE title = 'Traffic signal malfunction at Ring Road junction';
UPDATE tickets SET upvotes_count = 8, sla_due_at = NOW() + INTERVAL '2 days', sla_breached = false WHERE title = 'Drainage blockage causing waterlogging in Udhna';
UPDATE tickets SET upvotes_count = 22, sla_due_at = NOW() + INTERVAL '4 days', sla_breached = false WHERE title = 'Road surface deteriorated on Rander Road';
UPDATE tickets SET upvotes_count = 15, sla_due_at = NOW() + INTERVAL '5 days', sla_breached = false WHERE title = 'Fallen tree blocking Varachha residential street';

-- Insert Sample Comments
INSERT INTO ticket_comments (ticket_id, user_id, comment)
SELECT id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'This pothole is getting bigger every day! Please fix it ASAP before an accident happens.'
FROM tickets WHERE title = 'Large pothole near City Hall';

INSERT INTO ticket_comments (ticket_id, user_id, comment)
SELECT id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Thank you for reporting. Our inspection team is scheduling a visit this afternoon.'
FROM tickets WHERE title = 'Large pothole near City Hall';

INSERT INTO ticket_comments (ticket_id, user_id, comment)
SELECT id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Water has reached the shops on the ground floor. It is a severe issue!'
FROM tickets WHERE title = 'Water pipe burst on Varachha Main Road';

-- Insert Sample Upvotes
INSERT INTO ticket_upvotes (ticket_id, user_id)
SELECT id, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
FROM tickets WHERE title = 'Large pothole near City Hall';

INSERT INTO ticket_upvotes (ticket_id, user_id)
SELECT id, 'b2c3d4e5-f6a7-8901-bcde-f12345678901'
FROM tickets WHERE title = 'Large pothole near City Hall';