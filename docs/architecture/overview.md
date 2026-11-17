# Mosaic Architecture Overview

## 1. Purpose

This document describes the target architecture of Mosaic: an Android application that hosts independently developed mobile modules implemented with different runtimes.

The initial implementation includes:

- **Android Host:** Kotlin and Jetpack Compose.
- **Profile:** native Android, Kotlin and Jetpack Compose.
- **Dashboard:** React Native and TypeScript.
- **Goals:** Flutter and Dart.
- **Contracts:** technology-agnostic schemas and specifications maintained in `mosaic-contracts`.

The architecture is designed to keep modules independently evolvable while allowing them to participate in one application experience.

## 2. Architectural Principles

1. **Host as integration layer:** the Android Host provides cross-cutting infrastructure and mediates communication between modules.
2. **Module autonomy:** each module owns its UI, internal state, business rules, and domain persistence.
3. **Contract-first integration:** cross-module interactions use explicit, technology-agnostic contracts.
4. **No direct implementation dependencies:** a module must not import or depend on another module's internal classes, services, state managers, or framework components.
5. **Host-owned shared capabilities:** global navigation, shared context, event distribution, module discovery, compatibility validation, and runtime lifecycle are coordinated by the Host.
6. **Fail safely:** invalid manifests, unsupported contracts, missing capabilities, and failed module operations must produce predictable errors.

## 3. High-Level Component Model

### 3.1 Android Host

The Host owns application-level integration and cross-cutting capabilities:

- Module Registry: discovers and describes modules available to the application.
- Compatibility Validator: checks manifest validity, minimum Host version, contract version support, and required capabilities.
- Module Loader: initializes and unloads modules.
- Lifecycle Manager: tracks module lifecycle and releases resources associated with unloaded modules.
- Runtime Adapters: integrate native Android, React Native, and Flutter runtimes.
- Navigation Manager: validates and executes global navigation requests.
- Event Bus: authorizes publishers and distributes events to active subscribers.
- Shared Context: maintains the Host-owned snapshot of application-wide context.
- Communication Broker: mediates explicit request/response operations between modules.

The Host is not the owner of each module's domain model or business logic. It must not become a centralized domain layer or a substitute for module backends.

### 3.2 Modules

Each module owns its own:

- User interface and presentation logic.
- Domain rules and use cases.
- Internal application state.
- Data access and persistence for its domain.
- Runtime-specific implementation details.

Modules interact with Host capabilities through contracts. They do not access another module's internal APIs or persistence directly.

### 3.3 Contracts Repository

`mosaic-contracts` contains technology-agnostic definitions shared by the Host and modules, including:

- Module manifest schema.
- Navigation request and result schemas.
- Event envelope and event-specific schemas.
- Shared context schema.
- Standardized error envelope schema.
- Versioning and compatibility policy.
- Architecture decisions and examples.

A contract definition is not itself an implementation. The Host and modules must implement the documented semantics.

## 4. Module Discovery, Compatibility, and Loading

These are separate responsibilities and must remain distinct.

1. **Discovery:** the Module Registry makes available module descriptors and their manifests.
2. **Validation:** the Compatibility Validator checks the manifest and all compatibility requirements.
3. **Loading:** the Module Loader initializes the module using the appropriate Runtime Adapter.
4. **Lifecycle management:** the Lifecycle Manager tracks active modules and releases module-scoped resources when they are unloaded.

A module must not be initialized unless all required compatibility checks pass:

- The Host version is greater than or equal to `minimumHostVersion`.
- The declared `contractVersion` is supported natively or through a compatible adapter.
- Every entry in `requiredCapabilities` is available.
- The manifest conforms to the Module Manifest schema.

A higher Host version does not, by itself, guarantee compatibility.

## 5. Communication Model

Mosaic defines three distinct interaction mechanisms.

### 5.1 Global Navigation

Modules submit a Navigation Request to the Host. The Host validates the source module, destination module, and route, then performs or rejects the navigation.

The Host owns global navigation. Modules may retain local navigation within their own boundary.

A missing or invalid destination route is rejected by the Host and represented using the standardized Error Envelope.

### 5.2 Event Bus

The Host owns the Event Bus.

- A publisher is identified by the Host; the Host must not trust `sourceModuleId` supplied in an event as proof of identity.
- The Host maintains an authorization registry mapping modules to event types they may publish.
- Unauthorized publications are rejected.
- Subscribers are associated with their owning module.
- When a module is unloaded, its subscriptions are cancelled.
- An initialized module must register its subscriptions again after a later initialization.
- Events are distributed to active subscribers according to the Event Communication contract.

