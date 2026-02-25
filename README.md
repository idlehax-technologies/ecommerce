# Multi-Tenant Transactional SaaS Platform

A **tenant-scoped transactional commerce system** built with a strict layered architecture and server-authoritative state.

This project is intentionally designed as a **production-grade system simulation**, not a tutorial project.
Every feature is implemented to enforce real SaaS invariants such as tenant isolation, domain ownership, and server-controlled transactional flow.

---

## Core Architectural Principles

### 1. Tenant Context is a Non-Optional Invariant

Every operation must execute within an authenticated tenant scope.

No request, mutation, or domain operation can exist outside:

```
Identity → Tenant → Domain Execution
```

Tenant isolation is enforced structurally, not conditionally.

---

### 2. Strict Layered Architecture

```
UI
 ↓
API Wrapper (client)
 ↓
Route (transport only)
 ↓
Validators / Guards
 ↓
Domain (business logic)
 ↓
Storage (persistence)
```

Each layer has a single responsibility:

| Layer               | Responsibility                |
| ------------------- | ----------------------------- |
| UI                  | Express user intent           |
| API Wrapper         | Transport abstraction         |
| Route               | HTTP orchestration only       |
| Validators / Guards | Input + invariant enforcement |
| Domain              | All business logic            |
| Storage             | Data persistence only         |

Routes never contain business rules.
UI never owns state that belongs to the domain.

---

### 3. Server is the Source of Truth

The browser is never treated as authoritative.

No client persistence (e.g., `localStorage`) is trusted for transactional data.

All mutations must round-trip through the server and domain.

---

## Technology Stack

* Next.js (App Router)
* TypeScript
* Material UI (MUI)
* Cookie-based JWT Authentication
* In-memory persistence (development simulation of DB)
* Layered domain architecture

---

## Implemented Features

### Step 1 — Authentication & Role System

* Cookie-based JWT session
* Roles: `customer`, `staff`, `admin`, `superadmin`
* Identity restored via `/api/auth/me`
* Guards enforce identity and role invariants

---

### Step 2 — Tenant-Scoped Domain Model

* All entities bound to `tenantId`
* Requests require authenticated tenant context
* Cross-tenant access structurally impossible

---

### Step 3 — Role Hardening

* Guard-driven authorization model
* Separation of:

  * Identity
  * Authority (role)
  * Session mode

---

### Step 4 — Tenant-Scoped Product Catalog

* Products isolated per tenant
* Domain guards prevent cross-tenant visibility
* CRUD flows aligned to strict layering

---

### Step 5 — Public + Admin Product Interfaces

* Separate UI surfaces using the same domain
* No duplication of business logic
* UI only consumes safe projections

---

### Step 6 — Cart System with Single-Tenant Enforcement

This step introduces the **transactional cart model**.

#### Key Decision: Cart is Server-Authoritative

The cart is **not a client session artifact**.
It is a tenant-bound domain entity.

#### What Changed

* Removed all client persistence (`localStorage` eliminated).
* Cart stored server-side and keyed by `tenantId`.
* Every cart mutation requires authenticated tenant context.
* Cart cannot mix products across tenants.
* UI expresses intent only; domain performs mutations.
* Undo / delay behaviors implemented strictly in UI (no domain coupling).

#### Why This Matters

Client-side carts break tenant isolation and allow state drift.

This system instead models:

```
Authenticated Tenant → Owns Exactly One Cart → Server Controlled Lifecycle
```

This prepares the platform for checkout reservation and order state enforcement.

---

## Domain Modules

### Products Domain

Handles catalog logic and tenant access enforcement.

### Cart Domain

Tenant-scoped transactional cart:

* Add / update / remove items
* Validates products through read-only dependency on Products domain
* Persisted server-side only

---

## Why No Global Client State Libraries?

React Context is used sparingly and only where appropriate:

| Context     | Purpose                                       |
| ----------- | --------------------------------------------- |
| AuthContext | Identity snapshot for UI                      |
| CartContext | Thin coordination layer (not source of truth) |

Contexts never contain business logic.

---

## Development Data Seeding

The development environment includes **one-time seeded products** inside storage initialization to simulate a persistent catalog without duplication during hot reload.

---

## Current System Guarantees

* Tenant isolation is structurally enforced.
* No domain rule can be bypassed by client behavior.
* State cannot leak between tenants.
* All transactional mutations are validated server-side.

---

## Roadmap (Next Phases)

Upcoming work builds on Step 6:

1. Tenant lifecycle management
2. Checkout stock reservation
3. Order state machine
4. Payment recording
5. Operational dashboards
6. Audit logging and analytics

These depend on the server-authoritative cart introduced in Step 6.

---

## Running the Project

```
npm install
npm run dev
```

Seed data loads automatically on first startup.

---

## Project Intent

This repository is not meant to demonstrate UI techniques.

It is an exercise in designing **correct multi-tenant transactional architecture**, where business invariants are enforced by structure rather than convention.
