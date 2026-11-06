# Schemas

Drafts for the public tool, JSON Schema 2020-12, strict (`additionalProperties: false`).

| File | Document |
|---|---|
| [manifest.schema.json](manifest.schema.json) | manifest, one per repository (SPEC.md 5.1–5.4) |
| [landscape.schema.json](landscape.schema.json) | landscape, one per installation (SPEC.md 5.1, 5.5) |

The aggregate schema follows with the tool.

These drafts are derived from the prototype's schemas, translated to the English names of SPEC.md and reduced to what the spec describes. The prototype still has fields for its own operations that are not part of the contract. `schemaVersion: 4` keeps the version line of the prototype's manifest.

The files in [../examples/](../examples/) validate against them with any JSON Schema 2020-12 validator, and a manifest with `edges`, or a `relation` on a providing interface, is rejected.
