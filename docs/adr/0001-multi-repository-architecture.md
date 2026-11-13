
# ADR 0001 — Multi-Repository Architecture

- Status: Accepted
- Date: 2026-11-13

## Context

Mosaic is a mobile application designed to explore
the integration of multiple UI frameworks within
a single Android application.

The architecture must support independent development,
testing, versioning and delivery of each module.

## Decision

We will adopt a Multi-Repository architecture.

Repositories:

- mosaic-android-host
- mosaic-react-native-dashboard
- mosaic-flutter-goals
- mosaic-contracts

Each repository owns its implementation,
dependencies, tests and CI/CD pipeline.

The contracts repository defines technology-agnostic
communication specifications.

## Responsibilities

### Android Host
- Application lifecycle
- Global navigation
- Session management
- Module integration
- Native Profile feature

### React Native Dashboard
- Dashboard UI
- Dashboard presentation logic
- React Native runtime integration

### Flutter Goals
- Goals UI
- Goals presentation logic
- Flutter runtime integration

### Contracts
- Navigation contracts
- Communication events
- Module metadata
- Payload schemas
- Contract versioning

## Consequences

Positive:
- Independent development and releases.
- Clear ownership boundaries.
- Technology isolation.
- Explicit integration contracts.

Trade-offs:
- Artifact distribution complexity.
- Contract compatibility management.
- Integration testing across repositories.