The current Event Bus is in-memory. It does not provide persistence or replay after process termination.

### 5.3 Shared Context Updates

The Host is the source of truth for the Shared Context snapshot.

When a module-owned operation changes information that is represented in the shared context:

1. The owning module performs its domain operation and remains responsible for its domain persistence.
2. The Host updates only the relevant shared-context projection.
3. The Host notifies interested modules through an event.
4. A notified module obtains the current snapshot from the Host.

Events are notifications; the snapshot remains authoritative. The Host must not duplicate the complete domain model of a module.

The `context.updated` event is an architectural proposal and still requires a formal event schema before implementation.

### 5.4 Explicit Module-to-Module Operations

Modules may need information or an operation owned by another module that is not part of Shared Context.

In that case, a module may issue an explicit request through the Host's Communication Broker. The Host routes the request to the owning module and returns the response.

This mechanism must use an explicit, versioned contract. It must not expose the target module's internal classes, services, storage, or framework APIs.

Timeouts, authorization rules, cancellation, request correlation, and error mapping must be specified in the future Module Communication contract before this mechanism is implemented.

## 6. Ownership and Boundaries

| Responsibility | Owner |
|---|---|
| Global navigation | Android Host |
| Module discovery and registry | Android Host |
| Compatibility validation | Android Host |
| Module loading and lifecycle coordination | Android Host |
| Runtime integration | Android Host |
| Shared Context snapshot | Android Host |
| Event Bus and publication authorization | Android Host |
| Cross-module request routing | Android Host |
| Profile UI, rules, state, and persistence | Profile |
| Dashboard UI, rules, state, and persistence | Dashboard |
| Goals UI, rules, state, and persistence | Goals |
| Contract definitions and schemas | mosaic-contracts |

The Host owns the shared-context projection, not the source domain data. Each module remains responsible for its own domain persistence and backend interactions.

## 7. Error Handling

The Host validates cross-module requests and runtime boundaries and is responsible for producing standardized errors for failures it detects, including:

- Unknown module or route.
- Incompatible module manifest.
- Missing required capability.
- Unsupported contract version.
- Unauthorized event publication.
- Module initialization or runtime integration failure.
- Communication timeout or routing failure.

Errors must follow the Error Envelope contract. Error details must not expose secrets, access tokens, or internal stack traces to other modules.

For errors originating inside a module's own domain operation, that module remains responsible for translating its failure into the agreed cross-module error representation when returning it through a Host-mediated contract.

## 8. Module Registry: Conceptual Model

The Module Registry is the Host-owned source for discovering modules available to the application. It is separate from the Module Loader.

A registry entry should reference or contain:

- The module manifest, including module ID, name, module version, runtime, compatibility requirements, and required capabilities.
- A Host-managed reference to the module implementation artifact or installation source, where applicable.
- Registry availability/discovery metadata.

The current Module Manifest schema does **not** define an artifact reference or runtime lifecycle state. Those are Host-side registry/deployment concerns and must not be added to the manifest without a separate contract decision.

The Registry describes availability; it does not imply that a module is loaded or active. Runtime lifecycle state belongs to the Lifecycle Manager.

## 9. Quality Attributes

The architecture aims to support:

- **Modularity:** modules can be developed and tested independently.
- **Replaceability:** a module implementation can change without requiring other modules to know its internals.
- **Compatibility control:** the Host rejects modules whose declared requirements are not met.
- **Lifecycle safety:** module-scoped subscriptions and resources are released on unload.
- **Observability:** cross-boundary operations and errors can be correlated using contract identifiers.
- **Security boundaries:** the Host validates module identity and permissions rather than trusting caller-provided metadata.

These are architectural goals; concrete performance, security, and reliability thresholds remain to be defined and tested.

## 10. Open Items Before Implementation

The following items are intentionally not treated as finalized contracts yet:

1. Formal schema and semantics for `context.updated`.
2. Formal Module Communication request/response contract.
3. Module Registry artifact reference and installation/discovery source.
4. Exact lifecycle state machine and transition rules.
5. Event publication authorization registry format and ownership.
6. Meaning of `sourceModuleId` for Host-generated errors; the Error Envelope currently uses the field name `sourceModuleId`, and its semantics should be clarified.
7. Host capability registry representation and contract-version adapter policy.
8. Security and authorization rules for Host-mediated module operations.

These items should be resolved before the corresponding features are implemented.
