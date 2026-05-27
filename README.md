# Multi-Tenant Transactional SaaS Platform

A production-grade tenant-isolated transactional system built with strict domain boundaries and server-authoritative state.

This project is intentionally engineered as a **correctness-first SaaS architecture**, not a feature tutorial.

The goal is structural integrity:
- Tenant isolation by construction
- Explicit domain ownership
- Guard-driven authorization
- No client-trusted transactional state
- Layered responsibility enforcement

---

# System Identity

This is **not** a marketplace.

This is a **multi-tenant SaaS platform** where:

- The platform owns the master product catalog
- Tenants are provisioned products through entitlement records
- Stock exists per tenant (not globally)
- Users operate inside a tenant context
- Cart and future checkout flows are strictly tenant-scoped
- Cross-tenant leakage is structurally impossible

---

# Non-Negotiable Invariants

## 1. Tenant Context Is Mandatory

Every business operation derives from the authenticated actor.

The client never provides `tenantId`.

Execution model:

Identity → Role → Tenant → Domain Execution

If tenant context is missing, execution must fail.

---

## 2. Strict Layered Architecture

All features follow this structure:

UI  
↓  
API Route (transport only)  
↓  
Validators (shape checking)  
↓  
Mappers (DTO → domain shape)  
↓  
Guards (authorization + invariants)  
↓  
Domain (business logic)  
↓  
Storage (persistence)

### Responsibilities

| Layer | Responsibility |
|-------|---------------|
| UI | Express intent only |
| Route | Orchestrate flow, never decide |
| Validators | Validate external input shape |
| Mappers | Transform DTOs |
| Guards | Enforce permissions and invariants |
| Domain | Own all business logic |
| Storage | Persist and retrieve only |

Routes never contain business rules.  
UI never owns transactional state.

---

## 3. Server Is Source of Truth

- No localStorage cart
- No client stock validation
- No client-side tenant scoping
- No trusting browser state

All mutations round-trip through the domain.

---

## 4. Actor-Based Access Model (Critical)

All domain execution is actor-driven.

An execution context (`AccessActor`) is derived at the route layer and passed into domain functions where required.

Actor types:

- Tenant actor → { userId, tenantId, role }
- Superadmin actor → { userId }

This enables:

- Explicit tenant scoping
- Superadmin has global visibility and can perform membership lifecycle actions across all tenants
- Elimination of implicit trust in routes

Key principle:

Authorization is not only enforced at the route level.
The domain must re-check visibility and invariants using the actor.

This prevents:

- Cross-tenant data leakage
- Unauthorized state mutations

---

# Technology Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Material UI (MUI)
- Cookie-based JWT authentication (httpOnly)
- In-memory storage (dev simulation of database + observability metrics)
- Manual domain layering (no ORM abstraction)

The architecture is explicit by design.

---

# Domain Overview

## Authentication

- Cookie-based JWT

- Membership roles (tenant-scoped):
  - customer
  - staff
  - admin

- Superadmin (platform-level capability):
  - Not a membership role
  - Operates without tenant context
  - Can view and perform membership lifecycle actions across all tenants
  - Can upgrade roles via admin routes

- Actor-based access model:
  - Tenant users operate via membership (tenantId + role)
  - Superadmin operates without tenant context
  - Execution context is derived as an AccessActor

- Guard-driven authorization:
  - requireAccess → flexible (tenant + superadmin, used for read operations and membership lifecycle actions)
  - requireMembershipRole → strict (tenant-only, used for tenant-scoped mutations where superadmin is not allowed)

- No permission tables unless domain pressure requires it

Authorization dimensions:
1. Identity
2. Role
3. Session mode (direct vs assumed)

---

## Membership & Profile System

### Membership Model

Membership represents a user's relationship with a tenant.

Each membership includes:

- userId
- tenantId
- role (customer | staff | admin)
- status (PENDING | APPROVED | REJECTED | REVOKED | EXPIRED)
- timestamps

### Lifecycle Invariants

Allowed transitions:

- PENDING → APPROVED
- PENDING → REJECTED
- APPROVED → REVOKED

Disallowed transitions are structurally blocked at the domain level.

### Visibility Rules

- Tenant users can only access memberships within their tenant
- Superadmin can view all memberships across tenants
- Domain enforces visibility using actor context (not just route guards)

### Membership Request Constraints

- A user must have a complete profile before requesting membership
- This is enforced at domain level (not UI-only)

### Profile System

User profiles contain:

- fullName
- email
- addressText
- phone (derived from auth)

Profile rules:

- Profile is required before entering tenant system
- Profile completeness is validated in domain before membership creation
- Profile APIs are user-scoped (no cross-user access)

### Session Model

- A user may have multiple memberships
- Exactly one active membership is selected at a time
- Tenant context is derived from active membership
- Superadmin operates without tenant context

System guarantees:

- No tenant operation executes without valid context
- Session switching is explicit and server-authoritative

---

## Product Catalog (Platform-Owned)

Products are platform entities.

They:
- Have no tenantId
- Have no stock
- Are created/updated only by superadmin
- Represent the canonical catalog

Products answer:
> What exists?

---

## TenantInventory (Entitlement Layer)

TenantInventory answers:
> What products can this tenant sell and how much?

Each record contains:

- tenantId
- productId
- enabled (boolean)
- stock (number)
- reserved
- timestamps

This layer replaces the old multi-vendor model entirely.

## Reservation Accounting

TenantInventory now enforces atomic reservation accounting.

Each record maintains two quantities:

- `stock` — physical inventory owned by the tenant
- `reserved` — quantity currently locked by open orders

Derived invariant:

available = stock − reserved

Reservation lifecycle:

OrderCreated → reserve stock  
OrderPaid → commit reservation (deduct stock)  
OrderCancelled / OrderExpired → release reservation

This guarantees that stock cannot be oversold even during concurrent checkout attempts.

---

## Storefront Model

Storefront is tenant-scoped and SSR.

The visible product list is:

Product (platform catalog)  
JOIN  
TenantInventory (enabled + stock)

Only products that:
- Are enabled for tenant
- Have stock > 0

are visible in storefront listing.

There is **no separate PublicProduct abstraction** anymore.
The storefront view is a derived join model.

---

## Cart Domain (Server Authoritative)

Cart is:

- Tenant-scoped
- Server-stored
- One cart per tenant
- Never persisted in browser

## Stock Enforcement

When adding or updating quantity:

1. Product existence validated
2. TenantInventory record required
3. enabled must be true
4. quantity ≤ stock must hold

If violated:
- CartStockExceededError
- CartProductNotProvisionedError (separate domain error)

UI mirrors domain constraints but never replaces them.

---

## Checkout Transaction

Checkout converts a cart into a transactional order while guaranteeing
inventory consistency.

Execution flow:

Cart  
↓  
Checkout Application Service  
↓  
TenantInventory Stock Reservation  
↓  
Order Creation (`status = RESERVED`)  
↓  
Cart Clearing

Reservation occurs **before order creation**.

This ensures the invariant:

Every RESERVED order must already hold inventory.

---

## Orders Domain

Orders represent **tenant-scoped transactional records**.

Each order contains:

- `orderId`
- `tenantId`
- `userId`
- items (snapshot of product name + price)
- total
- payment mode
- order status
- timestamps

Order Status:

- RESERVED
- PAID
- PICKED_UP
- CANCELLED
- EXPIRED
- REFUNDED

