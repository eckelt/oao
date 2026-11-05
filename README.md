# OAO – Open Architecture Overview

by Nils Eckelt

**Spec in, overview and delta out – for humans and agents.**

OAO reads the specs and architecture manifests of many repositories and builds one overview of the whole landscape. It shows where specs, architecture and code disagree (drift). For every planned change it shows the delta against `main` before code is written, so a person can judge a change made with a coding agent at the level of systems, contracts and capabilities.

## Status

- **Spec: public.** See [SPEC.md](SPEC.md).
- **Code: follows.** The public tool will be written in TypeScript on Bun.
- A private prototype (Python) is in daily use for the author's own landscape of a few small web products. That instance stays private.

SPEC.md marks for every part whether it is implemented in the prototype or planned for the public tool.

## Background

The idea was presented at code.talks 2026 (Hamburg, 5 November 2026) in a talk about OAO. Several listeners asked for the spec; this repository is the answer.

## How this spec was written

Claude (Anthropic) compiled SPEC.md on behalf of the author from the specs, decision records and notes in the private working repository. The author is responsible for its content.

## License

The text of this repository is licensed under [CC BY 4.0](LICENSE). Code, once added, will get its own license.
