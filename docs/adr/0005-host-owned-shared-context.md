
# ADR 0005 — Host-Owned Shared Context

- Status: Accepted
- Date: 2026-11-13

## Context

Mosaic modules require shared application information,
such as user identity, theme, locale and session state.

Each module must remain independent and must not
access the internal storage or authentication
implementation of the Android Host.

## Decision

The Android Host owns the global application context.

Context is provided through a technology-agnostic
JSON contract.

Modules receive a context snapshot during initialization
and may request an updated snapshot when necessary.

## Context Categories

- User Context
- Application Context
- Session Context
- Runtime Context

## Security Principles

- Authentication credentials are never exposed.
- Modules receive only the information they require.
- The Host remains responsible for authentication.
- Context information does not grant API authorization.
- Logout invalidates the previous authenticated context.

## Synchronization Strategy

The Host is the source of truth.

Snapshots provide the authoritative current state.

Events notify active modules about relevant changes.

Modules must receive a fresh snapshot when initialized
or when recovering from an inactive state.

## Consequences

Positive:
- Consistent application context.
- Reduced authentication coupling.
- Framework-independent integration.
- Explicit lifecycle management.

Trade-offs:
- Host manages context distribution.
- Modules must handle context updates.
- Snapshot and event consistency must be considered.
