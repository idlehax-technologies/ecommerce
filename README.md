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
- Roles:
  - customer
  - staff
  - admin
  - superadmin
- Guard-driven authorization
- No permission tables unless domain pressure requires it

Authorization dimensions:
1. Identity
2. Role
3. Session mode (direct vs assumed)

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

This structure allows future domains such as inventory reconciliation, payment recording,
fulfillment workflows, and analytics to attach safely without violating domain boundaries.

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

---

# Upcoming Roadmap

11A. Reconciliation detection engine (read-only, tenant-scoped mismatch detection across orders, payments, and inventory with idempotent scans and deterministic reporting)
11B. Reconciliation resolution layer (manual/controlled correction flows for mismatches with invariant-safe adjustments and audit traceability)
12A. Low-stock detection service (threshold-based, tenant-scoped monitoring using consistent inventory snapshots without mutating state)
12B. Stock adjustment flows (admin-triggered, idempotent stock corrections within TenantInventory domain enforcing stock ≥ reserved invariants)
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

# Project Structure (Actual)

.
├── app
│   ├── (tenant)                    # Tenant runtime (core user-facing app)
│   │   ├── cart/                  # Server-authoritative cart
│   │   ├── checkout/              # Checkout flow
│   │   ├── fulfillment/           # Staff fulfillment dashboard
│   │   ├── inventory/             # Tenant inventory view
│   │   ├── memberships/           # Membership flows
│   │   ├── orders/                # Order history + detail + receipt (SSR)
│   │   ├── pos/                   # Staff POS interface
│   │   ├── products/              # Storefront (SSR)
│   │   ├── profile/               # User profile
│   │   └── layout.tsx             # Tenant layout boundary
│   │
│   ├── api                        # Transport layer (routes only)
│   │   ├── auth/                  # Authentication endpoints
│   │   ├── cart/                  # Cart mutations
│   │   ├── checkout/              # Checkout service route
│   │   ├── orders/                # Order lifecycle routes
│   │   │   └── [orderId]/
│   │   │       ├── cancel/
│   │   │       ├── expire/
│   │   │       ├── pay/
│   │   │       ├── pickup/
│   │   │       ├── receipt/
│   │   │       └── refund/
│   │   ├── payments/              # Async payment confirmation
│   │   └── admin/                 # Platform-level APIs
│   │
│   ├── platform                   # Platform (superadmin) runtime
│   │   ├── products/              # Master catalog
│   │   └── tenants/               # Tenant management
│   │
│   └── layout.tsx                 # Root layout
│
├── components                     # UI components (pure, no business logic)
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── orders/                   # Order UI + payment + receipt
│   ├── pos/                      # POS UI components
│   ├── products/
│   ├── memberships/
│   ├── tenant-provisioning/
│   ├── admin/
│   ├── guards/                   # UI-level guards (not auth enforcement)
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── contexts                      # Client-side state (non-authoritative)
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── lib                           # Core system (ALL business logic lives here)
│   ├── api/                      # Client-side API wrappers
│   │
│   ├── auth/                     # Authentication domain
│   ├── tenants/                  # Tenant lifecycle domain
│   ├── memberships/              # Membership domain
│   ├── products/                 # Platform catalog domain
│   ├── tenantInventory/          # Entitlement + stock domain
│   ├── cart/                     # Cart domain (server-authoritative)
│   ├── checkout/                 # Checkout application service
│   ├── orders/                   # Order aggregate + state machine
│   ├── payments/                 # Payment domain (async confirmation)
│   ├── pos/                      # POS application service
│   │
│   ├── mappers/                  # View projections
│   ├── http/                     # Route error handling
│   └── jwt.ts                    # JWT utilities
│
├── types                         # Shared domain contracts
│   ├── order.ts
│   ├── orderEvent.ts
│   ├── payment.ts
│   ├── tenantInventory.ts
│   └── ...
│
├── docs                          # Architecture notes
│   └── checkout-api.md
│
└── README.md

The domain modules represent the core business capabilities:

- Auth
- Tenants
- Memberships
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