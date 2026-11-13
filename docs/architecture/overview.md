
# Mosaic — Architecture Overview

## Vision

Mosaic explores a multi-framework mobile architecture
where multiple UI technologies coexist in a single
Android application.

## Framework Distribution

| Component | Technology |
|---|---|
| Host | Kotlin |
| Profile | Kotlin + Jetpack Compose |
| Dashboard | React Native + TypeScript |
| Goals | Flutter + Dart |

## Architectural Principles

1. Independent module ownership.
2. Explicit communication contracts.
3. Low coupling between modules.
4. Host-controlled global navigation.
5. Independent module testing.
6. Versioned integration artifacts.

## Integration Strategy

The Android Host is responsible for integrating
and orchestrating the external UI runtimes.

Modules communicate through explicit contracts,
implemented using framework-specific adapters.

## Initial Scope

Android only.

iOS interoperability is outside the initial scope.
