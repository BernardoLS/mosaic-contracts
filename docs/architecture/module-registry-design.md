# Module Registry — Conceptual Design

## 1. Purpose

The Module Registry is a Host-owned component responsible for discovering and describing modules available to the Mosaic application.

It provides the information required by compatibility validation and module loading. It does not initialize modules and does not own their runtime lifecycle.

## 2. Responsibilities

The Module Registry is responsible for:

- Discovering module entries from Host-configured sources.
- Exposing each module's manifest to the Compatibility Validator.
- Providing a Host-managed reference to the module implementation artifact or installation source, where applicable.
- Reporting whether a module is available for discovery.
- Rejecting duplicate or conflicting module identifiers according to a policy defined by the Host.

The Registry is not responsible for:

- Validating runtime compatibility (Compatibility Validator).
- Initializing or unloading modules (Module Loader).
- Managing active runtime resources (Lifecycle Manager).
- Owning module business data or persistence.

## 3. Conceptual Entry

A registry entry conceptually contains:

| Field | Meaning |
|---|---|
| `manifest` | The module's Module Manifest, including ID, name, version, runtime, compatibility, and required capabilities. |
| `artifactReference` | Host-managed reference to the implementation artifact or installation source, if applicable. |
| `availability` | Whether the module is discoverable and available to be considered for loading. |

This is a conceptual model, not a finalized JSON schema.

The current `module-manifest.schema.json` does not define `artifactReference` or `availability`. Do not add these fields to the manifest merely to satisfy this conceptual Registry design. A separate Registry contract or Host-internal model may be introduced when the artifact delivery and discovery mechanism is selected.

## 4. Separation from Runtime Lifecycle

Discovery and runtime state are different concepts.

A module may be:

- Known to the Registry but not currently loaded.
- Available for loading but not yet compatibility-validated.
- Compatible but not yet initialized.
- Initialized and active.
- Unloaded after previously being active.

The exact lifecycle state machine and state names are not defined by this document. They belong to the Module Lifecycle specification.

## 5. Integration Flow

1. The Registry discovers a module and exposes its manifest.
2. The Compatibility Validator validates the manifest and its requirements.
3. If compatible, the Module Loader selects the appropriate Runtime Adapter.
4. The Lifecycle Manager coordinates initialization and resource ownership.
5. On unload, the Lifecycle Manager releases module-scoped resources, including Event Bus subscriptions.

## 6. Open Decisions

Before implementation, define:

- The source of module artifacts: bundled, downloaded, installed, or another mechanism.
- Artifact identity, integrity, and version verification.
- Duplicate module ID policy.
- Registry refresh and update behavior.
- Whether registry entries are static at build time or dynamically discovered.
- The lifecycle state machine and its transitions.
- Whether Registry metadata requires a versioned external contract or can remain Host-internal for the initial implementation.
