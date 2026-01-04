# Microservices Architecture Plan for Tripura Tourism

## Analysis of `api/schema_v3.sql`
The current schema represents a monolithic relational database handling users, content (destinations/packages), bookings, and payments. To transition to a microservices architecture, we will decompose the system based on **Bounded Contexts**.

## Architecture Overview
**Tech Stack:**
- **Language:** Python 3.10+
- **Web Framework:** FastAPI (Async, Type-safe)
- **Database:** PostgreSQL (Separate logical databases or schemas per service)
- **Containerization:** Docker
- **Orchestration:** Kubernetes (K8s)
- **API Gateway:** Nginx Ingress or dedicated Gateway Service (e.g., Kong/Traefik) running in K8s
- **Inter-service Communication:** HTTP/REST (Synchronous) + RabbitMQ/Kafka (Asynchronous Events)

## Service Boundaries

### 1. Auth Service (Identity & Access Management)
**Responsibilities:** User registration, login, JWT token issuance, RBAC permissions.
**Tables:**
- `users`
- `user_credentials`
- `roles`
- `permissions`
- `user_roles`
- `user_sessions`
- `user_activity_logs`
- `asset_manager_assignments`

### 2. Catalog Service (Content Management)
**Responsibilities:** Managing static data for destinations, hotels, and packages. Public-facing read-heavy APIs.
**Tables:**
- `destinations`, `destination_images`
- `accommodations`
- `experiences`, `experience_destinations`
- `packages`, `package_destinations`, `package_experiences`
- `amenities`, `package_amenities`
- `package_pricing`

### 3. Inventory Service
**Responsibilities:** Real-time availability management. High concurrency handling.
**Tables:**
- `accommodation_availability`
*(Note: Potentially `package_availability` in future)*

### 4. Booking Service (Core Transactional)
**Responsibilities:** Booking lifecycle state machine, order management.
**Tables:**
- `bookings`
- `booking_customers`, `booking_items`
- `booking_overrides`, `booking_versions`
- `booking_audit_logs`
- `booking_access_policies`
- `cancellation_policies`
- `booking_customer_contacts`

### 5. Payment Service
**Responsibilities:** Payment gateway integration, transaction recording, refunds.
**Tables:**
- `payments`
- `booking_payments`

### 6. Partner Service (B2B)
**Responsibilities:** Partner API credentials, rate limiting, B2B settlements.
**Tables:**
- `api_partners`
- `api_credentials`
- `api_access_logs`
- `partner_settlements`

## Deployment Strategy (Kubernetes)

We will use a standard K8s deployment model:
1.  **Namespace:** `tripura-tourism`
2.  **Deployments:** One Deployment per service (e.g., `auth-service`, `catalog-service`).
3.  **Services:** ClusterIP services for internal communication.
4.  **Ingress:** Ingress resource to route external traffic to appropriate services (e.g., `/api/auth` -> `auth-service`, `/api/bookings` -> `booking-service`).
5.  **ConfigMaps/Secrets:** For environment variables and DB credentials.

## Implementation Steps

### Phase 1: Foundation
- [ ] Set up a monorepo or polyrepo structure.
- [ ] Define shared libraries (e.g., standardized error handling, logging, auth middleware).

### Phase 2: Service Migration (Iterative)
#### [NEW] `services/auth`
- Implement FastAPI app with JWT logic.
- Migration script to move User tables to Auth DB.

#### [NEW] `services/catalog`
- CRUD APIs for Destinations/Packages.
- Migration script for Content tables.

#### [NEW] `services/inventory`
- Availability check and reserve APIs.

#### [NEW] `services/booking`
- Booking workflow implementation.

#### [NEW] `services/payment` & `services/partner`
- Standalone services for finance and B2B.

### Phase 3: Kubernetes Manifests
- [ ] Create `k8s/` directory.
- [ ] Create `deployment.yaml` and `service.yaml` for each microservice.
- [ ] Create `ingress.yaml` for routing.

## Verification Plan
### Automated Tests
- **Unit Tests:** Pytest for each service logic.
- **Integration Tests:** Docker Compose environment spinning up all services and running end-to-end flows.
- **Contract Tests:** Ensure APIs between services match expectations.

### Manual Verification
- Deploy to a local Kind/Minikube cluster.
- Run a full booking flow:
    1.  Login (Auth Service)
    2.  Search Destination (Catalog Service)
    3.  Check Availability (Inventory Service)
    4.  Create Booking (Booking Service)
    5.  Make Payment (Payment Service)
