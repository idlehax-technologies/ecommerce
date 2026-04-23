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
- In-memory storage (dev simulation of database)
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
• Domain event emission for cross-domain reactions
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

### Architectural Position

Step 11 → Detect inconsistencies  
Step 12 → Monitor + Correct inventory safely  
Step 13 → Analytics (read models on stable data)

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

Order lifecycle now emits domain events:

- `OrderCreated`
- `OrderPaid`
- `OrderCancelled`
- `OrderExpired`
- `OrderPickedUp`
- `OrderRefunded`

These events decouple the order domain from other system domains and establish integration points for:

- inventory reconciliation
- payment recording
- notifications
- audit logging
- analytics

Application services now react to emitted domain events.

---

### Event Ownership

Events are constructed only by the domain that owns the relevant data:

- Orders domain emits structural lifecycle events
- Payments domain emits `OrderPaid` (because it owns payment data)

This prevents invalid event construction and ensures type-safe domain boundaries.

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
Audit Logging (immutable trace of all corrective actions)

---

# Upcoming Roadmap

13. Tenant analytics service (snapshot-based read model for sales, revenue, and inventory metrics strictly using historical order data, never live product data)
14. Audit logging layer (append-only, cross-domain event logging with actor identity, tenant context, and immutable write-event tracking aligned with domain actions)
15. Notification service abstraction (event-driven notifications triggered strictly from domain events with idempotent dispatch and adapter-based delivery design)
16. Security hardening pass (request-level protection via CSRF, cookies, rate limiting + authorization audit ensuring strict guard-driven role and tenant enforcement)
17. Background job runner (idempotent, state-machine-safe scheduled execution for tasks like auto-expire of unpaid RESERVED orders with retry-safe design)
18. Data export service (tenant-scoped deterministic CSV generation aligned with reconciliation data ensuring snapshot correctness and pagination readiness)
19. Multi-tenant isolation test suite (systematic validation of tenant boundaries including cross-tenant access attempts, concurrent operations, and leakage prevention)
20. Performance pass (query-shape optimization, pagination enforcement, and projection safety to prepare for DB-backed execution without data over-fetching)
21. Production readiness layer (Map → DB migration with transaction support, DB constraints, concurrency control, structured logging, observability, and deployment readiness)

Each step builds on previously locked invariants.

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

### Tenant Runtime (User-facing)

Handles all tenant-scoped operations.

- Cart
- Checkout
- Orders (history, receipt)
- POS (staff)
- Fulfillment
- Storefront (SSR products)
- Memberships
- Profile
- Reconciliation (read + resolution UI)

```
app/(tenant)/*
```

---

### Platform Runtime (Superadmin)

Handles platform-level control and cross-tenant operations.

- Product catalog management
- Tenant lifecycle management
- Tenant inventory provisioning
- Low-stock monitoring
- Stock adjustment

```
app/platform/*
```

---

### API Layer (Transport Only)

All routes are transport-level adapters:

- No business logic
- No invariant enforcement
- Only orchestration + delegation

```
app/api/*
```

Includes:

