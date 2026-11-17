# ADR-0008: Host-Mediated Modular Architecture and Boundaries

- Status: Accepted
- Date: 2026-11-17

## Context

Mosaic hosts independently developed modules implemented with different mobile runtimes inside one Android application.

The architecture needs clear ownership boundaries so that the Host can provide a coherent application experience without becoming the owner of every module's domain logic. Modules must be able to evolve independently while communicating through stable, technology-agnostic contracts.

The architecture review also identified the need to define ownership for global navigation, shared context, event distribution, module discovery, compatibility validation, lifecycle management, and cross-module operations.

## Decision

Mosaic adopts a Host-mediated modular architecture.

The Android Host owns cross-cutting application infrastructure and mediates interactions between modules. Each module owns its own UI, business rules, internal state, and domain persistence.

Modules must not depend directly on another module's internal implementation.

## Host Responsibilities

The Android Host is responsible for:

- Global navigation and route validation.
- Module Registry and module discovery.
- Module compatibility validation.
- Module loading and unloading coordination.
- Runtime adapters for supported frameworks.
- Shared Context snapshot.
- Event Bus and event publication authorization.
- Lifecycle-bound subscription cleanup.
- Host-mediated request/response routing between modules.
- Standardized errors for failures detected at Host boundaries.

The Registry, Compatibility Validator, Module Loader, Lifecycle Manager, Runtime Adapters, Navigation Manager, Event Bus, Shared Context, and Communication Broker are separate conceptual responsibilities. Their concrete class boundaries will be determined during implementation.

## Module Responsibilities

Each module is responsible for:

- Its own UI and presentation logic.
- Its own business rules and use cases.
- Its internal state.
- Its domain data access and persistence.
- Its runtime-specific implementation.

A module must not import or invoke another module's internal classes, services, state managers, or persistence layer.

## Module Registry and Lifecycle

The Host maintains a Module Registry to discover and describe modules available to the application.

Discovery is separate from compatibility validation and initialization:

1. Registry discovers a module and its manifest.
2. Compatibility Validator checks the manifest, minimum Host version, contract version, and required capabilities.
3. Module Loader initializes the module using the appropriate Runtime Adapter.
4. Lifecycle Manager coordinates active and unloaded states and releases module-scoped resources.

The current Module Manifest schema does not define artifact references or lifecycle state. Those remain Host-side registry/deployment concerns until specified separately.

## Navigation

The Host owns global navigation and validates source identity, destination module, and route.

A request to an unknown route is rejected by the Host and represented using the Error Envelope.

## Events

The Host owns the Event Bus and authorizes event publishers.

The Host must identify the actual publishing module rather than trusting the event's `sourceModuleId` as proof of identity. The Host maintains an authorization mapping between modules and event types.

Subscriptions are associated with their owning module. When a module is unloaded, all of its subscriptions are cancelled. A later initialization requires the module to register subscriptions again.

## Shared Context

The Host owns the Shared Context snapshot, not the complete domain data of each module.

A module remains responsible for its domain operation and persistence. When shared information changes, the Host updates the relevant context projection and notifies interested modules. Events are notifications; the snapshot remains authoritative.

The `context.updated` event requires a formal schema before implementation.

## Cross-Module Communication

Modules may request operations or data owned by another module through a Host-mediated Communication Broker.

Such interactions must use explicit contracts and must not expose the target module's internal implementation.

A Module Communication request/response contract, including authorization, timeout, cancellation, correlation, and error semantics, must be defined before implementation.

## Compatibility

Before initialization, the Host validates:

- Manifest structure.
- `minimumHostVersion`.
- Declared `contractVersion`.
- All `requiredCapabilities`.

A module is rejected if any requirement is not met. A higher Host version alone does not guarantee compatibility.

## Consequences

### Positive

- Modules retain autonomy over their domain logic and persistence.
- The Host provides one controlled integration boundary.
- Modules do not need to know the implementation details or frameworks of other modules.
- Global navigation, event publication, shared context, and lifecycle cleanup are centrally coordinated.
- Compatibility failures are detected before module initialization.

### Negative

- The Host becomes a critical integration component and must be tested carefully.
- Host-mediated communication introduces routing, timeout, and error-handling complexity.
- The Host must maintain registries for modules, capabilities, contracts, and event publication permissions.
- Cross-module operations require explicit contract design and versioning.

## Open Items

The following specifications remain necessary before implementing their respective features:

- Formal `context.updated` event schema.
- Module Communication request/response schema and semantics.
- Module Registry artifact/discovery metadata.
- Exact module lifecycle state machine.
- Event publication authorization registry.
- Semantics of `sourceModuleId` for Host-generated errors.
- Capability registry and contract adapter policy.

## Related Documents

- `docs/architecture/overview.md`
- `docs/architecture/architecture-diagram.md`
- `docs/architecture/versioning-policy.md`
- `docs/adr/0001-multi-repository-architecture.md`
- `docs/adr/0003-navigation-ownership.md`
- `docs/adr/0004-event-driven-communication.md`
- `docs/adr/0005-host-owned-shared-context.md`
- `docs/adr/0006-standardized-error-handling.md`
- `docs/adr/0007-versioning-and-compatibility.md`
