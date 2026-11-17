
# Mosaic Contracts

**Shared contracts and architectural specifications for the Mosaic multi-framework mobile architecture.**

This repository defines the technology-agnostic contracts, schemas, and architectural decisions that enable independent mobile modules to communicate and integrate through a centralized Android Host.

The goal is to establish clear boundaries between modules, standardize communication, and ensure compatibility across different mobile technologies.

## Overview

Mosaic is an architectural exploration of a multi-framework mobile application in which different modules can be developed independently using different technologies while sharing a consistent integration model.

The ecosystem currently includes:

| Repository | Responsibility | Technology |
|---|---|---|
| [mosaic-android-host](https://github.com/YOUR_USERNAME/mosaic-android-host) | Host infrastructure and native Profile module | Kotlin / Android |
| [mosaic-react-native-dashboard](https://github.com/YOUR_USERNAME/mosaic-react-native-dashboard) | Dashboard module | React Native / TypeScript |
| [mosaic-flutter-goals](https://github.com/YOUR_USERNAME/mosaic-flutter-goals) | Goals module | Flutter / Dart |
| [mosaic-contracts](https://github.com/YOUR_USERNAME/mosaic-contracts) | Shared contracts and specifications | JSON Schema / Markdown |

The Android Host is responsible for cross-module orchestration and integration. Individual modules retain ownership of their domain logic, state, and implementation.

## Repository Responsibilities

This repository is the source of truth for shared architectural contracts.

It contains:

- JSON Schemas defining communication and integration structures.
- Architectural Decision Records (ADRs) documenting relevant design decisions.
- Architecture documentation describing responsibilities and integration boundaries.
- Examples demonstrating valid contract implementations.

It does not contain application implementations, framework-specific runtime code, or module business logic.

## Contract Specifications

The current foundation is organized around the following specifications:

| ID | Specification | Description |
|---|---|---|
| MOS-001 | Multi-Repository Architecture | Defines the multi-repository strategy and project boundaries. |
| MOS-002 | Module Manifest | Defines the metadata and requirements declared by each module. |
| MOS-003 | Navigation Contract | Standardizes navigation requests and results through the Host. |
| MOS-004 | Event Communication | Defines the event envelope and inter-module event communication model. |
| MOS-005 | Shared Context | Defines the context snapshot shared by the Host and modules. |
| MOS-006 | Error Handling | Standardizes errors across module and runtime boundaries. |
| MOS-007 | Versioning & Compatibility | Defines module compatibility requirements and validation policies. |
| MOS-008 | Architecture Review | Consolidates architectural decisions, responsibilities, and integration boundaries. |

## Architectural Principles

The contracts are designed around the following principles:

### Host-mediated Integration

The Host coordinates navigation, shared context, event communication, lifecycle management, and runtime integration.

### Module Autonomy

Each module owns its domain logic, state, persistence, and implementation details.

### Technology Independence

Shared contracts describe integration behavior without coupling modules to a specific framework.

### Explicit Compatibility

Modules declare their minimum Host version, contract version, and required capabilities.

### Contract-driven Communication

Modules communicate through explicit contracts instead of depending on each other's internal implementations.

### Separation of Responsibilities

The Host provides cross-cutting infrastructure, while modules remain responsible for their own business capabilities.

## Repository Structure

```text
mosaic-contracts/
├── docs/
│   ├── adr/
│   └── architecture/
├── schemas/
│   ├── modules/
│   ├── navigation/
│   ├── events/
│   ├── context/
│   └── errors/
├── examples/
│   ├── errors/
│   └── ...
└── README.md
```

The `schemas/` directory contains machine-readable contract definitions.

The `examples/` directory contains representative payloads that demonstrate how contracts should be structured.

The `docs/` directory contains architectural decisions and supporting documentation.

## Schema Validation

JSON Schemas use the JSON Schema Draft 2020-12 specification.

The examples can be validated using Ajv CLI.

Install the development dependencies:

```bash
npm init -y
npm install --save-dev ajv-cli@5 ajv-formats
```

Validate a schema and its examples:

```bash
npx ajv-cli@5 validate \
  --spec=draft2020 \
  -c ajv-formats \
  -s schemas/modules/module-manifest.schema.json \
  -d 'examples/modules/*.json'
```

For schemas referencing other schemas, provide the referenced schema using `-r`.

Example:

```bash
npx ajv-cli@5 validate \
  --spec=draft2020 \
  -c ajv-formats \
  -s schemas/events/profile-updated.schema.json \
  -r schemas/events/event-envelope.schema.json \
  -d examples/profile-updated-event.json
```

## Current Status

The initial architectural foundation, covering MOS-001 through MOS-008, has been documented.

The contracts and examples have undergone structural validation using Ajv.

Some integration specifications remain open and will be formalized as the implementation evolves, including:

- Shared context update events.
- Host-mediated module request/response communication.
- Module Registry discovery metadata.
- Module lifecycle state machine.
- Event publication authorization.
- Capability registry and contract adapter policies.

These topics will be addressed through future architectural decisions and contract revisions.

## Project

Mosaic is an engineering project exploring the challenges of building a modular mobile application that integrates native Android, React Native, and Flutter.

The project focuses on architecture, interoperability, modularity, lifecycle management, and independent module evolution.

**Explore the ecosystem:**

- [Mosaic — Main Repository](https://github.com/BernardoLS/mosaic)
- [Android Host](https://github.com/BernardoLS/mosaic-android-host)
- [React Native Dashboard](https://github.com/BernardoLS/mosaic-react-native-dashboard)
- [Flutter Goals](https://github.com/BernardoLS/mosaic-flutter-goals)

---

*This repository evolves alongside the Mosaic project. Contracts and architectural decisions may be revised as implementation requirements and integration challenges emerge.*
