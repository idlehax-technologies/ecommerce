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

TenantInventory binds products to tenants.

Each record contains:

- tenantId
- productId
- enabled (boolean)
- stock (number)
- timestamps

TenantInventory answers:
> What can this tenant sell and how much?

This layer replaces the old multi-vendor model entirely.

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

### Stock Enforcement

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

# Checkout Transaction

Checkout converts a cart into an order.

Execution flow:

Cart  
↓  
Checkout Application Service  
↓  
Order Creation (`status = RESERVED`)  
↓  
TenantInventory Stock Reservation  
↓  
Cart Clearing

---

# Orders Domain

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

# Implemented capabilities

• Tenant-isolated execution model
• Platform-owned catalog with tenant entitlement layer
• Server-authoritative cart with domain stock enforcement
• Checkout application service converting carts into transactional orders
• Order aggregate with strict tenant binding and snapshot item model
• Lifecycle-driven order state machine
• Domain event emission for cross-domain reactions

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

### Domain Events

Order lifecycle now emits domain events:

- `OrderCreated`
- `OrderPaid`
- `OrderCancelled`
- `OrderExpired`
- `OrderPickedUp`

These events decouple the order domain from other system domains and establish integration points for:

- inventory reconciliation
- payment recording
- notifications
- audit logging
- analytics

Application services now react to emitted domain events.

---

### Current Transaction Pipeline

Cart  
↓  
Checkout Service  
↓  
Order Aggregate  
↓  
Order State Machine  
↓  
Domain Events  
↓  
Future reactions (inventory / payments / notifications)

---

# Upcoming Roadmap

4. Atomic stock reservation + deduction inside TenantInventory domain
5. Payment recording domain (mode tracking: CASH / UPI / ONLINE, immutable payment log)
6. Staff POS module under (tenant) runtime (direct order creation bypassing cart)
7. Staff fulfillment dashboard (tenant-scoped order lifecycle management)
8. Customer order history (SSR, tenant-bound)
9. Order receipt generation (server-rendered printable view)
10. Manual cancel / refund / expire flows with state guard enforcement
11. Daily reconciliation service (orders vs payments vs tenant inventory consistency)
12. Low-stock detection service + restock adjustment flows (tenantInventory domain)
13. Tenant analytics service (sales, revenue, inventory velocity projections)
14. Audit logging layer (cross-domain write-event tracking with actor identity)
15. Notification service abstraction (order events → email/SMS adapters)
16. Security hardening pass (rate limiting, CSRF strategy, cookie tightening, guard audit)
17. Background job runner (auto-expire unpaid RESERVED orders)
18. Data export service (tenant-scoped CSV generation for accounting)
19. Multi-tenant isolation test suite (structural cross-tenant leakage prevention)
20. Performance pass (query optimization, pagination, projection refinement)
21. Production readiness layer (structured logging, env validation, monitoring hooks, deployment config)

Each step builds on previously locked invariants.

---

# Development Data

Storage uses globalThis maps to survive Next.js hot reload.

Seed logic runs once at initialization.

This simulates persistence without introducing database complexity yet.

---

# Project Structure (Conceptual)

app/
  (tenant)/                    → Tenant-facing application UI
    products/                  → Tenant storefront
    cart/                      → Server-authoritative cart
    checkout/                  → Checkout flow
    orders/                    → Order history & detail
    memberships/               → Tenant membership flows
    inventory/                 → Tenant inventory view
    profile/                   → User profile
    layout.tsx

  platform/                    → Platform administration
    products/                  → Platform product catalog
    tenants/                   → Tenant management

  api/                         → HTTP transport layer
    auth/                      → Authentication endpoints
    cart/                      → Cart mutation routes
    checkout/                  → Checkout transaction route
    orders/                    → Order retrieval routes
    memberships/               → Membership API
    admin/                     → Platform admin APIs

components/                    → Reusable UI components
  products/                    → Storefront product UI
  cart/                        → Cart UI components
  checkout/                    → Checkout UI
  orders/                      → Order display components
  memberships/                 → Membership UI
  tenant-provisioning/         → Tenant inventory provisioning
  auth/                        → Authentication UI
  admin/                       → Admin dashboard UI
  Navbar.tsx
  Footer.tsx

contexts/                      → React state containers
  AuthContext.tsx              → Authentication state
  CartContext.tsx              → Cart state

lib/                           → Core application logic
  api/                         → Client-side API wrappers

  auth/                        → Authentication domain
  tenants/                     → Tenant lifecycle domain
  memberships/                 → Membership verification domain
  products/                    → Platform product catalog
  tenantInventory/             → Tenant product entitlement + stock
  cart/                        → Cart domain
  checkout/                    → Checkout application service
  orders/                      → Order aggregate domain

  http/                        → Shared HTTP utilities
  mappers/                     → View projection helpers

types/                         → Shared domain contracts
  auth.ts
  user.ts
  tenant.ts
  membership.ts
  product.ts
  tenantInventory.ts
  cart.ts
  checkout.ts
  order.ts
  orderEvent.ts
  session.ts
  otp.ts

docs/                          → Architecture notes
  checkout-api.md

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