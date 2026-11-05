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

- **Spec: public.** See [SPEC.md](SPEC.md).
- **Code: follows.** The public tool will be written in TypeScript on Bun.
- A private prototype (Python) is in daily use for the author's own landscape of a few small web products. That instance stays private.

SPEC.md marks for every part whether it is implemented in the prototype or planned for the public tool.

## How the author works with it

[SETUP.md](SETUP.md) describes the setup: one coding agent in three roles (foreman, architect, trade), the loop from sketch to deployed change, and the rules that keep it honest. It is written for people who are building something similar for their own agents.

## Background

The idea was presented at code.talks 2026 (Hamburg, 5 November 2026) in the talk “Architecture Overview gegen Comprehension Debt” (architecture overview against comprehension debt). Several listeners asked for the spec; this repository is the answer.

## How this spec was written

Claude (Anthropic) compiled SPEC.md and SETUP.md on behalf of the author from the specs, decision records, prompts and notes in the private working repository. The author is responsible for their content.

## License

The text of this repository is licensed under [CC BY 4.0](LICENSE). Code, once added, will get its own license.
