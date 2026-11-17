
# Versioning Policy

## 1. Purpose

This document defines versioning and compatibility rules for the Mosaic ecosystem.

The goal is to allow independent evolution of the Android Host, modules, and shared contracts while maintaining compatibility and predictable integration.

## 2. Versioning Strategy

Mosaic uses Semantic Versioning (SemVer):

`MAJOR.MINOR.PATCH`

- MAJOR: introduces breaking changes.
- MINOR: introduces backward-compatible functionality.
- PATCH: introduces backward-compatible fixes.

This policy applies independently to:
- Android Host
- Individual modules
- Shared contracts

Each component has its own lifecycle and version.

## 3. Module Versioning

Each module must declare its own version in its manifest.

A module version identifies changes to its implementation and externally observable behavior.

Examples:
- `1.0.0`: initial stable release.
- `1.1.0`: new functionality without breaking existing integrations.
- `2.0.0`: breaking changes to the module's exposed behavior or integration.

Module versions do not need to match Host or contract versions.

## 4. Host Compatibility Declaration

Modules must declare the minimum Host version required to execute.

Example:

```json
{
  "compatibility": {
    "minimumHostVersion": "1.2.0",
    "contractVersion": "1.0.0"
  }
}
```

The `minimumHostVersion` field represents the lowest Host version that provides the functionality required by the module.

Modules must not declare a maximum Host version.

The module development team cannot predict future Host releases. Therefore, compatibility with newer Host versions is evaluated by the Host itself.

A minimum version does not guarantee compatibility with every future major version. The Host must explicitly validate compatibility before loading a module.

## 5. Contract Versioning

Every module must declare the exact contract version against which it was developed.

Example:

```json
{
  "contractVersion": "1.0.0"
}
```

The Host must verify that it supports the declared contract version.

Compatibility can be provided through:

- Native support for the requested contract version.
- A compatibility adapter that translates between supported contract versions.

The Host must not assume that different major contract versions are compatible.

Breaking changes to a contract require a new major version.

Backward-compatible additions can increment the minor version, while backward-compatible fixes can increment the patch version.

## 6. Capability Requirements

Modules must explicitly declare the capabilities they require from the Host.

Example:

```json
{
  "requiredCapabilities": [
    "navigation.request",
    "context.snapshot",
    "events.publish"
  ]
}
```

Capabilities represent functionalities exposed by the Host through stable integration boundaries.

Examples:

- `navigation.request`: allows a module to request global navigation.
- `context.snapshot`: allows a module to receive the current shared context.
- `events.publish`: allows a module to publish events.
- `events.subscribe`: allows a module to subscribe to events.

The Host maintains a registry of supported capabilities.

A capability must preserve its documented semantics across compatible Host releases.

If a capability changes incompatibly, it must be introduced under a new capability identifier or a new versioned contract.

## 7. Compatibility Validation

Before loading a module, the Host must validate:

1. The installed Host version is equal to or greater than `minimumHostVersion`.
2. The declared `contractVersion` is supported natively or through a compatibility adapter.
3. Every capability declared in `requiredCapabilities` is available.
4. The module manifest is valid.

If any required condition is not satisfied, the Host must reject module initialization and report a standardized compatibility error.

The Host must not attempt to load a module with unresolved compatibility requirements.

## 8. Compatibility Responsibilities

### Module Responsibilities

- Declare the minimum required Host version.
- Declare the exact contract version used during development.
- Declare all required Host capabilities.
- Follow the documented contract semantics.

### Host Responsibilities

- Maintain its own version.
- Maintain a registry of supported contract versions.
- Maintain a registry of available capabilities.
- Validate module compatibility before initialization.
- Provide compatibility adapters when necessary.
- Reject incompatible modules safely.

### Contracts Repository Responsibilities

- Maintain versioned contract definitions.
- Document breaking and non-breaking changes.
- Keep examples and schemas aligned.
- Document capability semantics.

## 9. Compatibility Principles

- Modules must not predict future Host versions.
- The Host is responsible for compatibility validation.
- A higher version number does not automatically guarantee compatibility.
- Capabilities and contract versions are complementary compatibility checks.
- Breaking changes must be explicit.
- Incompatible modules must fail safely and predictably.

## 10. Example

A module declares:

```json
{
  "compatibility": {
    "minimumHostVersion": "1.2.0",
    "contractVersion": "1.0.0"
  },
  "requiredCapabilities": [
    "navigation.request",
    "context.snapshot"
  ]
}
```

The Host currently runs version `1.5.0` and provides:

- Contract version `1.0.0`.
- Capability `navigation.request`.
- Capability `context.snapshot`.

The module is compatible and can proceed to initialization.

If the Host does not provide `context.snapshot`, the module must be rejected even if its Host version is sufficiently recent.

Likewise, if the Host cannot support contract version `1.0.0`, it must reject the module unless a compatible adapter is available.
