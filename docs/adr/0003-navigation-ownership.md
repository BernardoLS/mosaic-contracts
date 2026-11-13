
# ADR 0003 — Host-Owned Navigation

- Status: Accepted
- Date: 2026-11-13

## Context

Mosaic modules must navigate between features
without depending on the implementation details
of other modules.

## Decision

Global navigation is owned by the Android Host.

Modules communicate navigation intentions through
a technology-agnostic Navigation Request contract.

The Host is responsible for:

- Validating navigation requests.
- Resolving destination modules and routes.
- Checking module availability.
- Enforcing navigation policies.
- Executing navigation.
- Returning navigation results.

## Navigation Flow

1. A module creates a Navigation Request.
2. The Host receives the request.
3. The Host validates the request.
4. The Host resolves the destination.
5. The Host executes navigation.
6. The Host returns the operation result.

## Design Principles

- Modules cannot directly open other modules.
- Modules cannot depend on framework-specific classes
  from other modules.
- Routes use logical identifiers.
- Parameters are transported as JSON objects.
- Requests use unique correlation identifiers.

## Consequences

Positive:
- Centralized navigation control.
- Reduced coupling between modules.
- Framework-independent navigation.
- Easier testing and observability.

Trade-offs:
- Host becomes responsible for routing.
- Navigation requires a communication bridge.
- Route compatibility must be managed.