---

## Payment Lifecycle

Payments are now modeled as a separate domain with an asynchronous confirmation boundary.

Flow:

Payment Recorded (PENDING)  
↓  
Payment Confirmed (CONFIRMED)  
↓  
Order transitions to PAID

Order state changes are strictly triggered by confirmed payments.

The system guarantees:

- Orders cannot become PAID without confirmed payment
- Payment and order lifecycles are decoupled but consistent
- Payment records are immutable once created (status may transition)

This enables support for real-world payment delays (UPI, card processing, etc.).

---

# Architectural Guarantees

- No cross-tenant access
- No client-side stock manipulation
- No bypass of domain rules
- Domain errors are the single source of HTTP truth
- Routes are orchestration only
- All business logic is centralized
- All cross-aggregate inconsistencies are detectable and recoverable through reconciliation
- Domain enforces tenant visibility using actor context
- Lifecycle transitions are invariant-protected at domain level
- Profile completeness is enforced before membership creation
- Superadmin has global visibility and can perform membership lifecycle actions across all tenants, including role upgrades via admin routes
- System correctness is enforced by domain invariants, not by UI or route assumptions
- Analytics is derived strictly from historical data (no live dependency)
- Audit logs provide complete system traceability
- Notifications are event-driven and idempotent
- All requests are validated at the boundary before domain execution
- All read operations are bounded via explicit query limits
- No unbounded dataset is returned from API endpoints
- Background execution is idempotent and invariant-safe
- Tenant isolation is enforced at domain level and verified through automated test suites
- Data export reflects deterministic snapshot state, not live mutable state
- Data export is the only controlled exception to bounded reads, as it requires full snapshot extraction
- Observability is boundary-scoped and does not leak into domain logic

---

The system currently implements the core backbone of a transactional SaaS platform.

The system now supports asynchronous payment processing and full order lifecycle control,
bringing it closer to real-world transactional systems where payment confirmation is not instantaneous.

# Implemented capabilities

• Tenant-isolated execution model
• Platform-owned catalog with tenant entitlement layer
• Server-authoritative cart with domain stock enforcement
• Checkout application service converting carts into transactional orders
• Order aggregate with strict tenant binding and snapshot item model
• Lifecycle-driven order state machine
• Typed domain event system with centralized dispatching, enabling cross-domain reactions, audit projection, and notification delivery
• Payment domain with asynchronous confirmation boundary
• Immutable payment recording with method tracking (CASH / UPI / CARD / NET_BANKING)
• Manual cancel / expire / refund flows with strict state guard enforcement
• Staff POS module supporting direct order creation (cart bypass)
• Staff fulfillment dashboard for lifecycle management
• Customer order history (SSR, tenant-bound)
• Server-rendered receipt system (printable view)

The platform now supports a complete transactional pipeline:

Product Catalog
↓
TenantInventory (entitlement + stock)
↓
Cart (server authoritative)
↓
Checkout Service
↓
Order Aggregate
↓
Order State Machine
↓
Domain Events

This structure now safely supports cross-aggregate consistency mechanisms such as reconciliation,
audit logging, and future analytics without violating domain boundaries.

---

# Current Implemented Steps

### Completed Foundations

- Next.js + TypeScript scaffold
- Strict layered architecture
- Git workflow (main / dev / feature)
- JWT auth with httpOnly cookies
- Role system hardening
- Tenant entity + isolation model
- Platform-owned product catalog
- TenantInventory entitlement model
- SSR storefront
- Server-authoritative cart
- Stock enforcement in cart domain
- Quantity controls with UI mirroring domain rules

---

## Step 1 — Checkout Application Service

Completed.

Capabilities introduced:

- Cart → Order transactional flow
- Tenant-scoped order creation
- Stock reservation through TenantInventory
- Cart clearing after successful checkout
- Orders domain and storage
- Tenant-isolated order retrieval
- Orders UI pages

Transaction pipeline:

Cart → Checkout Service → Create Order → Reserve Inventory → Clear Cart

---

## Step 2 — Order Aggregate Implementation

Completed.

The Order aggregate is now implemented as a tenant-bound transactional entity.

Capabilities introduced:

- Strict tenant binding for all orders
- Order item snapshot model (price + name captured at order time)
- Aggregate invariants enforced inside the domain
- Order totals computed from item snapshots
- Immutable transactional record structure

Aggregate guarantees:

- Orders cannot exist without items
- Item quantity must be > 0
- Order total must equal the sum of order items
- Orders cannot be accessed outside their tenant

The order domain now acts as the authoritative source of transactional truth.

---

## Step 3 — Order State Machine

Completed.

Orders now follow a lifecycle-driven state machine enforced inside the domain layer.

Allowed transitions:

RESERVED → PAID  
RESERVED → CANCELLED  
RESERVED → EXPIRED  
PAID → PICKED_UP  
PAID → REFUNDED

Capabilities introduced:

- Centralized transition engine for lifecycle enforcement
- Domain commands controlling all state changes
- Invalid transition protection through `InvalidOrderTransitionError`

Lifecycle commands introduced:

- `markOrderPaid`
- `cancelOrder`
- `expireOrder`
- `markOrderPickedUp`

---

## Step 4 — Atomic Inventory Reservation

Completed.

TenantInventory now enforces atomic reservation accounting
to prevent overselling.

Capabilities introduced:

- `reserveStock` mutation enforcing `available = stock - reserved`
- Reservation accounting through a `reserved` quantity
- Lifecycle-driven stock settlement

Inventory mutation model:

reserveStock → increase reserved  
commitStock → decrease reserved and deduct stock  
releaseStock → decrease reserved

Order lifecycle reactions:

OrderCreated → reserve inventory  
OrderPaid → commit reservation  
OrderCancelled / OrderExpired → release reservation

---

## Step 5 — Payment Recording Domain

Completed.

A dedicated payment domain is now introduced with an asynchronous confirmation boundary.

Capabilities introduced:

- Immutable payment record creation
- Payment method tracking (CASH, UPI, CARD, NET_BANKING)
- Separation of payment lifecycle from order lifecycle
- Idempotent payment confirmation flow
- Order state transition triggered only after confirmed payment

Payment lifecycle:

Payment Recorded (PENDING)
↓
Payment Confirmed (CONFIRMED)
↓
Order transitions to PAID

System guarantees:

- Orders cannot become PAID without confirmed payment
- Payment records are immutable once created
- Duplicate confirmations are safely ignored (idempotency)
- Payment domain owns all payment-related data and events

---

## Step 6 — Staff POS Module

Completed.

A tenant-scoped POS system is introduced for staff-driven order creation.

Capabilities introduced:

- Direct order creation bypassing cart
- Tenant-bound POS interface under (tenant)/pos
- Real-time stock validation using TenantInventory
- Server-authoritative order creation from POS flows
- Staff-only access enforced via role guards

Execution model:

POS Selection
↓
Direct Order Creation (RESERVED)
↓
Inventory Reservation
↓
Optional Payment Flow

System guarantees:

- POS cannot bypass inventory constraints
- All orders remain tenant-scoped
- POS follows the same domain invariants as checkout

---

## Step 7 — Staff Fulfillment Dashboard

Completed.

A tenant-scoped fulfillment interface is introduced for managing order lifecycle.

Capabilities introduced:

- Centralized order lifecycle management UI
- Staff-controlled transitions (PICKED_UP, etc.)
- State-aware action rendering (UI reflects allowed transitions)
- Integration with order domain state machine

