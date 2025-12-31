import type { Booking, Destination, Package, User, Role, Permission, Amenity, UserActivityLog, Partner, ApiCredential, ApiAccessLog } from "../types/schema";

export const mockUsers: User[] = [
    {
        id: "u1",
        full_name: "Admin User",
        email: "admin@tripura.gov.in",
        user_type: "PORTAL_ADMIN",
        is_active: true,
        is_verified: true,
        created_at: "2024-01-01T10:00:00Z",
        updated_at: "2024-01-01T10:00:00Z",
    },
    {
        id: "u2",
        full_name: "Staff Member",
        email: "staff@tripura.gov.in",
        user_type: "PORTAL_STAFF",
        is_active: true,
        is_verified: true,
        created_at: "2024-02-15T10:00:00Z",
        updated_at: "2024-02-15T10:00:00Z",
    },
    {
        id: "u3",
        full_name: "Asset Manager",
        email: "manager@tripura.gov.in",
        user_type: "ASSET_MANAGER",
        is_active: true,
        is_verified: true,
        created_at: "2024-03-01T10:00:00Z",
        updated_at: "2024-03-01T10:00:00Z",
    },
];

export const mockDestinations: Destination[] = [
    {
        id: "d1",
        name: "Ujjayanta Palace",
        slug: "ujjayanta-palace",
        description: "Former royal palace of the Tripura kings, now a museum.",
        district: "West Tripura",
        best_time_to_visit: "October to March",
        is_featured: true,
        is_active: true,
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z",
        images: ["https://tripuratourism.gov.in/sites/default/files/styles/flexslider_full/public/ujjayanta-palace.jpg?itok=somehash"],
    },
    {
        id: "d2",
        name: "Neermahal",
        slug: "neermahal",
        description: "A water palace built in the middle of Rudrasagar Lake.",
        district: "Sepahijala",
        best_time_to_visit: "Winter",
        is_featured: true,
        is_active: true,
        created_at: "2024-01-12T10:00:00Z",
        updated_at: "2024-01-12T10:00:00Z",
    }
];

export const mockAccommodations = [
    { id: 'acc1', name: 'Deluxe Room', type: 'Room', base_price: 3500, max_occupancy: 2 },
    { id: 'acc2', name: 'Royal Suite', type: 'Room', base_price: 8500, max_occupancy: 2 },
    { id: 'acc3', name: 'Camping Tent', type: 'Tent', base_price: 1500, max_occupancy: 2 },
    { id: 'acc4', name: 'Family Cottage', type: 'Cottage', base_price: 5500, max_occupancy: 4 },
];

export const mockExperiences = [
    { id: 'exp1', name: 'Guided Jungle Trek', price_inr: 1200, duration: '4 hours' },
    { id: 'exp2', name: 'Sunset Boat Ride', price_inr: 800, duration: '2 hours' },
    { id: 'exp3', name: 'Cultural Dance Show', price_inr: 500, duration: '1.5 hours' },
];

export const mockPackages: Package[] = [
    {
        id: "p1",
        name: "Royal Tripura Tour",
        slug: "royal-tripura-tour",
        description: "Experience the royal heritage of Tripura.",
        duration_days: 3,
        price_inr: 15000,
        package_type: "Luxury",
        is_active: true,
        created_at: "2024-03-01T10:00:00Z",
    },
    {
        id: "p2",
        name: "Spiritual Journey",
        slug: "spiritual-journey",
        description: "Visit the most sacred temples.",
        duration_days: 2,
        price_inr: 8000,
        package_type: "Family",
        is_active: true,
        created_at: "2024-03-05T10:00:00Z",
    }
];

