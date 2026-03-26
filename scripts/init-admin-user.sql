-- Initialize Admin User for Track2Act Platform
-- Admin User: shivansh@admin.com
-- Note: Password hash is BCrypt encrypted version of "9820689183"
-- BCrypt Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/LaC

INSERT INTO users (
  id,
  full_name,
  email,
  password,
  role,
  phone_number,
  address,
  company_name,
  is_active,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Shivansh',
  'shivansh@admin.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/LaC',
  'ADMIN',
  NULL,
  NULL,
  NULL,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
