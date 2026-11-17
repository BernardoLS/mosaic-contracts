
# ADR 0006 — Standardized Error Handling

- Status: Accepted
- Date: 2026-11-16

## Context

Mosaic integrates multiple mobile runtimes.
Each runtime has its own error types, exceptions
and failure mechanisms.

The Host needs a consistent way to interpret,
report and handle failures across modules.

## Decision

We will adopt a technology-agnostic Error Envelope
defined through JSON Schema.

Each framework adapter is responsible for translating
framework-specific failures into the standard format.

The Android Host owns centralized error handling.

## Responsibilities

### Framework Adapters
- Capture framework-specific exceptions.
- Normalize errors into the standard envelope.
- Avoid exposing internal stack traces.

### Android Host
- Validate error envelopes.
- Record diagnostic information.
- Apply retry policies.
- Coordinate module recovery.
- Provide user feedback when necessary.

### Modules
- Handle recoverable internal failures.
- Report failures through the standard contract.
- Avoid exposing sensitive implementation details.

## Error Categories

- MODULE
- INITIALIZATION
- COMMUNICATION
- NAVIGATION
- CONTRACT
- TIMEOUT
- RUNTIME
- AUTHENTICATION

## Security Principles

- Never expose authentication credentials.
- Do not propagate raw stack traces.
- Sanitize error details.
- Separate technical diagnostics from user-facing messages.

## Consequences

Positive:
- Consistent cross-framework error handling.
- Centralized observability.
- Reduced framework coupling.
- Explicit recovery responsibilities.

Trade-offs:
- Additional adapter complexity.
- Error mapping must be maintained.
- Not all runtime failures are recoverable.
