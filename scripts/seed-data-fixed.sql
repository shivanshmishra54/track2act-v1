-- FIXED Track2Act Seed Script (matches entity schema)
-- Password: $2a$10$demo1234567890abcdefgHIJKlmnopqrs (bcrypt 'demo')
-- UUIDs for FK, status enum, location FKs

-- 1. Clear existing (optional)
DELETE FROM tracking_updates;
DELETE FROM shipments;
DELETE FROM users WHERE email NOT LIKE 'shivansh@admin.com';

-- 2. Users (email unique)
INSERT INTO users (id, full_name, email, password, role, phone_number, company_name, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Driver Raj', 'driver1@track.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'DRIVER', '9876543210', 'Track2Act', true),
  ('22222222-2222-2222-2222-222222222222', 'Driver Priya', 'driver2@track.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'DRIVER', '9876543211', 'Track2Act', true),
  ('33333333-3333-3333-3333-333333333333', 'Driver Amit', 'driver3@track.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'DRIVER', '9876543212', 'Track2Act', true),
  ('44444444-4444-4444-4444-444444444444', 'Customer ABC', 'cust1@company.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'CUSTOMER', '9876543213', 'ABC Co', true),
  ('55555555-5555-5555-5555-555555555555', 'Customer XYZ', 'cust2@company.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'CUSTOMER', '9876543214', 'XYZ Co', true),
  ('66666666-6666-6666-6666-666666666666', 'Customer Tech', 'cust3@company.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'CUSTOMER', '9876543215', 'Tech Co', true),
  ('77777777-7777-7777-7777-777777777777', 'Officer Neha', 'officer1@track.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'COMPANY_OFFICER', '9876543216', 'Track2Act Ops', true),
  ('88888888-8888-8888-8888-888888888888', 'Officer Vikram', 'officer2@track.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'COMPANY_OFFICER', '9876543217', 'Track2Act Ops', true),
  ('99999999-9999-9999-9999-999999999999', 'Officer Sneha', 'officer3@track.com', '$2a$10$demo1234567890abcdefgHIJKlmnopqrs', 'COMPANY_OFFICER', '9876543218', 'Track2Act Ops', true);

-- 3. Locations (UUID gen auto)
INSERT INTO locations (name, type, latitude, longitude) VALUES
  ('Mumbai Port', 'PORT', 19.0760, 72.8777),
  ('Pune Hub', 'HUB', 18.5204, 73.8567),
  ('Delhi Hub', 'HUB', 28.6139, 77.2090),
  ('Bangalore Port', 'PORT', 12.9716, 77.5946),
  ('Chennai Hub', 'HUB', 13.0827, 80.2707);

-- Get loc IDs (manual after insert or use subquery)
-- Note: Use SELECT id FROM locations WHERE name = 'Mumbai Port'; copy IDs for below

-- 4. Shipments (use actual loc IDs after step 3, example)
-- Run step 3 first, copy loc IDs into below INSERT origin_id, destination_id
INSERT INTO shipments (tracking_number, cargo_type, cargo_weight, cargo_description, status, current_progress, origin_id, destination_id, assigned_driver_id, created_by_id, customer_name, customer_contact, receiver_name, receiver_contact, estimated_arrival) VALUES
  ('TRK001', 'Electronics', 150.5, 'Laptops', 'IN_TRANSIT', 75, (SELECT id FROM locations WHERE name = 'Mumbai Port'), (SELECT id FROM locations WHERE name = 'Pune Hub'), '11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'ABC Ltd', '9876543213', 'Retail', '9876543200', '2024-04-10 18:00:00'),
  ('TRK002', 'Pharma', 80.0, 'Medicine', 'PENDING', 0, (SELECT id FROM locations WHERE name = 'Delhi Hub'), (SELECT id FROM locations WHERE name = 'Bangalore Port'), '22222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 'XYZ Pharma', '9876543214', 'Dist', '9876543201', '2024-04-12 12:00:00');

-- Verify
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM shipments;
SELECT COUNT(*) FROM locations;
-- Login test users with 'demo'

