# ADR 0002 — Module Manifest

- Status: Accepted
- Date: 2026-11-13

## Context

The Android Host needs a standardized way to identify
and understand the capabilities of integrated modules.

## Decision

We will use a technology-agnostic JSON manifest
validated through JSON Schema Draft 2020-12.

Each module must declare:

- Unique identifier
- Name
- Module version
- Runtime framework
- Contract version
- Supported capabilities

## Design Principles

- Stable module identifiers.
- Semantic Versioning for module releases.
- Explicit contract compatibility.
- No framework-specific implementation details.
- Manifest metadata does not control runtime loading.

## Consequences

The Host can inspect module metadata without
depending on the module's internal implementation.

Each framework will provide its own adapter
to implement the integration.
