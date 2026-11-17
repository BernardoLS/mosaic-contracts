
# ADR-0007: Versioning and Compatibility

- Status: Accepted
- Date: 2026-11-17

## Context

Mosaic is a multi-repository architecture in which the Android Host, individual modules, and shared contracts evolve independently.

Modules may be developed and released by different teams, potentially at different times and with different release cycles.

A compatibility mechanism is necessary to ensure that a module is only initialized when the Host provides the required contracts and capabilities.

An initial proposal considered declaring minimum and maximum supported Host and contract version ranges in module manifests.

However, requiring a module to declare a maximum supported Host version is impractical. When developing a module, its team cannot predict future Host releases or determine the maximum version with which the module will remain compatible.

Compatibility must therefore be evaluated by the Host rather than predicted by the module.

## Decision

Mosaic adopts a Host-owned compatibility validation strategy.

Each module must declare three compatibility requirements:

1. `minimumHostVersion`: the minimum Host version required by the module.
2. `contractVersion`: the exact contract version against which the module was developed.
3. `requiredCapabilities`: the Host capabilities required for the module to operate.

Modules must not declare a maximum supported Host version.

The Host is responsible for validating all requirements before initializing a module.

## Compatibility Validation

The Host must verify:

- Its current version satisfies the module's minimum Host version.
- The module's declared contract version is supported natively or through a compatibility adapter.
- All required capabilities are available.
- The module manifest complies with the defined schema.

If any requirement is not satisfied, initialization must be rejected.

## Contract Compatibility

The contract version identifies the exact contract specification used by the module.

The Host must maintain an explicit registry of supported contract versions.

When necessary, the Host may provide compatibility adapters to support modules developed against older contract versions.

The Host must not assume that different major contract versions are compatible.

## Capability Compatibility

Capabilities represent stable functionalities exposed by the Host.

Examples include:

- `navigation.request`
- `context.snapshot`
- `events.publish`
- `events.subscribe`

The Host maintains a registry of available capabilities.

A capability must preserve its documented semantics across compatible releases.

Incompatible changes require a new capability identifier or a new versioned contract.

Capability validation complements contract version validation. It does not replace it.

## Consequences

### Positive

- Modules do not need to predict future Host versions.
- Host compatibility validation is centralized.
- Host, modules, and contracts can evolve independently.
- Compatibility requirements are explicit and machine-readable.
- The Host can introduce adapters to support older modules.
- Missing capabilities are detected before module initialization.

### Negative

- The Host needs to maintain contract and capability registries.
- Compatibility adapters introduce implementation and testing complexity.
- The Host must carefully manage breaking changes to capabilities and contracts.
- A minimum Host version alone cannot guarantee compatibility with future major releases.

## Alternatives Considered

### Host and Contract Version Ranges

Modules would declare minimum and maximum supported versions.

Rejected because module teams cannot reliably predict future Host releases and their compatibility boundaries.

### Minimum Host Version Only

Modules would declare only the minimum Host version.

Rejected because a sufficiently recent Host might not support the exact contract or capabilities required by the module.

### Capability-Based Compatibility Only

Modules would declare only the capabilities they require.

Rejected because capabilities do not fully describe contract structure, serialization formats, or behavioral semantics.

## Implementation Notes

The module manifest schema must include:

- `compatibility.minimumHostVersion`
- `compatibility.contractVersion`
- `requiredCapabilities`

The Host implementation must provide:

- A Host version provider.
- A supported contract version registry.
- A capability registry.
- A module compatibility validator.
- Standardized compatibility errors.

The detailed rules are maintained in:

`docs/architecture/versioning-policy.md`
