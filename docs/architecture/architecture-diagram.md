# Mosaic Architecture Diagram

This document provides a high-level view of the Mosaic components and their integration boundaries.

## 1. Component Diagram

```mermaid
flowchart TB
    subgraph Contracts["mosaic-contracts"]
        Manifest["Module Manifest"]
        Navigation["Navigation Contract"]
        Events["Event Contracts"]
        Context["Shared Context Contract"]
        Errors["Error Envelope"]
        Compatibility["Versioning & Compatibility Policy"]
    end

    subgraph Host["Android Host — Kotlin"]
        Registry["Module Registry"]
        Validator["Compatibility Validator"]
        Loader["Module Loader"]
        Lifecycle["Lifecycle Manager"]
        Adapters["Runtime Adapters"]
        NavManager["Navigation Manager"]
        EventBus["Event Bus"]
        SharedContext["Shared Context"]
        Broker["Communication Broker"]
    end

    subgraph Modules["Independent Modules"]
        Profile["Profile — Native Android"]
        Dashboard["Dashboard — React Native"]
        Goals["Goals — Flutter"]
    end

    Contracts -. "defines interfaces" .-> Host
    Contracts -. "defines interfaces" .-> Modules

    Registry --> Validator
    Validator --> Loader
    Loader --> Adapters
    Loader --> Lifecycle

    Adapters --- Profile
    Adapters --- Dashboard
    Adapters --- Goals

    Profile --> NavManager
    Dashboard --> NavManager
    Goals --> NavManager

    Profile --> EventBus
    Dashboard --> EventBus
    Goals --> EventBus

    Profile --> SharedContext
    Dashboard --> SharedContext
    Goals --> SharedContext

    Profile <--> Broker
    Dashboard <--> Broker
    Goals <--> Broker

    Lifecycle -. "owns subscriptions/resources" .-> EventBus
    Lifecycle -. "controls module lifecycle" .-> Loader
    Validator -. "checks contracts and capabilities" .-> Registry
```

## 2. Module Loading Flow

```mermaid
flowchart TD
    A["Discover module"] --> B["Read module manifest"]
    B --> C["Validate manifest schema"]
    C --> D{"Manifest valid?"}
    D -- "No" --> X["Reject and report Error Envelope"]
    D -- "Yes" --> E["Check minimum Host version"]
    E --> F["Check contract version support"]
    F --> G["Check required capabilities"]
    G --> H{"All requirements satisfied?"}
    H -- "No" --> X
    H -- "Yes" --> I["Select Runtime Adapter"]
    I --> J["Initialize module"]
    J --> K{"Initialization successful?"}
    K -- "No" --> X
    K -- "Yes" --> L["Register module as active"]
    L --> M["Allow subscriptions and requests"]
```

## 3. Shared Context Update Flow

```mermaid
sequenceDiagram
    participant P as Profile
    participant H as Android Host
    participant E as Event Bus
    participant D as Dashboard
    participant G as Goals

    P->>P: Execute profile domain operation
    P->>H: Notify shared-context projection change
    H->>H: Update authoritative context snapshot
    H->>E: Publish context.updated
    E-->>D: Notify active subscriber
    E-->>G: Notify active subscriber
    D->>H: Request current context snapshot
    H-->>D: Return current snapshot
    G->>H: Request current context snapshot
    H-->>G: Return current snapshot
```

`context.updated` is a proposed event and must receive a formal schema before implementation.

## 4. Module Unload and Subscription Cleanup

```mermaid
sequenceDiagram
    participant H as Android Host
    participant L as Lifecycle Manager
    participant E as Event Bus
    participant M as Module

    H->>L: Unload module
    L->>M: Stop module
    L->>E: Cancel all subscriptions owned by module
    E-->>L: Subscriptions released
    L-->>H: Module unloaded
```

## 5. Diagram Notes

- The Host owns global infrastructure and cross-module routing.
- Modules own their internal UI, business rules, state, and domain persistence.
- Modules do not call one another's internal implementations.
- All cross-module communication uses explicit contracts mediated by the Host.
- The Registry, Validator, Loader, and Lifecycle Manager are separate responsibilities.
- The diagram is conceptual; it does not prescribe concrete classes, threads, processes, or runtime embedding APIs.