Supported operations:

- Mark order as picked up
- View order details and status
- Execute lifecycle transitions safely

System guarantees:

- UI does not control state transitions
- Domain enforces all lifecycle rules
- Invalid transitions are structurally blocked

---

## Step 8 — Customer Order History (SSR)

Completed.

A tenant-bound SSR order history system is implemented.

Capabilities introduced:

- Server-rendered order listing per user
- Tenant-scoped order access
- Direct domain access from SSR (no client mediation)
- Clean separation of read vs write concerns

Execution model:

SSR Page
↓
Service / Domain
↓
Tenant-scoped order retrieval

System guarantees:

- Users can only access their own orders
- Tenant isolation enforced at domain level
- No client-side data manipulation

---

## Step 9 — Order Receipt Generation

Completed.

A server-rendered, printable receipt system is implemented.

Capabilities introduced:

- SSR receipt view (/orders/[orderId]/receipt)
- Snapshot-based pricing (priceAtPurchase)
- Print-optimized layout (CSS print handling)
- Clean separation from application layout (no nav/UI noise)

Receipt model:

Order Snapshot
↓
SSR Rendering
↓
Print / Export (browser-driven)

System guarantees:

- Receipts reflect historical truth (not live data)
- Pricing is immutable and reproducible
- Output is deterministic and audit-friendly

---

## Step 10 — Cancel / Refund / Expire Flows

Completed.

Full lifecycle control is implemented with strict state guard enforcement.

Capabilities introduced:

- Manual order cancellation (RESERVED → CANCELLED)
- Order expiration (RESERVED → EXPIRED)
- Refund flow (PAID → REFUNDED)
- Guard-driven state transition enforcement
- State-aware UI actions

Extended state machine:

RESERVED → PAID
RESERVED → CANCELLED
RESERVED → EXPIRED
PAID → PICKED_UP
PAID → REFUNDED

System guarantees:

- Invalid transitions are impossible
- Refunds cannot occur before payment
- Expired/cancelled orders correctly release inventory
- All transitions go through domain guards

---

## Step 11 — Reconciliation System (Detection + Resolution + Idempotency)

Completed.

A tenant-scoped reconciliation system is implemented to detect and safely resolve
inconsistencies across Orders, Payments, and TenantInventory.

This introduces controlled system introspection and correction capabilities,
marking the transition from correctness-only design to resilience-aware design.

### 11A — Reconciliation Detection Engine

Capabilities introduced:

- Deterministic, read-only mismatch detection across:
  - Orders ↔ Payments
  - Payments without Orders
  - Inventory reservation correctness
- Tenant-scoped scanning
- Idempotent execution (pure function, no side effects)
- Structured mismatch reporting with expected vs actual state

Mismatch types:

- ORDER_PAYMENT_MISSING
- PAYMENT_WITHOUT_ORDER
- ORDER_PAYMENT_AMOUNT_MISMATCH
- ORDER_PAID_BUT_PAYMENT_NOT_CONFIRMED
- INVENTORY_NEGATIVE_RESERVED
- INVENTORY_RESERVED_EXCEEDS_STOCK
- INVENTORY_RESERVATION_MISMATCH

---

### 11B — Reconciliation Resolution Layer

Capabilities introduced:

- Manual, controlled correction flows for mismatches
- Strict policy-driven action enforcement (allowed actions per mismatch type)
- Domain-safe mutations (no direct storage patching except controlled override)
- Reuse of domain commands and lifecycle reactions
- Full audit traceability for every correction

Resolution actions:

- CONFIRM_PAYMENT
- CREATE_PAYMENT
- CANCEL_ORDER
- ADJUST_INVENTORY

---

### Inventory Correction Model (Critical Improvement)

Inventory reconciliation is implemented as a **non-destructive recomputation**:

reserved = Σ (quantities from RESERVED orders)

This guarantees:

- No data loss from manual fixes
- Alignment with actual order state
- Deterministic recovery from inconsistencies

---

### Idempotency Layer (Execution Safety)

Resolution operations are idempotent using an idempotency key:

- Duplicate execution is safely ignored
- Protects against retries, double-clicks, and network replays
- Ensures "effectively-once" mutation behavior

---

### Audit Logging

All reconciliation actions are recorded with:

- actor identity
- tenant context
- action type
- entity reference
- metadata (before/after state, reason)

This enables traceability, debugging, and future compliance layers.

---

### System Guarantees Introduced

- Detection is deterministic and side-effect free
- Resolution is policy-controlled and invariant-safe
- Inventory consistency can always be recomputed
- Duplicate resolution attempts do not corrupt state
- All corrections are auditable

---

### Architectural Impact

Step 11 introduces:

- Cross-aggregate validation (Orders ↔ Payments ↔ Inventory)
- Controlled override paths under strict domain boundaries
- First-class execution safety (idempotency)
- Foundation for future:
  - automated reconciliation (Step 11C evolution)
  - analytics correctness (Step 13)
  - audit-driven observability (Step 14)

---

## Step 12 — Inventory Monitoring & Controlled Adjustment

Completed.

Step 12 introduces platform-level inventory observability and correction,
extending the system from inconsistency detection (Step 11) to controlled
inventory management under strict domain invariants.

---

### 12A — Low-Stock Detection Service

A deterministic, read-only monitoring layer derived from TenantInventory.

Capabilities introduced:

- Tenant-scoped low-stock detection using consistent inventory snapshots
- Derived invariant: available = stock − reserved
- Threshold-based detection: available ≤ LOW_STOCK_THRESHOLD
- No mutation or side-effects (pure read model)
- Fully deterministic output

This follows the same principle as reconciliation:

detect → do not mutate

---

### 12B — Stock Adjustment Flows

A controlled, platform-level mutation layer for correcting tenant inventory.

Capabilities introduced:

- Superadmin-triggered stock adjustments (platform control plane)
- Explicit tenant-scoped execution via route parameters
- Idempotent execution using idempotency keys
- Strict domain enforcement:
- stock ≥ 0
- stock ≥ reserved
- Explicit input requirement (no implicit increments)
- Full audit logging of all adjustments

---

### Execution Safety

- Idempotency:
- enforced via idempotency key tracking
- duplicate execution safely ignored
- Concurrency:
- handled via atomic update pattern (domain-level)
- Retry safety:
- operations are idempotent and safe to re-execute

---

### System Reliability

- Observability:
- audit logs capture all corrective actions
- Reconciliation integration:
- Step 11 detects inconsistencies
- Step 12 enables safe correction
- Deterministic behavior:
- no hidden or implicit mutations

---

### Data Integrity

- Domain-level invariant enforcement:
- stock cannot be negative
- stock cannot fall below reserved
- Runtime input validation (not only TypeScript)
- No direct storage mutation outside domain layer

---

### UI / UX Principles

- No implicit mutation (default increment removed)
- Explicit admin input required for stock updates
- Inline validation instead of runtime exceptions
- Domain errors surfaced as user-facing feedback
- Platform-scoped UI (inventory managed by superadmin)

---

### System Boundary Clarification

Inventory is a platform-managed allocation, not a tenant-owned resource.

Implications:

- Stock control belongs to platform (superadmin)
- Tenant-facing UI remains read-oriented
- All inventory mutations occur in platform execution plane

---

## Step 13 — Tenant Analytics Service (Snapshot-Based Read Model)

