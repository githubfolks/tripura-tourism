INSERT INTO destinations
(name, slug, description, district, latitude, longitude, best_time_to_visit, is_featured)
VALUES
('Ujjayanta Palace', 'ujjayanta-palace',
 'Former royal palace showcasing Tripura’s history and culture.',
 'Agartala', 23.831457, 91.286777, 'October to March', TRUE),

('Neermahal', 'neermahal',
 'Water palace located in the middle of Rudrasagar Lake.',
 'Sepahijala', 23.508214, 91.308112, 'October to February', TRUE),

('Unakoti', 'unakoti',
 'Ancient Shaivite rock carvings and sculptures.',
 'Unakoti', 24.312206, 92.008147, 'November to March', FALSE);


INSERT INTO experiences
(title, slug, description, experience_type, duration_hours, difficulty_level)
VALUES
('Heritage Walk at Ujjayanta Palace', 'heritage-walk-ujjayanta',
 'Guided heritage walk through the palace museum.',
 'Culture', 2, 'Easy'),

('Boat Ride at Neermahal', 'boat-ride-neermahal',
 'Scenic boat ride around the water palace.',
 'Nature', 1, 'Easy'),

('Trekking at Unakoti Hills', 'trekking-unakoti',
 'Trek through forest trails to ancient rock carvings.',
 'Adventure', 4, 'Moderate');

INSERT INTO experience_destinations
SELECT e.id, d.id
FROM experiences e, destinations d
WHERE
(e.slug = 'heritage-walk-ujjayanta' AND d.slug = 'ujjayanta-palace')
OR
(e.slug = 'boat-ride-neermahal' AND d.slug = 'neermahal')
OR
(e.slug = 'trekking-unakoti' AND d.slug = 'unakoti');

INSERT INTO packages
(name, slug, description, duration_days, price_inr, package_type, inclusions)
VALUES
('Royal Tripura Heritage Tour', 'royal-tripura-heritage-tour',
 'Explore royal palaces and cultural landmarks of Tripura.',
 3, 8999.00, 'Family',
 'Accommodation, Breakfast, Local Guide'),

('Tripura Nature & Adventure Package', 'tripura-nature-adventure',
 'Experience lakes, hills and adventure activities.',
 4, 12999.00, 'Adventure',
 'Accommodation, Transport, Activities');

INSERT INTO package_destinations
SELECT p.id, d.id, 1
FROM packages p, destinations d
WHERE p.slug = 'royal-tripura-heritage-tour'
AND d.slug IN ('ujjayanta-palace', 'neermahal');

INSERT INTO package_experiences
SELECT p.id, e.id
FROM packages p, experiences e
WHERE p.slug = 'tripura-nature-adventure'
AND e.slug IN ('boat-ride-neermahal', 'trekking-unakoti');


INSERT INTO amenities (name, slug, category)
VALUES
('AC Transport', 'ac-transport', 'Transport'),
('Non-AC Transport', 'non-ac-transport', 'Transport'),
('Hotel Accommodation', 'hotel-accommodation', 'Stay'),
('Homestay', 'homestay', 'Stay'),
('Breakfast Included', 'breakfast-included', 'Meals'),
('All Meals Included', 'all-meals-included', 'Meals'),
('Local Tour Guide', 'local-tour-guide', 'Guide'),
('Boat Ride', 'boat-ride', 'Activity'),
('First Aid Support', 'first-aid-support', 'Safety');

INSERT INTO package_amenities
SELECT p.id, a.id
FROM packages p, amenities a
WHERE p.slug = 'royal-tripura-heritage-tour'
AND a.slug IN (
    'ac-transport',
    'hotel-accommodation',
    'breakfast-included',
    'local-tour-guide'
);

