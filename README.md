# Multi-Tenant Transactional SaaS (Next.js)

A tenant-isolated transactional platform designed to model how real
multi-tenant SaaS systems enforce data boundaries, role-based workflows,
and operational correctness.

This project is being built step-by-step as a deliberately structured
system rather than a feature dump. Each step hardens invariants before
adding new behavior.

------------------------------------------------------------------------

## Core Idea

This is **not** an e-commerce clone.

It is a **multi-tenant application** where:

-   Multiple organizations (tenants) exist in the same system
-   Each tenant's data is strictly isolated
-   Users operate within a tenant context
-   Catalog, cart, and orders are always tenant-scoped
-   The system is designed to prevent cross-tenant access *by
    construction*, not by convention

The goal is to model production SaaS constraints early: data isolation,
layered architecture, and explicit domain ownership.

------------------------------------------------------------------------

## Non-Negotiable Invariant

**Tenant scoping is mandatory everywhere.**

All business operations must be derived from the authenticated actor's
tenant context.
No API accepts a `tenantId` from the client.
No domain logic runs without a tenant-scoped actor.

If tenant context is missing, execution must fail.

------------------------------------------------------------------------

## Architecture

The system follows strict layering:

UI → API Route (transport only) → Validators (shape checks) → Mappers (DTO → domain data) → Guards (authorization + invariants) → Domain (business rules) → Storage (persistence)

Only the **domain layer** contains business logic.
Routes orchestrate. They do not decide.

------------------------------------------------------------------------

## Technology Stack

-   Next.js (App Router)
-   TypeScript (strict)
-   Material UI (MUI)
-   Cookie-based JWT authentication
-   In-memory storage (development phase)
-   Manual domain layering (no ORM abstractions)

The system intentionally avoids heavy frameworks to expose mechanics
clearly.

------------------------------------------------------------------------

## Current Progress

### Completed

-   Authentication + role system
-   Tenant model and isolation rules
-   Product domain with strict tenant enforcement
-   Public storefront (tenant-filtered catalog)
-   Admin product management interface
-   Separation of operational vs consumer UI surfaces

### Upcoming

-   Single-tenant cart enforcement
-   Checkout stock reservation
-   Order lifecycle state machine
-   Payment recording
-   Staff fulfillment workflows
-   Tenant analytics and auditing

Each step builds on invariants already locked in.

------------------------------------------------------------------------

## Project Structure (Simplified)

app/
  products/ → storefront pages
  admin/products/ → management pages
  api/ → transport layer only

components/
  products/ → storefront UI
  admin/products/ → operational UI

lib/
  products/ → domain module
  api/ → HTTP wrappers
  auth/ → guards + session logic

types/
  product.ts → domain + public projections
  tenant.ts

There is a **single products domain**.
Admin and storefront are just different views over it.

------------------------------------------------------------------------

## Development Workflow

feature/* → dev (integration branch) → main (stable release state)

Even when working solo, pull requests act as integration checkpoints.

------------------------------------------------------------------------

## Running Locally

``` bash
npm install
npm run dev
```

App runs at:

http://localhost:3000

------------------------------------------------------------------------

## Design Philosophy

-   Explicit invariants over convenience
-   Structural correctness before feature expansion
-   Single source of truth in domain logic
-   Separation of read (storefront) and operational (admin) surfaces
-   Predictable state transitions across UI and backend

Build the constraints first, then the features.

------------------------------------------------------------------------

## Why This Exists

Most tutorials build CRUD apps that assume a single organization and no isolation concerns.

Real SaaS systems fail when:
tenancy is bolted on later,
UI and domain boundaries blur,
authorization is treated as decoration.

This project intentionally solves those problems early.

------------------------------------------------------------------------

## Status

Actively evolving through a staged roadmap.
This repository models system design and correctness---not just functionality.
