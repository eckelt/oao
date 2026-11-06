# Examples

One small, made-up shop, consistent across all files.

| File | Shows | Schema / format |
|---|---|---|
| [manifest.example.json](manifest.example.json) | the shop's manifest: one system, two containers, their interfaces and one flow | [../schema/manifest.schema.json](../schema/manifest.schema.json) |
| [landscape.example.yaml](landscape.example.yaml) | the landscape around it: repo, actor, external service, group, capabilities | [../schema/landscape.schema.json](../schema/landscape.schema.json) |
| [openspec/specs/checkout/spec.md](openspec/specs/checkout/spec.md) | a main spec in OpenSpec layout, three scenarios | OpenSpec |
| [tests/checkout.test.ts](tests/checkout.test.ts), [tests/checkout.feature](tests/checkout.feature) | how tests carry scenario ids; one scenario is left without a test on purpose | SPEC.md 5.6 and 12 |

The delta example in SPEC.md 8.3 builds on the same shop.