Completed.

A tenant-scoped analytics service is introduced as a pure read model
derived strictly from historical transactional data.

### Design Principle

Analytics must never depend on live product or inventory state.

All metrics are computed from:

- Orders
- Order items (snapshot pricing)
- Order lifecycle state

### Capabilities introduced

- Tenant-scoped sales aggregation
- Revenue computation from immutable order totals
- Inventory insights derived from order consumption patterns
- SSR-compatible analytics endpoints
- Deterministic read model (no side effects)

### Data Model

Analytics is computed from:

Orders → Items → Snapshot price + quantity

Not from:

- Product catalog
- TenantInventory (live state)

### System guarantees

- Historical correctness (no drift)
- Reproducibility of metrics
- Independence from mutable entities
- Safe integration with audit and reconciliation layers

### Architectural Role

Step 13 establishes:

- Read-model layer on top of transactional system
- Foundation for dashboards and reporting
- Clean separation between transactional truth and analytical projections

---

## Step 14 — Audit Logging Layer (Append-Only Event Projection)

Completed.

An append-only audit system is introduced as a cross-domain projection layer
derived strictly from domain events.

### Core Principle

Every state-changing operation must emit a domain event,
and every event must produce exactly one audit log entry.

### Capabilities introduced

- Append-only audit storage
- Actor identity tracking (userId)
- Tenant context tracking
- Event-type normalization (ORDER_CREATED, MEMBERSHIP_APPROVED, etc.)
- Explicit state transitions (from → to)
- Structured metadata for domain-specific events

### Event Coverage

All lifecycle events are captured:

- Orders (created, paid, cancelled, expired, picked up, refunded)
- Membership lifecycle (requested, approved, rejected, revoked, role updated)
- Inventory adjustments
- Payment confirmations

### Data Model

Each audit entry contains:

- eventType
- actorId
- tenantId
- entity reference (orderId, membershipId, etc.)
- from → to transition
- metadata (domain-specific context)
- timestamp

### System guarantees

- Immutable history (no updates or deletes)
- One-to-one mapping between events and logs
- Full timeline reconstruction capability
- Cross-domain traceability

### Architectural Role

Step 14 introduces:

- System observability
- Compliance foundation
- Debugging and forensics capability
- Backbone for future governance layers

---

## Step 15 — Notification Service Abstraction (Event-Driven)

Completed.

A notification system is introduced as a pure event-driven projection layer.

### Core Principle

Notifications are derived strictly from domain events.
No route or UI layer triggers notifications directly.

### Capabilities introduced

- Event → Notification mapping layer
- Idempotent notification dispatch
- Adapter-based delivery system
- Channel abstraction (currently console-based delivery; external channels are adapter-extensible)
- Reference-based linking (orderId, membershipId, etc.)

### Notification Model

Each notification contains:

- notificationId
- tenantId
- userId
- channel
- title
- message
- reference (entity linkage)
- createdAt

### Supported Events

Notifications are generated for:

- Order lifecycle (created, paid, cancelled, expired, picked up, refunded)
- Membership lifecycle (requested, approved, rejected, revoked)

### Delivery Architecture

- Dispatcher receives domain events
- Mapper converts events → notifications
- Adapter delivers per channel

### System guarantees

- No duplicate notifications (idempotent dispatch)
- No direct UI-triggered side effects
- Clean separation from domain logic
- Future extensibility (email, push, etc.)

### Architectural Role

Step 15 introduces:

- User-facing feedback layer
- Event-driven side effects
- Foundation for external integrations

---

## Step 16 — Security Hardening Pass (Request Boundary Enforcement)

Completed.

A system-wide security layer is introduced at the request boundary.

### Core Principle

All requests must pass through a centralized guard layer
before reaching domain logic.

### Capabilities introduced

- Centralized request guard (`guardRequest`)
- CSRF protection for all mutation routes
- Cookie-based authentication enforcement
- Rate limiting (global + OTP-specific)
- Strict route-level authentication enforcement

### Execution Model

Request
↓
guardRequest (auth + rate limit + CSRF)
↓
Authorization guards (requireAccess / requireMembershipRole)
↓
Domain execution

### Security Guarantees

- No unauthenticated route access where not allowed
- No CSRF vulnerability on mutations
- No uncontrolled request flooding (rate limiting)
- No bypass of guard-driven authorization

### Authorization Audit Integrity

- All mutations tied to authenticated actors
- Actor identity consistently propagated
- Alignment with audit logging (Step 14)

### Architectural Role

Step 16 establishes:

- Secure execution boundary
- Consistent request validation
- Foundation for production-grade deployment

---

## Step 17 — Background Job Runner (Asynchronous Execution Layer)

Completed.

A generic, idempotent background job system is introduced for executing
asynchronous domain workflows and lifecycle-driven transitions.

### Core Principle

All asynchronous execution must be:

- idempotent
- deterministic
- invariant-safe
- decoupled from domain logic

### Capabilities introduced

- Job runner abstraction for async execution
- Central execution loop for processing registered jobs
- Scheduled lifecycle transitions:
  - auto-expire RESERVED unpaid orders
  - auto-expire PENDING memberships
- Event-driven side-effect execution (notifications)
- Retry-safe execution model
- Deduplication via idempotency guarantees
- Separation of:
  - domain intent generation
  - side-effect execution (adapter-driven)

### System guarantees

- No duplicate side effects
- Safe retry behavior
- No violation of domain invariants
- Deterministic job execution

### Architectural Role

Step 17 introduces:

- asynchronous execution layer
- lifecycle automation
- foundation for background processing (cron / queues in Step 21)

---

## Step 18 — Data Export Service (Deterministic Snapshot Export)

Completed.

A tenant-scoped export system is introduced for generating deterministic CSV outputs.

### Core Principle

Exports must reflect **consistent historical truth**, not live mutable state.

### Capabilities introduced

- Tenant-scoped CSV export
- Deterministic snapshot generation
- Alignment with reconciliation data model
- Structured export for:
  - orders
  - reconciliation reports
- File download via API (binary response)

### Design constraints

- Export reads full dataset (intentionally unbounded)
- No partial / paginated export at this stage
- Snapshot correctness guaranteed

### System guarantees

- Export reflects stable transactional state
- No dependency on live product or inventory state
- Reproducible outputs

### Architectural Role

Step 18 introduces:

- data portability layer
- reporting capability
- foundation for large-scale export (streaming in future)

---

## Step 19 — Multi-Tenant Isolation Test Suite

Completed.

A system-wide isolation test suite is introduced to validate tenant boundaries
and prevent cross-tenant data leakage.

### Core Principle

Tenant isolation must be **provable**, not assumed.

### Capabilities introduced

- Automated test suite covering:
  - cross-tenant access attempts
  - data leakage scenarios
  - authorization boundary violations
  - concurrent execution isolation
- Domain-level isolation validation
- Guard enforcement verification

### Test coverage includes

- Orders
- Inventory
- Memberships
- Payments
- Reconciliation
- Concurrency scenarios

### System guarantees

- No cross-tenant read leakage
- No cross-tenant write mutation
- Guards correctly enforce access boundaries
- Concurrent operations remain isolated

### Architectural Role

Step 19 introduces:

- correctness verification layer
- regression protection for tenant isolation
- foundation for production trust guarantees

---

## Step 20 — Performance Pass (Bounded Reads & Query Safety)

