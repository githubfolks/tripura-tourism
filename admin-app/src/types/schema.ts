export type UserType = 'PORTAL_ADMIN' | 'PORTAL_STAFF' | 'ASSET_MANAGER';

export interface User {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    user_type: UserType;
    partner_id?: string | null;
    assigned_destinations?: string[]; // IDs of assigned destinations
    assigned_experiences?: string[]; // IDs of assigned experiences
    assigned_packages?: string[];    // IDs of assigned packages
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface Destination {
    id: string;
    name: string;
    slug: string;
    description?: string;
    district?: string;
    latitude?: number;
    longitude?: number;
    best_time_to_visit?: string;
    how_to_reach?: string;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    images?: string[]; // Simplified from destination_images table
}

export type PackageType = 'Budget' | 'Luxury' | 'Family' | 'Adventure';

export interface Package {
    id: string;
    name: string;
    slug: string;
    description?: string;
    duration_days: number;
    price_inr?: number;
    package_type?: PackageType;
    inclusions?: string;
    exclusions?: string;
    is_active: boolean;
    created_at: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FAILED' | 'ON_HOLD' | 'CHECKED_IN' | 'CHECKED_OUT';

export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'FAILED' | 'REFUNDED';

export interface Booking {
    id: string;
    booking_reference: string;
    source: string;
    partner_id?: string | null;
    package_id?: string;
    experience_id?: string;
    package_name?: string; // Derived for UI
    booking_status: BookingStatus;
    travel_start_date: string;
    travel_end_date: string;
    pax_adults: number;
    pax_children: number;
    total_amount: number;
    amount_paid?: number;
    additional_revenue?: number;
    payment_status?: PaymentStatus;
    payment_reference?: string;
    currency: string;
    booked_at: string;
    customer_name: string; // From booking_customers
    customer_email?: string;
    customer_phone?: string;
    customer_id_type?: string;
    customer_id_proof_url?: string;
}

export interface Partner {
    id: string;
    name: string;
    domain?: string;
    contact_email?: string;
    is_active: boolean;
    created_at: string;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
}

export interface Permission {
    id: string;
    code: string;
    description?: string;
}

export interface RolePermission {
    role_id: string;
    permission_id: string;
}

export interface UserActivityLog {
    id: string;
    user_id?: string;
    user_name?: string; // Derived
    action: string;
    resource_type: string;
    resource_id?: string;
    metadata?: any;
    created_at: string;
}

export interface Amenity {
    id: string;
    name: string;
    slug: string;
    category: 'Transport' | 'Stay' | 'Meals' | 'Safety' | 'Guide' | 'Other';
    icon_url?: string;
    is_active: boolean;
}

export interface ApiCredential {
    id: string;
    partner_id: string;
    partner_name?: string; // Derived
    client_id: string;
    client_secret: string; // Should be hidden/masked in real app
    scopes: string[];
    rate_limit_per_min: number;
    is_active: boolean;
    created_at: string;
}

export interface ApiAccessLog {
    id: string;
    partner_id?: string;
    partner_name?: string; // Derived
    endpoint: string;
    request_ip: string;
    status_code: number;
    created_at: string;
}