- Tenant APIs (cart, orders, checkout, payments)
- Platform APIs (admin/tenants/*, inventory control)
- Reconciliation APIs (detect + resolve)

---

## 2. Core System (Domain Layer)

All business logic lives inside `lib/`.

Each module is a **self-contained domain boundary**.

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
- audit

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

## 4. UI Layer (Components)

Pure UI components:

```
components/*
```

- No business logic
- No domain decisions
- Express user intent only

Grouped by domain:

- cart
- orders
- products
- pos
- reconciliation
- lowStock
- tenant-provisioning
- admin

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

- identity resolution
- role enforcement
- tenant derivation
- permission checks

### Access Control Strategy

Two distinct guard types exist:

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

### HTTP Layer

- centralized error handling
- domain error → HTTP mapping

### Contexts

- AuthContext
- CartContext (UI state only, not source of truth)

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

---

# Project Structure (Actual)

.
├── app
│   ├── (tenant)                     # Tenant runtime (user-facing)
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── fulfillment/
│   │   ├── inventory/
│   │   ├── memberships/
│   │   │   ├── [membershipId]/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── [orderId]/
│   │   │   │   └── receipt/
│   │   │   └── page.tsx
│   │   ├── pos/
│   │   ├── products/
│   │   │   ├── [productId]/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   ├── reconciliation/
│   │   └── layout.tsx
│   │
│   ├── platform                     # Superadmin runtime
│   │   ├── products/
│   │   │   ├── new/
│   │   │   └── [productId]/
│   │   └── tenants/
│   │       ├── new/
│   │       └── [tenantId]/
│   │           └── inventory/
│   │               └── low-stock/
│   │
│   ├── api                          # Transport layer (routes only)
│   │   ├── admin/
│   │   │   ├── memberships/[membershipId]/role/
│   │   │   ├── products/
│   │   │   └── tenants/[tenantId]/
│   │   │       ├── activate/
│   │   │       ├── archive/
│   │   │       ├── assume/
│   │   │       ├── suspend/
│   │   │       └── inventory/
│   │   │           ├── adjust/
│   │   │           └── low-stock/
│   │   │
│   │   ├── auth/
│   │   │   ├── otp/
│   │   │   ├── logout/
│   │   │   ├── me/
│   │   │   └── stop-assume/
│   │   │
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── memberships/
│   │   │   ├── [membershipId]/
│   │   │   │   ├── approve/
│   │   │   │   ├── reject/
│   │   │   │   └── revoke/
│   │   │   ├── active/
│   │   │   ├── me/
│   │   │   ├── pending/
│   │   │   └── select/
│   │   │
│   │   ├── orders/
│   │   │   ├── [orderId]/
│   │   │   │   ├── cancel/
│   │   │   │   ├── expire/
│   │   │   │   ├── pay/
│   │   │   │   ├── pickup/
│   │   │   │   ├── refund/
│   │   │   │   └── receipt/
│   │   │   └── pos/
│   │   │
│   │   ├── payments/[orderId]/confirm/
│   │   ├── profile/
│   │   └── reconciliation/
│   │       └── resolve/
│   │
│   └── layout.tsx
│
├── components                      # Pure UI (no business logic)
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── common/
│   ├── guards/
│   ├── lowStock/
│   ├── memberships/
│   ├── orders/
│   ├── pos/
│   ├── products/
│   ├── profile/
│   ├── reconciliation/
│   ├── session/
│   ├── tenant/
│   └── tenant-provisioning/
│
├── contexts                        # Client state (UI only)
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── hooks
│   └── useActiveMembership.ts
│
├── lib                             # Core system (ALL domain logic)
│   ├── api/                        # Client API wrappers
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── checkout.ts
│   │   ├── memberships.ts
│   │   ├── orders.ts
│   │   ├── profiles.ts
│   │   ├── tenantInventory.ts
│   │   ├── reconciliation.ts
│   │   └── stockAdjustment.ts
│   │
│   ├── auth/
│   ├── tenants/
│   ├── memberships/
│   ├── profiles/
│   ├── products/
│   ├── tenantInventory/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── payments/
│   ├── reconciliation/
│   ├── audit/
│   ├── pos/
│   ├── jobs/
│   └── http/
│
├── types                           # Shared contracts
│   ├── auth.ts
│   ├── profile.ts
│   ├── membership.ts
│   ├── tenant.ts
│   ├── tenantInventory.ts
│   ├── cart.ts
│   ├── checkout.ts
│   ├── order.ts
│   ├── orderEvent.ts
│   ├── payment.ts
│   ├── reconciliation.ts
│   ├── stockAdjustment.ts
│   └── audit.ts
│
├── docs
│   └── checkout-api.md
│
├── public/
├── package.json
└── README.md

The domain modules represent the core business capabilities:

- Auth
- Tenants
- Memberships
- Profile
- Products
- TenantInventory
- Cart
- Checkout
- Orders

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

The system is designed to survive scale, not just function in demos.

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