Completed.

A system-wide performance pass is introduced to enforce bounded data access
and prepare the system for DB-backed execution.

### Core Principle

All read operations must be **bounded and controlled**.

### Capabilities introduced

- Centralized query limits (`QUERY_LIMITS`)
- Bounded read contracts across all domains:
  - Orders
  - Products
  - Memberships
  - Inventory
  - Audit logs
- Limits applied at domain read layer (not UI or API slicing)
- Prevention of unbounded dataset retrieval

### Design decisions

- No pagination system introduced (data scale does not require it yet)
- No infinite scroll implementation
- No DTO/projection overengineering
- Limits are applied before transformation or enrichment to avoid processing unbounded datasets

### System guarantees

- No unbounded reads
- Controlled response size
- Memory safety
- DB-read readiness (future LIMIT pushdown)

### Architectural impact

- Domain read APIs now define query boundaries
- API layer no longer slices datasets
- Clear separation between:
  - bounded reads (Step 20)
  - loading strategy (future concern)

### Future alignment

Step 20 prepares for:

- Current implementation applies limits in domain; storage-level LIMIT pushdown will be introduced in Step 21 (DB migration)
- scalable read models
- pagination only when required by data scale

---

## Step 22 — Observability Layer (Boundary-Level Metrics)

Completed.

A lightweight observability layer is introduced to capture system behavior at execution boundaries without affecting domain logic.

### Core Principle

Observability must be:

- boundary-scoped (route, dispatcher, error handler)
- non-invasive (no domain coupling)
- approximate but meaningful
- safe to discard without affecting correctness

### Capabilities introduced

- Latency tracking (p50 / p95)
- Request rate measurement
- Error rate computation (normalized against traffic)
- User activity tracking (unique users per runtime window)
- Throughput calculation (requests/sec)
- Checkout conversion metrics:
  - OrderCreated → PaymentConfirmed ratio

### Instrumentation Points

Metrics are captured at:

- API route boundary (request + latency + user)
- Event dispatcher (domain event tracking)
- Central error handler (unexpected failures)

No instrumentation exists inside:

- domain layer
- storage layer

This preserves strict domain purity.

### Data Model

Metrics are stored in-memory using a bounded rolling buffer:

- Metrics → FIFO window (bounded)
- Users → bounded set (no eviction, capped growth)
- Uptime → process start reference

Derived metrics:

- latency percentiles (p50 / p95)
- errorRate = errors / requests
- throughput = requests / uptime
- checkoutSuccess = PaymentConfirmed / OrderCreated

### System Guarantees

- Zero impact on transactional correctness
- No dependency on database or persistence layer
- Safe under process restarts (metrics are ephemeral by design)
- Fully compatible with Step 21 (DB migration)
- No cross-layer leakage into domain logic

### Design Trade-offs

- Metrics are approximate (not durable)
- No long-term persistence
- No historical aggregation beyond runtime window

This is intentional:

Observability is designed for:

- validation
- performance measurement
- CV-grade metrics

Not for:

- production monitoring systems (future concern)

### Architectural Role

Step 22 introduces:

- execution visibility across system boundaries
- performance measurement capability
- validation layer for system behavior under load

It completes the system by enabling measurability without compromising correctness.

---

### Architectural Position

Step 11 → Detect inconsistencies  
Step 12 → Monitor + Correct inventory safely  
Step 13 → Analytics (read models on stable data)  
Step 14 → Audit logging (system traceability)  
Step 15 → Notifications (event-driven side effects)  
Step 16 → Security (request boundary enforcement)  
Step 17 → Background execution (idempotent async job runner)  
Step 18 → Data export (deterministic snapshot-based reporting)  
Step 19 → Isolation verification (tenant boundary test suite)  
Step 20 → Performance safety (bounded reads and query-shape enforcement)
Step 22 → Observability (boundary-level metrics capturing latency, request rate, error rate, user activity, throughput, and conversion across core transactional flows)

---

### Concurrency Safety

Inventory mutations are executed through a single storage mutation boundary,
ensuring read-modify-write operations remain atomic in the domain model.

### Cart Validation Improvement

Cart validation now respects **available stock** instead of raw stock.

Validation rule:

quantity ≤ (stock − reserved)

This prevents carts from temporarily exceeding inventory availability.

---

### Domain Events

The system emits typed domain events representing all state-changing operations.

Order lifecycle emits:

- `OrderCreated`
- `OrderPaid`
- `OrderCancelled`
- `OrderExpired`
- `OrderPickedUp`
- `OrderRefunded`

Additional domain events include:

- `PaymentConfirmed`
- `MembershipRequested`
- `MembershipApproved`
- `MembershipRejected`
- `MembershipRevoked`
- `MembershipRoleUpdated`
- `InventoryAdjusted`

These events decouple domains and establish integration points for:

- inventory lifecycle reactions
- payment → order synchronization
- audit logging (event projection)
- notifications (event-driven delivery)
- analytics (read-model derivation)
- reconciliation consistency checks

Application services do not perform cross-domain side effects directly.  
All side effects are derived from domain events through the dispatcher.

Cross-domain communication follows a minimal-data principle.

Domains exchange only the information required to enforce invariants.

Example:

- Orders domain receives `payment.method`
- Orders domain does not depend on the full Payment aggregate

This minimizes cross-domain coupling and preserves domain isolation.

---

### Event Dispatching Layer

All domain events are routed through a centralized dispatcher.

Responsibilities:

- Route events to reaction handlers (e.g., order lifecycle reactions)
- Project events into audit logs
- Trigger notification mapping and delivery

Execution model:

Domain emits event  
↓  
Central dispatcher receives event  
↓  
Reactions (side effects)  
↓  
Audit projection  
↓  
Notification projection

System guarantees:

- No direct side effects inside routes
- All cross-domain reactions are event-driven
- Audit and notifications remain consistent with domain state

---

### Event Ownership

Events are constructed only by the domain that owns the relevant data:

- Orders domain emits structural lifecycle events (OrderCreated, OrderPaid, etc.)
- Payments domain emits `PaymentConfirmed` (payment lifecycle event)

This prevents invalid event construction and ensures type-safe domain boundaries.

---

### Replayable Event Semantics

The system intentionally allows replayable command-outcome events for idempotent flows.

Example:

Repeated `confirmPayment()` calls may re-emit `PaymentConfirmed`
while preserving invariant-safe state transitions.

This reflects a deliberate design choice:

events may represent command outcomes rather than strictly unique historical transitions.

Downstream consumers are therefore designed to tolerate replay semantics safely.

---

### Current Transaction Pipeline

Cart  
↓  
Checkout Service  
↓  
Inventory Reservation  
↓  
Order Aggregate (RESERVED)  
↓  
Payment Recorded (PENDING)  
↓  
Payment Confirmation  
↓  
Order State Machine (PAID / REFUNDED / etc.)  
↓  
Inventory Commit / Release  
↓  
Domain Events  
↓  
Reconciliation System (detect + resolve inconsistencies across aggregates)  
↓  
Inventory Monitoring (low-stock detection)  
↓  
Controlled Inventory Adjustment (platform-driven, invariant-safe corrections)  
↓  
Analytics Layer (snapshot-based read model)  
↓  
Audit Logging (append-only event projection)  
↓  
Notification System (event-driven delivery)  
↓  
Security Layer (request boundary enforcement)  
↓  
Background Job Runner (scheduled lifecycle transitions + async execution layer)  
↓  
Data Export Service (deterministic snapshot-based CSV generation)  
↓  
Isolation Test Suite (system-wide tenant boundary validation)  
↓  
Performance Layer (bounded reads, query-shape enforcement, DB readiness)
↓  
Observability Layer (boundary-level metrics: latency, throughput, error rate, conversion)