export const mockBookings: Booking[] = [
    {
        id: "b1",
        booking_reference: "TRP-2025-0001",
        source: "PORTAL",
        package_id: "p1",
        package_name: "Royal Tripura Tour",
        booking_status: "CONFIRMED",
        travel_start_date: "2025-01-20",
        travel_end_date: "2025-01-23",
        pax_adults: 2,
        pax_children: 0,
        total_amount: 15000,
        currency: "INR",
        booked_at: "2024-12-20T14:30:00Z",
        customer_name: "Rahul Sharma",
        customer_email: "rahul@example.com",
        customer_phone: "9876543210"
    },
    {
        id: "b2",
        booking_reference: "TRP-2025-0002",
        source: "MAKEMYTRIP",
        package_id: "p2",
        package_name: "Spiritual Journey",
        booking_status: "PENDING",
        travel_start_date: "2025-02-10",
        travel_end_date: "2025-02-12",
        pax_adults: 4,
        pax_children: 1,
        total_amount: 32000,
        currency: "INR",
        booked_at: "2024-12-21T09:15:00Z",
        customer_name: "Amit Patel",
        customer_email: "amit@example.com",
    },
    {
        id: "b3",
        booking_reference: "TRP-2025-0003",
        source: "PORTAL",
        package_id: "p1",
        package_name: "Royal Tripura Tour",
        booking_status: "CANCELLED",
        travel_start_date: "2025-01-25",
        travel_end_date: "2025-01-28",
        pax_adults: 1,
        pax_children: 0,
        total_amount: 15000,
        currency: "INR",
        booked_at: "2024-12-18T11:00:00Z",
        customer_name: "Sneha Das",
        customer_email: "sneha@example.com",
    }
];

export const mockRoles: Role[] = [
    { id: 'r1', name: 'Super Admin', description: 'Full access to all resources.' },
    { id: 'r2', name: 'Content Manager', description: 'Manage destinations and packages.' },
    { id: 'r3', name: 'Asset Manager', description: 'Manage assigned destinations, experiences, and packages.' },
];

export const mockPermissions: Permission[] = [
    { id: 'p1', code: 'users:read', description: 'View users' },
    { id: 'p2', code: 'users:write', description: 'Create/Edit users' },
    { id: 'p3', code: 'bookings:read', description: 'View bookings' },
    { id: 'p4', code: 'destinations:write', description: 'Manage destinations' },
];

export const mockAmenities: Amenity[] = [
    { id: 'a1', name: 'Free WiFi', slug: 'free-wifi', category: 'Stay', is_active: true },
    { id: 'a2', name: 'AC Bus', slug: 'ac-bus', category: 'Transport', is_active: true },
    { id: 'a3', name: 'First Aid', slug: 'first-aid', category: 'Safety', is_active: true },
];

export const mockActivityLogs: UserActivityLog[] = [
    { id: 'l1', user_id: 'u1', user_name: 'Admin User', action: 'LOGIN', resource_type: 'AUTH', created_at: '2024-12-22T08:00:00Z' },
    { id: 'l2', user_id: 'u1', user_name: 'Admin User', action: 'UPDATE_BOOKING', resource_type: 'BOOKING', resource_id: 'b1', created_at: '2024-12-22T08:15:00Z' },
    { id: 'l3', user_id: 'u2', user_name: 'Staff Member', action: 'CREATE_PACKAGE', resource_type: 'PACKAGE', resource_id: 'p3', created_at: '2024-12-21T14:20:00Z' },
];

export const mockPartners: Partner[] = [
    { id: 'par1', name: 'MakeMyTrip', domain: 'makemytrip.com', contact_email: 'api@mmt.com', is_active: true, created_at: '2023-01-01T00:00:00Z' },
    { id: 'par2', name: 'GoIbibo', domain: 'goibibo.com', contact_email: 'dev@goibibo.com', is_active: true, created_at: '2023-02-15T00:00:00Z' },
];

export const mockApiCredentials: ApiCredential[] = [
    { id: 'c1', partner_id: 'par1', partner_name: 'MakeMyTrip', client_id: 'mmt_v1_client', client_secret: '••••••••••••', scopes: ['read', 'write'], rate_limit_per_min: 1000, is_active: true, created_at: '2023-01-01T00:00:00Z' },
];

export const mockApiLogs: ApiAccessLog[] = [
    { id: 'al1', partner_id: 'par1', partner_name: 'MakeMyTrip', endpoint: '/api/v1/packages', request_ip: '203.0.113.1', status_code: 200, created_at: '2024-12-22T09:30:00Z' },
    { id: 'al2', partner_id: 'par1', partner_name: 'MakeMyTrip', endpoint: '/api/v1/bookings', request_ip: '203.0.113.1', status_code: 201, created_at: '2024-12-22T09:35:00Z' },
    { id: 'al3', partner_id: 'par2', partner_name: 'GoIbibo', endpoint: '/api/v1/destinations', request_ip: '198.51.100.2', status_code: 403, created_at: '2024-12-22T09:40:00Z' },
];
