-- Insert mock administrative zones
INSERT INTO zones (zone_name, description) VALUES 
('Central Zone', 'Main city center and municipal headquarters'),
('Varachha Zone', 'Eastern district limits'),
('Athwa Zone', 'Western district and riverfront areas'),
('Udhna Zone', 'Southern industrial and residential sectors');

-- Insert default issue categories
INSERT INTO issue_categories (name, priority_default) VALUES 
('Pothole / Road Damage', 'MEDIUM'),
('Streetlight Malfunction', 'LOW'),
('Water Pipe Leak', 'HIGH'),
('Drainage Blockage', 'HIGH'),
('Fallen Tree / Debris', 'MEDIUM');