---

# Upcoming Roadmap

21. Production readiness layer (Map → DB migration with transaction support, DB constraints, concurrency control, structured logging, observability, and deployment readiness)

Each step builds on previously locked invariants.

---

# Completed Roadmap

1. Checkout application service (tenant-scoped stock reservation + order creation from cart)
2. Order aggregate implementation (domain-level order model with strict tenant binding)
3. Order state machine enforcement (RESERVED → PAID → FULFILLED → CLOSED / EXPIRED / CANCELLED)
4. Atomic stock reservation + deduction inside TenantInventory domain
5. Payment recording domain (mode tracking: CASH / UPI / ONLINE, immutable payment log)
6. Staff POS module under (tenant) runtime (direct order creation bypassing cart)
7. Staff fulfillment dashboard (tenant-scoped order lifecycle management)
8. Customer order history (SSR, tenant-bound)
9. Order receipt generation (server-rendered printable view)
10. Manual cancel / refund / expire flows with state guard enforcement
11. Reconciliation system
   A. Detection engine (read-only, tenant-scoped mismatch detection across orders, payments, and inventory with idempotent scans and deterministic reporting)
   B. Resolution layer (manual/controlled correction flows for mismatches with invariant-safe adjustments and audit traceability)
12. Inventory monitoring & control
   A. Low-stock detection service (threshold-based, tenant-scoped monitoring using consistent inventory snapshots without mutating state)
   B. Stock adjustment flows (admin-triggered, idempotent stock corrections within TenantInventory domain enforcing stock ≥ reserved invariants)
13. Tenant analytics service (snapshot-based read model for sales, revenue, and inventory metrics strictly using historical order data, never live product data)
14. Audit logging layer: Append-only, cross-domain audit system derived from domain events and aligned with domain actions, recording actor identity, tenant context, immutable event entries, and explicit state transitions (from → to) for all state-changing events (including role changes), where all state mutations must emit dedicated domain events that are projected into audit logs (one entry per event) with from/to populated, with structured metadata for domain-specific events (e.g., approval actions like approvedBy, approvedAt), enabling full historical reconstruction and timeline queries of all domain lifecycle events
15. Notification service abstraction (event-driven notifications triggered strictly from domain events with idempotent dispatch and adapter-based delivery design)
16. Security hardening pass (request-level protection via CSRF, cookies, rate limiting + authorization audit ensuring strict guard-driven role and tenant enforcement)
17. Background job runner: Generic, idempotent, state-machine-safe asynchronous execution layer for lifecycle-driven domain jobs and event-driven side-effects, supporting scheduled domain transitions (e.g., auto-expire unpaid RESERVED orders, auto-expire unapproved PENDING memberships after timeout) and execution of side-effect intents (e.g., notifications), with retry safety, deduplication, and deterministic behavior, while preserving strict separation between domain logic, intent generation, and side-effect execution through adapter boundaries
18. Data export service (tenant-scoped deterministic CSV generation aligned with reconciliation data ensuring snapshot correctness and pagination readiness)
19. Multi-tenant isolation test suite (systematic validation of tenant boundaries including cross-tenant access attempts, concurrent operations, and leakage prevention)
20. Performance pass (bounded reads, query-shape enforcement, and DB-ready data access without over-fetching, without introducing pagination prematurely)
22. Lightweight, boundary-level observability layer capturing latency, request rate, error rate, user activity, throughput, and conversion metrics across core transactional flows using in-memory instrumentation at route, dispatcher, and error boundaries while preserving domain purity and full compatibility with future DB migration

---

# Development Data

Storage uses globalThis maps to survive Next.js hot reload.

Seed logic runs once at initialization.

This simulates persistence without introducing database complexity yet.

---

# Project Structure (Conceptual)

The system is organized around **execution planes**, **domain ownership**, and **strict layering boundaries**.

---

## 1. Execution Planes

The application is organized into explicit execution planes with isolated routing,
authorization semantics, and runtime responsibilities.

This separation prevents semantic overlap between:

- authentication
- onboarding
- tenant participation
- platform authority
- commerce discovery
- operational capability access

Each plane owns:

- its routing semantics
- its authorization model
- its operational boundaries
- its UI/runtime responsibilities

---

### Public Plane

Unauthenticated public-facing surface.

Responsibilities:

- landing/discovery surface
- authentication entrypoint
- future marketing/commerce presentation layer

Routes:

`app/page.tsx`  
`app/login/*`

Characteristics:

- no tenant context
- no membership context
- no navbar/session shell
- no operational capabilities
- no authenticated runtime state

---

### Identity / Onboarding Plane

Authenticated but non-operational user surface.

Responsibilities:

- profile completion
- membership requests
- active tenant switching

Routes:

`app/profile/*`

Characteristics:

- requires authentication
- does NOT require active tenant membership
- superadmin excluded
- onboarding-oriented, not operational
- isolated from commerce/runtime capabilities

Guard model:

`<AuthGuard>`

Behavior:

- unauthenticated → `/login`
- superadmin → `/platform/tenants`
- authenticated tenant actors → allowed

---

### Tenant Capability Plane

Tenant-scoped operational runtime.

Handles all tenant-scoped operations.

Capabilities include:

- Home commerce surface (projection-oriented storefront/runtime feed)
- SSR tenant-scoped commerce discovery
- cart
- checkout
- orders (history, receipt)
- POS (staff)
- fulfillment
- analytics
- reconciliation (read + resolution UI)
- memberships
- inventory visibility
- staff/admin operations

Routes:

`app/(tenant)/*`

Characteristics:

- requires active approved membership
- capability-scoped authorization
- tenant isolation enforced structurally
- superadmin redirected out of tenant plane
- commerce-oriented runtime
- operational execution surface

Authorization is explicitly declared per module through layout-scoped guards.

Examples:

- Home → customer/staff/admin
- POS → staff
- Reconciliation → staff
- Inventory → admin/staff

Guard model:

`<TenantGuard allowRoles=[...]>`

Behavior:

- unauthenticated → `/login`
- superadmin → `/platform/tenants`
- no active membership → `/profile`
- role mismatch → `/home`

Storefront direction:

The storefront is evolving toward a compositional commerce-discovery surface rather than a flat product listing page.

The `/home` surface is intended to support:

- recommendations
- featured products
- category sections
- search-result mode
- recently purchased products
- projection-driven commerce feeds

while preserving a stable commerce shell and tenant-scoped execution semantics.

---

### Platform Authority Plane

Platform-level superadmin runtime.

Handles platform-level control and cross-tenant operations.

Capabilities include:

- product catalog management
- tenant lifecycle management
- tenant inventory provisioning
- low-stock monitoring
- stock adjustment
- cross-tenant administration

Routes:

`app/platform/*`

Characteristics:

- superadmin-only
- no tenant participation semantics
- isolated from onboarding and commerce runtime
- platform authority execution surface

Guard model:

`<PlatformGuard>`

Behavior:

- unauthenticated → `/login`
- tenant actors → `/home`
- superadmin → allowed

---

