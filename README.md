# Multi-Tenant Transactional SaaS Platform

A production-grade simulation of a tenant-isolated transactional system built with strict domain boundaries and server-authoritative state.

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

## Products (Platform-Owned)

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

Product (platform)  
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

# Architectural Guarantees

- No cross-tenant access
- No client-side stock manipulation
- No bypass of domain rules
- Domain errors are the single source of HTTP truth
- Routes are orchestration only
- All business logic is centralized

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

# Upcoming Roadmap

1. Tenant lifecycle management
2. Membership verification flow
3. Checkout stock reservation logic
4. Order state machine
5. Atomic inventory deduction
6. Payment recording
7. Staff POS
8. Fulfillment dashboard
9. Audit logging
10. Notifications
11. Production readiness

Each step builds on previously locked invariants.

---

# Development Data

Storage uses globalThis maps to survive Next.js hot reload.

Seed logic runs once at initialization.

This simulates persistence without introducing database complexity yet.

---

# Project Structure (Conceptual)

app/
  (tenant)/
    products/ → storefront SSR
  admin/
    products/ → platform management
  api/
    auth/
    products/
    cart/
    tenantInventory/

components/
  products/
  cart/
  admin/

lib/
  auth/
  products/
  cart/
  tenantInventory/
  api/ (HTTP wrappers only)

types/
  product.ts
  cart.ts
  tenant.ts

There is:
- One products domain
- One cart domain
- One tenantInventory domain

No duplication between admin and storefront.

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