INSERT INTO api_partners
(id, name, domain, contact_email, is_active)
VALUES
(
  '2a7fbd8c-7a01-4f93-b63a-1c2f3d9e1111',
  'MakeMyTrip India Pvt Ltd',
  'https://www.makemytrip.com',
  'api-partners@makemytrip.com',
  TRUE
),
(
  '5c9a123a-91e7-4a2b-8a42-9f7d9c3e2222',
  'Goibibo',
  'https://www.goibibo.com',
  'tech-partners@goibibo.com',
  TRUE
),
(
  '8f4d88b2-0a55-4d63-95bc-0d1c8c5e3333',
  'Tripura Tourism Official Mobile App',
  'https://tripuratourism.gov.in',
  'itcell@tripuratourism.gov.in',
  TRUE
);
INSERT INTO api_credentials
(id, partner_id, client_id, client_secret, scopes, rate_limit_per_min, is_active)
VALUES
(
  'b1c34b8f-5e88-4e64-8f98-abc111111111',
  '2a7fbd8c-7a01-4f93-b63a-1c2f3d9e1111',
  'mmt_tripura_tourism',
  '$2b$12$e9Z5kYhFZ5xZ7n1mmtHashedSecretExample',
  ARRAY[
    'partner:read:destinations',
    'partner:read:packages',
    'partner:create:inquiries'
  ],
  120,
  TRUE
),
(
  'c2d45e9a-6f99-4a32-9a88-def222222222',
  '5c9a123a-91e7-4a2b-8a42-9f7d9c3e2222',
  'goibibo_tripura_api',
  '$2b$12$e9Z5kYhFZ5xZ7n1goibiboHashedSecret',
  ARRAY[
    'partner:read:destinations',
    'partner:read:packages'
  ],
  80,
  TRUE
),
(
  'd3e56fab-7a11-4b21-8d90-ghi333333333',
  '8f4d88b2-0a55-4d63-95bc-0d1c8c5e3333',
  'tripura_official_app',
  '$2b$12$e9Z5kYhFZ5xZ7n1govAppHashedSecret',
  ARRAY[
    'partner:read:destinations',
    'partner:read:packages',
    'partner:read:experiences',
    'partner:create:inquiries'
  ],
  300,
  TRUE
);
INSERT INTO bookings
(booking_reference, source, partner_id, package_id,
 booking_status, travel_start_date, travel_end_date,
 pax_adults, total_amount)
VALUES
(
 'TRP-2025-000124',
 'MAKEMYTRIP',
 '2a7fbd8c-7a01-4f93-b63a-1c2f3d9e1111',
 (SELECT id FROM packages WHERE slug='royal-tripura-heritage-tour'),
 'CONFIRMED',
 '2025-02-10',
 '2025-02-13',
 2,
 17998.00
);

INSERT INTO roles (name, description) VALUES
('PORTAL_SUPER_ADMIN', 'Full system control'),
('PORTAL_ADMIN', 'Manage content, users, bookings'),
('PORTAL_STAFF', 'Operational staff'),
('PARTNER_ADMIN', 'Partner-level booking control'),
('PARTNER_USER', 'View and manage assigned bookings');

INSERT INTO permissions (code, description) VALUES
('booking:view:all', 'View all bookings'),
('booking:view:own', 'View own partner bookings'),
('booking:modify', 'Modify booking'),
('booking:cancel', 'Cancel booking'),
('booking:override', 'Force override booking'),

('package:manage', 'Create/update packages'),
('user:manage', 'Create/update users'),
('partner:manage', 'Manage API partners'),
('report:view', 'View reports & stats');

-- PORTAL ADMIN
INSERT INTO role_permissions
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name='PORTAL_ADMIN';

-- PARTNER ADMIN
INSERT INTO role_permissions
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name='PARTNER_ADMIN'
AND p.code IN (
    'booking:view:all',
    'booking:modify',
    'booking:cancel',
    'booking:override',
    'report:view'
);

INSERT INTO users
(full_name, email, user_type, partner_id, is_verified)
VALUES
('Tripura Tourism Admin', 'admin@tripuratourism.gov.in', 'PORTAL_ADMIN', NULL, TRUE),

('MMT Partner Admin', 'admin@makemytrip.com', 'PARTNER_ADMIN',
 '2a7fbd8c-7a01-4f93-b63a-1c2f3d9e1111', TRUE);

INSERT INTO users
(id, full_name, email, user_type, is_active, is_verified)
VALUES
('00000000-0000-0000-0000-000000000001',
 'SYSTEM',
 'system@tripuratourism.gov.in',
 'PORTAL_ADMIN',
 TRUE,
 TRUE);

INSERT INTO package_pricing
(package_id, pax_type, price_per_pax)
VALUES
((SELECT id FROM packages WHERE slug='royal-tripura-heritage-tour'), 'ADULT', 8999),
((SELECT id FROM packages WHERE slug='royal-tripura-heritage-tour'), 'CHILD', 5999),
((SELECT id FROM packages WHERE slug='royal-tripura-heritage-tour'), 'INFANT', 0);

