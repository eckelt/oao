# OAO – Open Agentic Overview

by Nils Eckelt

*OAO stands for **Open Agentic Overview** and is pronounced like “WOW!”.*

**Spec in, overview and delta out – for humans and agents.**

## What it is for

When coding agents write most of the code, nobody reads all of it anymore. Understanding falls behind the code: comprehension debt. OAO keeps an overview that a person and an agent share. You use it to:

- **See your own system landscape** – capabilities, systems, containers and their contracts – built from the specs and manifests in your repos, not drawn by hand.
- **See the delta of a change before code exists** – which systems, contracts, capabilities and decisions a planned change touches, with variants to choose from.
- **Detect drift** between spec, architecture, code and operations – a contract nobody provides, a scenario without a test, a commit on `main` that is not deployed.

## Status

- **Spec: public.** See [SPEC.md](SPEC.md), with draft JSON Schemas in [schema/](schema/) and examples in [examples/](examples/).
- **Code: follows.** The language is not fixed yet. The spec and its contracts are binding, not the implementation language.
- A private prototype (Python) is in daily use for the author's own landscape of a few small web products. That instance stays private.

SPEC.md marks for every part whether it is implemented in the prototype or planned for the public tool.

## Start without the tool

You do not need OAO to get most of the benefit. Four steps, in any repo:

1. **Main spec into the repo.** Only the *what*: observable behaviour, as requirements and scenarios. The [OpenSpec](https://github.com/Fission-AI/OpenSpec) layout works well; see [examples/openspec/](examples/openspec/).
2. **Changes only as delta specs.** Review the delta, not the code. The delta is merged into the main spec when the change lands.
3. **Keep the *how* separate.** A manifest per repo and decision records (ADRs), drawn as an overview. A Mermaid diagram is enough to start; [examples/manifest.example.json](examples/manifest.example.json) shows what a manifest holds.
4. **Test the spec with a rebuild.** Let an agent build the thing from the spec alone in an empty repo. What it gets wrong shows what your spec is missing.

Build the tool you need. OAO is one example.

## How the author works with it

[SETUP.md](SETUP.md) describes the setup: one coding agent in three roles (foreman, architect, trade), the loop from sketch to deployed change, and the rules that keep it honest. It is written for people who are building something similar for their own agents.

## Background

The idea was presented at code.talks 2026 (Hamburg, 5 November 2026) in the talk “Architecture Overview gegen Comprehension Debt” (architecture overview against comprehension debt). Several listeners asked for the spec; this repository is the answer. Slides and write-up: [ecke.lt/codetalks](https://ecke.lt/codetalks).

## How this spec was written

Claude (Anthropic) compiled SPEC.md and SETUP.md on behalf of the author from the specs, decision records, prompts and notes in the private working repository. The author is responsible for their content.

## License

Copyright (c) 2026 Nils Eckelt. The text of this repository is licensed under [CC BY 4.0](LICENSE) (full legal code in `LICENSE`). Code, once added, will get its own license.