### API Layer (Transport Only)

All routes are transport-level adapters.

Routes:

`app/api/*`

Responsibilities:

- request orchestration
- transport normalization
- authentication extraction
- response serialization
- delegation into domain/service layers

API routes explicitly do NOT own:

- business logic
- invariant enforcement
- transactional correctness
- authorization assumptions

All business rules remain inside:

- guards
- domain
- application services

The API layer defines explicit transport contracts through structured response envelopes.

Examples:

- `{ order }`
- `{ membership }`
- `{ tenant }`
- `{ metrics }`

Includes:

- Tenant APIs (cart, orders, checkout, payments)
- Platform APIs (admin/tenants/*, inventory control)
- Reconciliation APIs (detect + resolve)

Architectural guarantees:

- routes are orchestration-only
- routes never own invariants
- transport contracts are explicit and typed
- domain remains source of truth
- client never controls transactional state

---

## 2. Core System (Domain Layer)

All business logic lives inside `lib/`.

Each module is a **self-contained domain boundary**.

### Service Layer Legitimacy

Services are introduced only when they provide meaningful application-level responsibility such as:

- orchestration across aggregates
- execution-plane boundaries
- transport normalization
- policy coordination
- near-term evolution pressure (pagination, filtering, caching, etc.)

The system intentionally avoids service files that merely rename domain functions without adding architectural value.

This preserves:

- clear ownership boundaries
- lower indirection cost
- stronger structural clarity

---

### Domain Modules

- auth
- tenants
- memberships
- profiles
- products (platform-owned catalog)
- tenantInventory (entitlement + stock layer)
- cart
- checkout
- orders
- payments
- reconciliation
- analytics
- audit
- notifications
- jobs (background job runner and async execution layer)
- export (deterministic data export service)
- security (implicit via requestGuard layer)

---

### TenantInventory (Critical Aggregate)

Handles:

- stock
- reserved quantities
- reservation lifecycle
- low-stock detection (read model)
- stock adjustment (controlled mutation)

Submodules:

- domain (core invariants)
- reservations (lifecycle mutations)
- adjustment (admin mutation flow)
- lowStock (read-only detection)
- idempotency (execution safety)
- guards / validators / mappers
- storage

---

### Reconciliation System

Cross-aggregate consistency layer:

- detection (read-only)
- resolution (controlled mutation)
- policy enforcement
- idempotency

---

### Audit System

- append-only logging
- actor + tenant context
- mutation traceability

---

## 3. Client API Layer

Typed client wrappers for API calls:

```
lib/api/*
```

- No business logic
- Mirrors server routes
- Enforces request/response contracts

---

### Transport Contract Strategy

All client wrappers are designed around explicit typed transport contracts.

Principles:

- Every route returns structured resource-oriented envelopes:
  - `{ order }`
  - `{ tenant }`
  - `{ membership }`
  - `{ metrics }`
  - etc.

- Mutation endpoints return resulting resources instead of fragmented metadata (`success`, `orderId`, etc.) wherever meaningful.

- Wrappers explicitly type API payloads using `apiFetch<T>()`.

- Transport payloads are treated as compile-time contracts rather than runtime assumptions.

This enables:

- Structural refactor safety
- Compile-time detection of payload mismatches
- Predictable API semantics across UI and route boundaries

The system intentionally evolves toward:

Route Contract
↓
Typed Wrapper Contract
↓
Typed UI Consumption

with minimal implicit or untyped transport behavior.

---

## 4. UI Layer (Components)

Pure UI components:

```
components/*
```

Principles:

- no business logic
- no invariant ownership
- no transactional authority
- express user intent only

Grouped by execution surface and domain ownership.

Execution surfaces (e.g. `home`) compose runtime experiences.

Domain-oriented component groups (e.g. `products`) contain reusable business-domain UI primitives consumed by those surfaces.

Examples:

- admin
- analytics
- audit
- auth
- cart
- checkout
- export
- guards
- home
- layout
- lowStock
- memberships
- orders
- pos
- products
- profile
- reconciliation
- session
- tenant-provisioning

Layout-oriented persistent UI surfaces (e.g. Navbar, CartWidget) belong under:

```
components/layout/*
```

instead of domain-oriented namespaces.

---

## 5. Shared Types

Global contracts across layers:

```
types/*
```

Includes:

- domain entities (order, payment, tenantInventory)
- event types (orderEvent)
- reconciliation models
- stock adjustment + low-stock types
- auth/session types

---

## 6. Cross-Cutting Infrastructure

### Auth & Guards

The system uses explicit execution-plane guards instead of a single generic authorization layer.

Guards are applied at layout boundaries instead of page-level duplication.

This establishes:

- explicit execution ownership
- capability-scoped authorization
- centralized redirect semantics
- render-safe client authorization boundaries

Guard types:

#### AuthGuard

Used for authenticated onboarding/identity surfaces.

Responsibilities:

- require authentication
- exclude superadmin
- redirect unauthenticated users to `/login`

Used for:

- `/profile`

---

#### TenantGuard

Used for tenant operational capability surfaces.

Responsibilities:

- require active approved membership
- enforce tenant-scoped role capabilities
- redirect:
  - unauthenticated → `/login`
  - superadmin → `/platform/tenants`
  - non-member → `/profile`
  - role mismatch → `/home`

Authorization is explicitly capability-scoped per module.

Examples:

- customer/staff/admin → storefront
- staff → POS
- staff → reconciliation

---

#### PlatformGuard

Used for platform authority runtime.

Responsibilities:

- require superadmin
- redirect tenant actors to `/home`
- redirect unauthenticated users to `/login`

Used for:

- `app/platform/*`

---

### Access Control Strategy

Two distinct server-side authorization guard types exist:

1. requireAccess (flexible)
   - Allows tenant users (role-checked)
   - Allows superadmin (bypass)
   - Used for read operations and global membership lifecycle actions

2. requireMembershipRole (strict)
   - Requires active membership
   - Enforces tenant-scoped role
   - Used for tenant-scoped lifecycle mutations (staff/admin only)

This establishes:

Read → flexible (superadmin allowed)  
Membership lifecycle → flexible (superadmin + tenant staff)  
Other writes → strict (tenant-only unless explicitly handled via admin routes)

This separation prevents unintended privilege escalation while keeping superadmin capabilities explicit and controlled.

---

### HTTP Layer

- centralized error handling
- domain error → HTTP mapping

---

### Observability Layer

- boundary-level instrumentation (routes, dispatcher, error handler)
- in-memory metrics collection (latency, throughput, error rate, conversion)
- no domain coupling
- no persistence dependency

---

### Contexts

Client-side application state and UI infrastructure:

- AuthContext
- CartContext (UI state only, not source of truth)
- SnackbarContext (global application feedback infrastructure)

The system intentionally separates:

- application state infrastructure
- presentational UI components

---

## 7. Data Layer (Current State)

- In-memory storage (Map-based)
- Domain-controlled mutation only
- No ORM abstraction

Future (Step 21):

- DB-backed persistence
- constraints + transactions
- concurrency control

---

## Structural Principles

- Domain owns all invariants
- Storage is passive
- Routes are transport-only
- UI expresses intent only
- No cross-domain leakage
- Read and write paths are separated
- Platform and tenant execution planes are isolated
- Domain never trusts route-level authorization blindly
- All cross-tenant access is explicitly guarded inside domain
- Read paths may normalize state (e.g., expiry) to reflect real-time truth
- Guards define access, domain enforces correctness
- Transport contracts are explicit and resource-oriented
- Compile-time correctness is preferred over runtime discovery
- Domain boundaries exchange only minimal required data
- Services exist only when representing meaningful application/use-case boundaries
- Thin alias wrappers without orchestration pressure are avoided
- Authentication, onboarding, tenant participation, and platform authority are treated as separate execution concerns
- Execution planes are isolated structurally, not merely through redirects or UI assumptions
- Authorization is execution-plane scoped, not globally generic
- Layout boundaries define runtime admission semantics
- Guards are applied at layout boundaries instead of page-level duplication
- Capability access is explicit, role-scoped, and declared per module
- Superadmin does not participate in tenant/member semantics
- Storefront is evolving toward a compositional commerce-discovery surface rather than a flat product listing

---

# Project Structure (Actual)

.
├── app
│   ├── (tenant)                     # Tenant capability runtime (member-scoped)
│   │   ├── analytics/
│   │   ├── audit/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── home/                    # Commerce discovery surface
│   │   │   ├── [productId]/
│   │   │   ├── layout.tsx           # Home capability boundary
│   │   │   └── page.tsx
│   │   ├── inventory/
│   │   ├── memberships/             # Staff membership management runtime
│   │   │   ├── [membershipId]/
│   │   │   └── layout.tsx
│   │   ├── orders/
│   │   │   └── [orderId]/receipt/
│   │   ├── pos/
│   │   │   └── layout.tsx           # Staff-only POS capability boundary
│   │   ├── reconciliation/
│   │   │   └── layout.tsx           # Staff reconciliation capability boundary
│   │   └── layout.tsx               # Shared tenant runtime shell
│   │
│   ├── api                          # Transport-only route layer
│   │   ├── admin                    # Platform authority APIs
│   │   │   ├── jobs/
│   │   │   ├── memberships/
│   │   │   ├── metrics/
│   │   │   ├── products/
│   │   │   └── tenants/
│   │   │       └── [tenantId]/
│   │   │           └── inventory/
│   │   │
│   │   ├── analytics/
│   │   ├── audit/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── export/
│   │   ├── memberships/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── profile/
│   │   ├── reconciliation/
│   │   └── tenants/
│   │
│   ├── login/                       # Public authentication entrypoint
│   ├── platform                     # Superadmin execution runtime
│   │   ├── jobs/
│   │   ├── memberships/
│   │   ├── products/
│   │   │   ├── [productId]/
│   │   │   └── new/
│   │   ├── tenants/
│   │   │   ├── [tenantId]/
│   │   │   │   └── inventory/
│   │   │   │       └── low-stock/
│   │   │   └── new/
│   │   └── layout.tsx               # Platform authority boundary
│   │
│   ├── profile/                     # Authenticated onboarding runtime
│   │   └── layout.tsx               # Auth-only onboarding boundary
│   │
│   ├── layout.tsx                   # Global application shell
│   ├── page.tsx                     # Public landing surface
│   └── ThemeRegistry.tsx
│
├── components                       # Pure UI layer (no business logic)
│   ├── admin/
│   │   ├── jobs/
│   │   ├── memberships/
│   │   └── products/
│   │
│   ├── analytics/
│   ├── audit/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── export/
│   ├── guards/                      # Execution-plane authorization guards
│   ├── layout/                      # Shared layout/runtime UI surfaces
│   ├── lowStock/
│   ├── memberships/
│   ├── orders/
│   ├── pos/
│   ├── products/                    # Reusable product-domain UI primitives
│   ├── profile/
│   ├── reconciliation/
│   └── tenant-provisioning/
│
├── contexts                         # Client-side UI/application state
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── SnackbarContext.tsx
│
├── hooks
│   └── useActiveMembership.ts
│
├── lib                              # Core system / domain layer
│   ├── analytics/
│   ├── api/                         # Typed client API wrappers
│   ├── audit/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── config/
│   ├── events/                      # Domain event dispatching
│   ├── export/
│   ├── http/
│   ├── jobs/                        # Background execution runtime
│   ├── mappers/
│   ├── memberships/
│   ├── notifications/
│   ├── orders/
│   ├── payments/
│   ├── pos/
│   ├── products/
│   ├── profiles/
│   ├── reconciliation/
│   ├── security/
│   ├── tenantInventory/
│   └── tenants/
│
├── tests                            # Isolation and correctness verification
│   ├── isolation/
│   └── setup.ts
│
├── types                            # Shared system contracts
│   ├── analytics.ts
│   ├── audit.ts
│   ├── auth.ts
│   ├── cart.ts
│   ├── checkout.ts
│   ├── domainEvent.ts
│   ├── export.ts
│   ├── job.ts
│   ├── lowStock.ts
│   ├── membership.ts
│   ├── metrics.ts
│   ├── notification.ts
│   ├── order.ts
│   ├── otp.ts
│   ├── payment.ts
│   ├── product.ts
│   ├── profile.ts
│   ├── reconciliation.ts
│   ├── reconciliationPolicy.ts
│   ├── reconciliationResolution.ts
│   ├── session.ts
│   ├── stockAdjustment.ts
│   ├── tenant.ts
│   └── tenantInventory.ts
│
├── docs/
├── public/
├── scripts/                         # Operational/load-testing scripts
├── proxy.ts                         # Next.js middleware replacement
├── README.md
├── package.json
├── tsconfig.json
└── vitest.config.ts

The domain modules represent the core business capabilities:

- Auth (identity, authentication, and session management)
- Tenants (tenant lifecycle and platform authority control)
- Memberships (tenant participation, access, roles, and lifecycle)
- Profiles (user onboarding, profile data, and completeness)
- Products (platform-owned catalog and canonical product data)
- TenantInventory (tenant entitlement, allocation, reservation, and stock management)
- Cart (server-authoritative pre-order aggregation and validation)
- Checkout (application-service orchestration boundary)
- Orders (transactional state machine and lifecycle management)
- Payments (payment recording and confirmation)
- Reconciliation (cross-aggregate consistency detection and resolution)
- Analytics (snapshot-based tenant read models)
- Audit (append-only event traceability projection)
- Notifications (event-driven user communication and dispatch abstraction)
- Jobs (idempotent background execution runtime for lifecycle transitions and async side effects)
- Export (deterministic snapshot-based data export service)
- Security (request-boundary enforcement via auth, CSRF, and rate limiting guards)

---

# Running Locally

``` bash
npm install
npm run dev
```

App runs at:

http://localhost:3000

Seed data loads automatically.

---

# Design Philosophy

- Structure before features
- Invariants before UI polish
- Server authority before convenience
- Guards before permissions abstraction
- Explicit domain ownership
- No premature abstractions
- Observability without violating domain boundaries
- Compile-time transport integrity over implicit runtime assumptions
- Structural transparency over hidden wrapper behavior
- Explicit contracts over inferred payloads

The system is designed around correctness, execution isolation, and long-term scalability rather than short-term feature velocity.

---

# Why This Project Exists

Most tutorials teach CRUD inside a single-organization context.

Real SaaS systems fail when:
- Tenancy is bolted on later
- Stock logic lives in UI
- Cart state lives in browser
- Authorization is decorative

This project solves those problems at the foundation layer.

---

# Status

Actively evolving through staged architectural hardening.
The focus is not speed of features.
The focus is structural correctness.