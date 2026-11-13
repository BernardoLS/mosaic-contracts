
# ADR 0004 — Host-Owned Event Bus

- Status: Accepted
- Date: 2026-11-13

## Context

Mosaic modules need to exchange information without
depending directly on each other's implementations.

## Decision

The Android Host will own an in-process Event Bus.

Modules communicate through technology-agnostic
event contracts defined using JSON Schema.

The Event Bus follows a Publish/Subscribe model.

## Responsibilities

### Publisher
- Publish events using the standard envelope.
- Declare event type and version.
- Provide a valid payload.

### Host
- Validate event structure.
- Verify publisher authorization.
- Resolve event subscribers.
- Dispatch events to active subscribers.
- Manage subscription lifecycle.

### Subscriber
- Subscribe to supported event types.
- Validate and process received events.
- Handle unsupported event versions.

## Delivery Model

Initial implementation:

- In-memory event delivery.
- Asynchronous dispatch.
- Active subscribers only.
- No persistent storage.
- No guaranteed delivery after process termination.

## Design Principles

- Events represent facts that already happened.
- Publishers do not know their subscribers.
- Modules cannot communicate directly.
- Event payloads must be versioned.
- Sensitive authentication data must not be included.

## Consequences

Positive:
- Reduced coupling.
- Centralized event orchestration.
- Cross-framework communication.
- Easier observability.

Trade-offs:
- Host owns additional infrastructure.
- Event delivery depends on module lifecycle.
- Consumers must handle compatibility.
