# OAO – Open Architecture Overview

Specification, as of 2026-11-05.

**Spec in, overview and delta out – for humans and agents.**

OAO reads the specs and architecture manifests of many repositories and builds one overview of the whole system landscape from them. It shows where specs, architecture and code disagree (drift). For every planned change it shows the delta against the current state, before anyone writes code. A person and a coding agent work on the same files and see the same picture.

This document describes what OAO does and why. It does not prescribe how to build it.

## Contents

1. [Status of this document](#1-status-of-this-document)
2. [Problem](#2-problem)
3. [Principles](#3-principles)
4. [Three truths](#4-three-truths)
5. [Model](#5-model)
6. [Aggregation](#6-aggregation)
7. [Drift](#7-drift)
8. [Changes and deltas](#8-changes-and-deltas)
9. [Explorer](#9-explorer)
10. [Workbench: the loop between human and agent](#10-workbench-the-loop-between-human-and-agent)
11. [Operations and access](#11-operations-and-access)
12. [Acceptance: executable scenarios](#12-acceptance-executable-scenarios)
13. [Interoperability](#13-interoperability)
14. [Implementation status](#14-implementation-status)
15. [Deferred and open](#15-deferred-and-open)
16. [Glossary](#16-glossary)
17. [Influences](#17-influences)

---

## 1. Status of this document

There are two implementations:

| | Prototype | Public tool |
|---|---|---|
| Where | private working repository of the owner | this repository |
| Language | Python scripts, static explorer page in JavaScript | TypeScript on Bun (planned) |
| State | in daily use since mid-October 2026 | not started; this spec comes first |

The prototype runs for the owner's own landscape: a handful of small web products, the tool itself, and one system that keeps its architecture in its own format. A private instance of the viewer runs on the web behind a login.

Each requirement below carries a marker:

- **[P]** implemented in the prototype
- **[T]** planned for the public tool
- **[P→T]** implemented in the prototype and carried over, possibly reshaped

The prototype uses German identifiers in files and data (for example `abgenommen`, `luecke`). This spec uses English names. Section 16 maps them. The public tool will use the English names.

Keywords: **MUST**, **SHOULD** and **MAY** as in RFC 2119.

---

## 2. Problem

Architecture diagrams are drawn by hand and age fast. Specs live in one place, code in another, and nobody checks whether they still match. With coding agents, code changes faster than any person can review it line by line. A person needs to judge a change at the level where the decisions are: which systems, which contracts, which capabilities change.

Existing formats each cover a part:

| Area | Format | Gap |
|---|---|---|
| C4 | Structurizr DSL, LikeC4 | no evidence, no drift, no planned changes |
| C4 as picture | Mermaid C4, C4-PlantUML | good for rendering, weak as a data model |
| DDD | Context Mapper (CML) | bounded contexts only |
| Catalog | Backstage `catalog-info.yaml` | manifest per repo with provides/consumes, no deltas |
| Terms | ISO/IEC/IEEE 42010 | vocabulary, no format |

No format combines C4 levels, links to specs and tests, drift, and planned changes as deltas. OAO tries to.

---

## 3. Principles

| # | Principle | Status |
|---|---|---|
| 1 | **The spec is the truth for behaviour.** Code, tests and operations derive from it or are checked against it. If the code violates the spec, fix the code with a test, or make the spec more precise. | [P→T] |
| 2 | **Spec and code change in the same commit.** A change carries its spec delta, its target architecture and its code on one branch and lands as one commit. | [P→T] |
| 3 | **Changes are diffs.** A planned change is a target state. The delta is computed by machine, never written by hand. | [P→T] |
| 4 | **Views are pure functions of the data.** Same input, same output, byte for byte. No view stores state of its own. | [P→T] |
| 5 | **Overview first, then drill down.** Start with capabilities or systems; open containers and components in place. | [P→T] |
| 6 | **Nothing is drawn by hand.** Relationships are derived from contracts. Layout is computed. | [P→T] |
| 7 | **Checks never fail silently.** Every gap is drift, a warning, or a reasoned exception. | [P→T] |
| 8 | **What a script can check, no agent checks.** Schema, drift, coverage and scenarios run as code. Agents judge only where judgement is needed. | [P→T] |
| 9 | **The human decides.** Agents propose deltas and variants. Only the owner approves. | [P→T] |
| 10 | **Trunk-based.** Short-lived change branches, spec first, review the delta, implement, squash onto `main`. | [P→T] |
| 11 | **Dogfooding.** OAO describes itself with its own model and is one system in its own landscape. | [P→T] |

---

## 4. Three truths

There are three maintained truths, each with its own scope. None is generated from another. Drift checks the names where they touch.

| Truth | Question | Where |
|---|---|---|
| **Spec** | What and why: observable behaviour, also at the boundary to the outside | `openspec/specs/<capability>/spec.md` in each repo |
| **Architecture** | What constrains the how: boundaries, responsibilities, contracts, data ownership, where it runs, and why | the manifest in each repo, plus decision records (`docs/adr/`) |
| **Operations and access** | Where and with what it runs | the native formats of the tools (for example `wrangler.toml`, CI workflows, later Terraform or CDK) and an access register |

They touch only through names:

- A spec belongs to a building block through the capability name in `specs[]` of the block.
- A runtime unit from the operations files belongs to exactly one container.
- Drift reports a spec without a building block, a container without a runtime unit, a runtime unit without a container.

Further rules:

- **Specs contain no code locations.** No file paths, no line numbers, no fixed values that depend on the how. Links from scenarios to code are derived from tests (section 12). [P]
- **Design is not a standing truth.** Before implementation, design is the plan inside a change. After implementation, the code is the design. A design decision that is expensive to change is architecture and goes into a decision record and the manifest. [P]
- **Components are not maintained in the manifest.** They are read from the code for display. New components are discussed as a plan in a change. [T; the prototype still has optional `components[]`]

---

## 5. Model

### 5.1 Documents

| Document | Written by | Content |
|---|---|---|
| **Manifest** – one per repo, `twin.json` (later `architecture.json`) | human or agent | the own system: id, name, one-line summary, containers, interfaces, flows, links to specs and decision records |
| **Landscape** – one per installation, `landscape.yaml` | human or agent | registry of repos, actors, external services, groups, capabilities |
| **Aggregate** | only the generator | the whole landscape: nodes, derived edges, contracts, drift, specs, scenarios, decisions, capabilities, operations |

Each document has a JSON Schema in strict mode (`additionalProperties: false`). A manifest that contains edges or contracts fails validation: those are derived. [P→T]

The prototype uses JSON for manifests and YAML for the landscape file. The public tool keeps JSON for manifests (agents write it reliably and the schema checks it directly) and MAY accept YAML for both.

### 5.2 Elements

| Element | Declared in | C4 / Structurizr / LikeC4 | Notes |
|---|---|---|---|
| group | landscape | group | groups systems for the top level |
| actor | landscape | person | only consumes |
| system | manifest | softwareSystem | one per repo; `kind`: product, tool, library |
| external service | landscape | softwareSystem, tag `external` | only provides; vendor, category, console or docs link |
| container | manifest | container | `kind` (app, service, pipeline, …), `technology` |
| component | derived from code | component | see section 4 |
| capability | landscape | – | business view, see 5.5 |
| edge | derived | relationship | from matching contracts, see 6.2 |

Every element **MUST** have a one-line `summary` (at most 120 characters): for a system, what it is for; for a container, its role; for a component, what it does. [P]

A container MAY have a public `url` (https only). The explorer offers "open" for it on every level. [P]

### 5.3 Interfaces and contracts

Relationships are not drawn. They follow from interfaces.

- An interface has a `direction` (`provides` or `consumes`), a `contractRef` of the form `<owner>:<name>@<version>`, a `protocol` and a `summary`.
- A consuming interface MAY carry a `relation`: `calls` (default), `links-to`, `reads`, `writes`, `imports`, `deploys-to`. A providing interface MUST NOT.
- The owner prefix names the system or external service that owns the contract.

```json
{
  "id": "api",
  "direction": "consumes",
  "contractRef": "shop:orders@1",
  "protocol": "HTTPS JSON",
  "summary": "Loads open orders"
}
```

### 5.4 Flows

A manifest MAY declare flows: a named, linear list of steps. Each step names `from`, `to`, the `contractRef` used, and a sentence. The aggregate binds every step to the edge it uses. A step without a matching edge is drift (`flow-broken`). [P]

### 5.5 Capabilities

A capability is what the landscape lets someone do, independent of which system does it. Capabilities form a tree in the landscape file. Only leaves carry data. [P]

Maintained per capability: id, name, summary, children or specs, optionally `externals` (external services that carry a leaf instead of own specs), `planned` and `retiring`, each with a reason.

Everything else is derived:

| Derived | Rule |
|---|---|
| **signal** | first match: `drift` (drift on the capability) → `tested` (every scenario of its specs has a test) → `specified` (has specs) → `external` (no specs, but external services) → `gap` (neither) |
| **lifecycle** | `active` if a spec exists on `main` or an external service carries it; else `in-progress` if a change being implemented adds a spec to it; else `planned` if an open change adds one or the capability is marked `planned`; else none (a gap) |
| carrying systems, users, flows, open changes | from specs, actors and change branches |

```yaml
capabilities:
  - id: sell-online
    name: Sell online
    summary: Customers order without calling.
    children:
      - id: place-order
        name: Place an order
        summary: Pick items and order them.
        specs: [shop:checkout, shop:orders-api]
      - id: send-invoices
        name: Send invoices
        summary: Invoices go out by mail.
        externals: [invoicing-service]
      - id: track-returns
        name: Track returns
        summary: Follow up on returned items.
        planned: Done by hand today; no system yet.
```

### 5.6 Specs, scenarios and coverage

Specs follow the OpenSpec layout: one folder per capability, requirements with **SHALL**, scenarios with **WHEN/THEN**. [P]

- Each scenario has a stable id. Duplicate ids are drift.
- A spec MAY carry a header `Status: reconstructed` (describes today's behaviour, not yet accepted) before its purpose. Without the header it counts as `accepted`.
- The generator computes a **coverage stage** for every system, container and component. Nobody declares it. Without inheritance downwards:

| Stage | Meaning |
|---|---|
| `none` | no own spec, no evidence |
| `derived` | no own spec, but evidence (code locations) |
| `reconstructed` | own spec(s), at least one reconstructed |
| `accepted` | all own specs accepted |
| `evidenced` | all own specs accepted, and every scenario has a test |

### 5.7 Decisions

Architecture decisions are MADR files in `docs/adr/` of the repo they concern, with headers for status, date, change, variant and "superseded by", and the sections context, decision, considered options, consequences. Elements link to them via `adrs[]`. The aggregate collects all decisions with status and affected nodes. [P]

Only real architecture decisions become records, always with the alternatives weighed. A decision that supersedes an unknown id is drift (`orphan-decision`).

### 5.8 Example manifest

```json
{
  "schemaVersion": 4,
  "system": {
    "id": "shop",
    "name": "Shop",
    "summary": "Lets customers order online.",
    "repository": "example/shop",
    "specs": ["checkout", "orders-api"],
    "adrs": ["docs/adr/2026-10-01-orders-as-events.md"]
  },
  "containers": [
    {
      "id": "web",
      "name": "Storefront",
      "kind": "app",
      "technology": "TypeScript",
      "summary": "Public pages where customers pick and order items.",
      "url": "https://shop.example.com",
      "specs": ["checkout"],
      "interfaces": [
        { "id": "site", "direction": "provides", "contractRef": "shop:site@1", "protocol": "HTTPS HTML", "summary": "Storefront" },
        { "id": "api", "direction": "consumes", "contractRef": "shop:orders@1", "protocol": "HTTPS JSON", "summary": "Creates orders" }
      ]
    },
    {
      "id": "api",
      "name": "Orders API",
      "kind": "service",
      "technology": "TypeScript",
      "summary": "Accepts orders and hands them to invoicing.",
      "specs": ["orders-api"],
      "interfaces": [
        { "id": "orders", "direction": "provides", "contractRef": "shop:orders@1", "protocol": "HTTPS JSON", "summary": "POST order, GET status" },
        { "id": "invoice", "direction": "consumes", "contractRef": "invoicing-service:api@2", "protocol": "HTTPS JSON", "summary": "Creates an invoice" }
      ]
    }
  ],
  "flows": [
    {
      "id": "order",
      "name": "Place an order",
      "steps": [
        { "from": "shop/web", "to": "shop/api", "contractRef": "shop:orders@1", "text": "Storefront sends the order." },
        { "from": "shop/api", "to": "external/invoicing-service", "contractRef": "invoicing-service:api@2", "text": "API asks for an invoice." }
      ]
    }
  ]
}
```

---

## 6. Aggregation

### 6.1 Sources

- The generator **MUST** read every repo listed in the landscape at the current commit of `origin/<branch>`, not the local working tree. The overview shows what is integrated. [P]
- For local work it MAY read a working tree or a local clone instead, named per repo. [P]
- A repo without a manifest or without access is a warning, not an abort. [P]
- The tool describes itself: its own repo is listed in the landscape and read like any other. [P]

### 6.2 Deriving relationships

Every consuming interface, from a manifest or from an actor, is matched against all providing interfaces with an identical `contractRef`. Providers include external services. [P]

| Case | Result |
|---|---|
| exactly one provider | edge `<from>=><to>:<contractRef>` |
| no provider, same contract offered in another version | drift `version-mismatch` (with the versions offered) |
| no provider | drift `unmatched-consumer` |
| several providers | drift `ambiguous-provider`, no edge |
| provider without consumer | `unmatched-provider` (info) |
| provider outside the owner named in the prefix | drift `foreign-provider`; the edge still exists |

**Invariant:** every consuming interface yields exactly one edge or exactly one consumer-side drift entry. JSON Schema cannot express this; tests of the generator guard it. [P→T]

Each edge records its provenance: derived by which rule, from which commit, declared in which files (both ends).

### 6.3 Views

Architecture is what crosses a boundary. Design is everything inside a boundary. Operations is everything that ships and hosts. Every element and edge belongs to exactly one view; the generator derives it. Manifests stay unchanged. [P]

| View | Rule (first match) |
|---|---|
| operations | an end is a pipeline, or the edge deploys, delivers or wires hardware |
| design | structural edges inside a container |
| architecture | runtime edges from the container boundary up, `imports` from the system boundary up |

### 6.4 Determinism

Two runs on the same input **MUST** produce the same aggregate, byte for byte, except the build time. All lists have a defined order. [P→T]

### 6.5 Translators

A repo with its own architecture format is read through a translator plugin named in the landscape (`source: translate:<name>`). The translator is pure: no file, git or network access, same input gives the same output. The original stays the only source; the repo does not know OAO exists. [P]

### 6.6 Outputs

- one aggregate of the current state
- one target aggregate per open change and per variant, plus an index of changes
- the build runs in CI on a schedule and on push; the built data does not live on `main` but on a separate, append-only data branch, so every earlier state can be shown again [P]

---

## 7. Drift

Drift is any place where the truths disagree, or where a promise has no proof. Every drift entry names the node, a severity (`warning` or `info`) and enough detail to act on.

| Group | Drift | Meaning |
|---|---|---|
| contracts | `unmatched-consumer`, `ambiguous-provider`, `version-mismatch`, `foreign-provider`, `unmatched-provider` | see 6.2 |
| flows | `flow-broken` | a step without a matching edge (unknown node, no edge, other contract) |
| documents | `missing-doc` | a spec or decision record that is referenced but missing at the commit read |
| decisions | `orphan-decision` | "superseded by" names an unknown decision |
| specs | `spec-without-block`, `spec-without-capability`, `capability-spec-unknown` | specs and building blocks or capabilities do not meet |
| specs | `location-in-spec` | a spec contains a code location |
| scenarios | `scenario-without-test`, `test-without-scenario` | a scenario id without a test carrying it, or the other way round |
| changes | `stale-base` | the branch of a change is behind `main` in files it touches |
| operations | `deploy-failed`, `undeployed` | the last deploy failed; `main` has commits on deploy-relevant paths that are not live |
| access | `credential-expired`, `credential-expiring`, `credential-missing`, `credential-unused`, `credential-overprivileged`, `credential-stale`, `credential-unknown` | see section 11 |

All listed drift is implemented in the prototype [P]. The original idea also listed a cycle check between systems [T].

A gap that is accepted on purpose **MUST** be written down with a reason, for example a scenario that deliberately has no test. An entry without a reason, or one that is no longer needed, is itself drift. [P]

---

## 8. Changes and deltas

### 8.1 A change is a branch

- Each change has a short-lived branch `change/<slug>` in every repo it touches. [P]
- On that branch the root manifest **is** the target state. There are no copies of the target. [P]
- Proposal, spec deltas, decision records and mock-ups live on the branch under `openspec/changes/<slug>/`. [P]
- Agents and tools work in their own worktrees, never in the working tree of the owner. [P]
- Manifests are merged structurally by a merge driver, not as text. [P]
- No pipeline deploys from a change branch. [P]
- A change ends with one squash commit per repo on `main`, with a trailer naming the change. Then the branch is deleted. [P]

### 8.2 Variants

If there is more than one sensible way, the change has variants: one branch `change/<slug>--<variant>` per variant, each with its own complete target state and an explanation. Variant ids are the same across repos. [P]

When the owner picks a variant, that branch becomes the change branch, the other variants are deleted, and the choice is recorded as a decision record in each affected repo. [P]

### 8.3 Delta

The delta is the difference between the target aggregate of a change and the current aggregate. It is computed, not written. [P]

- Nodes are matched by id, edges by id.
- A node counts as changed on name, summary, kind, view, url, or interfaces (direction, contract, protocol). An edge counts as changed on perspective, kind, protocol, view or summary. Each change carries a short reason (for example "interfaces +shop:orders@2").
- Decisions and capabilities are compared the same way. A capability change also shows the change of its signal (for example "signal gap → specified").
- **Drift first:** new and removed drift come before nodes, edges, decisions and capabilities.
- The delta exists as text (for agents and terminals) and as JSON (for tools and the explorer), with a closing sum line.

### 8.4 Stale base

If `main` moved on in files a change branch touches, the target aggregate carries `stale-base` drift with the number of commits. The owner can trigger "rebase" from the workbench; an agent then rebases the branch onto `main`. The current-state aggregate never contains this drift. [P]

---

## 9. Explorer

The explorer shows an aggregate as an explorable map. It is a static page without a build step. It reads the current aggregate and, for a change, the target aggregate. [P]

### 9.1 Three entry points

| Entry | For | Shows |
|---|---|---|
| **Capabilities** | building something new | tiles per capability with signal, lifecycle, drift and open changes; a click leads into the landscape to the carrying systems |
| **Landscape** | technology | groups, systems, containers, components; only the architecture view; design appears inside an opened container |
| **Operations** | running it | pipelines, hosting, deploys, live state; a status wall per provider |

An entry appears only if the aggregate has data for it.

### 9.2 Navigation

- Levels: groups, systems, containers, components. Opening a box happens in place; neighbours move aside, the rest of the map keeps its place. [P]
- Isolation of one element with its neighbours, flows step by step, external services and actors as optional stubs at the edge. [P]
- Search, legend, filters, keyboard use, deep links for every state (level, focus, flow, opened boxes, filters). [P]
- Layout is deterministic: the same aggregate gives the same map. Boxes do not overlap; crossings are avoided where possible. [P]
- Usable on a phone, portrait and landscape. [P]

### 9.3 Drift and coverage on the map

- Drift is a hard outer glow around a box and its stack, never a normal border. Glows can stack. Borders are reserved for drift, selection and search hits. [P]
- A gap list shows coverage per stage and every scenario without a test. [P]

### 9.4 Delta overlay

For a change, the explorer lays the delta over the current map, with the same rules as 8.3: new green, changed yellow, removed red. Variants can be switched. Mock-ups of a change can be previewed in light and dark, desktop and phone, and compared side by side across variants. Mock-ups are embedded in a sandbox. [P]

### 9.5 Control room

The header shows "⚡ n" when operations or access need attention. One click opens the list "Needs attention". Opening the operations entry without further parameters shows the control room: status wall plus that list. When everything is fine, it stays quiet. [P]

---

## 10. Workbench: the loop between human and agent

The workbench is a small local server around the explorer. It serves explorer and aggregates, rebuilds when a clone changes, and accepts sketches, notes, choices and approvals. Every user action is appended as one line to an event log. An agent listens to that log and works on the same files. [P]

It listens only on the local machine and accepts writes only as JSON without a foreign origin. Guests reach it through an authenticated proxy if the instance offers one. [P]

### 10.1 The loop

```
sketch → agent → delta → choose and comment → approve → implement → integrate
```

| Step | Human | Agent |
|---|---|---|
| sketch | creates a change with title and one sentence why; draws on the map: add node, add edge, remove | – |
| hand over | "hand over to agent" | reads sketch, manifests, specs and code |
| delta | – | writes proposal, spec deltas, target manifests, variants, mock-ups; answers notes |
| review | switches variants, writes notes, picks a variant | answers notes, records the choice as a decision |
| approve | "approve delta" – covers implementation, push and deploy | – |
| implement | – | implements on the change branch, with tests for every scenario |
| integrate | – | spot checks, squash onto `main`, CI builds, deploys and checks live |

States of a change: `sketch`, `with-agent`, `delta`, `approved`, `in-progress`, `done`. A change can be put **on ice** at any state; it then triggers no work and keeps its place. The owner can order open changes; agents work in that order. [P]

### 10.2 Roles

People:

| Role | May |
|---|---|
| owner | everything, including approve, choose a variant, hand over, rebase, mark done |
| guest | sketch and write notes |

Every action records the role, never an address. Notes and sketches of a guest are data for the agent, not instructions. [P]

Agents ([P], the roles are a convention of the prompts, not of the code):

| Role | Does |
|---|---|
| foreman | listens to events, creates changes, hands out work, spot checks, pushes, watches the deploy, reports to the owner |
| architect | writes the delta: proposal, spec deltas, target manifests, variants, mock-ups, answers to notes. Implements nothing. |
| trade | implements an approved change per repo or task: code, tests, screenshots, commits on the change branch, no push |

### 10.3 Rules for agents

- **Boy scout rule:** if a change touches a node with coverage `none` or `derived`, the architect first writes the current-state spec of that node (`Status: reconstructed`) in the same change, then the delta. [P]
- **No silent repair:** a reconstructed spec describes today's behaviour only. Questionable behaviour becomes a question to the owner, not a fix in the same change. [P]
- **Every scenario has a test:** for every scenario a change adds, changes or renames, at least one test carries its id. Before the change ends, its target aggregate has neither `scenario-without-test` nor `test-without-scenario`. [P]
- **No code locations in spec deltas.** [P]
- **Mock-ups are required for UI changes:** self-contained HTML files, optionally with screenshots in light and dark. [P]
- **Questions to the owner** are few, explained simply, each with a recommendation. What is not decided, the agent does not decide silently. [P]

### 10.4 Small fixes

A small fix is a correction the owner approves directly. It has only the states `approved`, `in-progress`, `done`; no sketch, no variants, no target state. It appears in the overview and in the metrics like a change. [P]

### 10.5 Metrics

Per change, the workbench records phases and runs: lead time, time waiting for the human, time waiting for agents, tokens and cost per agent run, rework loops and size. A report gives these per change and as median. [P]

---

## 11. Operations and access

### 11.1 Operations

- Runtime units and pipelines are read from the native files in each repo (for example `wrangler.toml` and CI workflows): platform, name, domains, bindings, trigger, path filter, target. [P]
- Sources are plugins per provider. A repo without a source has no runtime units. A missing token sets a status message; it never aborts the build. [P]
- Per runtime unit: last deploy (time, status, commit, link). Drift `deploy-failed` and `undeployed`. [P]
- Live metrics (requests, error rate, response time, synthetic checks) come from a read-only endpoint of the viewer, cached, and only after login. Running deploys show live, with an estimated duration. [P]
- No account, zone or token ids are written to the aggregate. [P]

### 11.2 Access

An access register in the landscape repo maps every secret to an access: provider, name at the provider, holders, used by which nodes, expected permissions, expected expiry. It never contains secret values or ids. Matching with the provider happens by name. [P]

Permissions, expiry and last use are fetched live and shown only to the owner. Drift reports expired, expiring, missing, unused, overprivileged and stale credentials. [P]

---

## 12. Acceptance: executable scenarios

- Every scenario that is observable at the boundary of an implementation (input in, output out) has an executable counterpart in standard Gherkin, tagged with the scenario id (`@spec:<id>`). [P]
- Step definitions form a small, fixed vocabulary with parameters, not one step per scenario. Steps check only what a spec, a schema description or an example fixes. For warnings, the cause counts, not the wording. [P]
- Drivers call an implementation at its boundary: the aggregator (repos and landscape in, aggregate out), the delta tool (command line), later the workbench (HTTP) and the explorer (browser). [P]
- A foreign implementation is attached through a call template and a list of its abilities. A scenario that needs an ability the implementation lacks is skipped with a reason, never silently. [P]
- The generator counts tests and feature files that carry a scenario id as evidence (section 5.6). Links from scenario to test are always derived, never maintained. [P]
- **Rebuild test:** an agent rebuilds the tool from the specs alone, and the same scenarios run against the rebuild. This checks whether the specs are complete. A first run reproduced the aggregator output field by field; the run for the explorer is not yet conclusive. [P, experimental]

The public tool runs the same Gherkin files with Cucumber.js. [T]

---

## 13. Interoperability

| Direction | Target | Status |
|---|---|---|
| export | LikeC4, Structurizr DSL (mapping in 5.2) | [T] |
| export | Context Mapper (CML), once bounded contexts exist | [T] |
| import | other architecture formats through translators (6.5) | [P] one translator; [T] more |
| delta for agents | text and JSON (8.3) | [P] |

---

## 14. Implementation status

| Part | Prototype (Python) | Public tool (TypeScript/Bun) |
|---|---|---|
| schemas: manifest, landscape, aggregate | done | carry over |
| aggregator with relationships, drift, coverage, capabilities, flows, decisions | done | planned |
| target aggregates per change and variant from change branches | done | planned |
| delta tool (text, JSON) | done | planned |
| explorer (static page) | done | planned |
| workbench server, event log, roles, metrics | done | planned |
| change branch tooling, structural merge driver | done | planned |
| operations and access readers | done for one hosting provider and one CI | planned as plugins |
| executable scenarios | runner done; many scenarios still without tests | planned with Cucumber.js |
| translators | one | planned |
| exports to LikeC4, Structurizr, CML | – | planned |
| bounded contexts | – | deferred |
| CLI for agents ("spec in, overview and delta out") | scripts | planned as one CLI |

The public tool keeps the contracts: schemas, file layout, command line, workbench files. The language is free; the specs and contracts are binding, not the implementation language.

---

## 15. Deferred and open

| Topic | State |
|---|---|
| **Bounded contexts** (DDD) with context map patterns from Context Mapper | deferred; decided not to model them yet |
| **Core and adapters** (hexagonal) marked in the model | open |
| **Manifest without operations data**: pipelines, deploy edges and free-text deployment move to the operations readers | decided, not yet done |
| **Workbench files on the change branch** and CI reading change branches | planned (stage 2) |
| **Workbench in the cloud** instead of local | planned |
| **Target state for translated repos** on their own branch | planned (stage 3) |
| **A change changes behaviour or implementation, not both** | idea, not yet a rule |
| **Measure single-agent changes against changes with architect and trades** | idea |
| cycle check between systems | idea from the first draft |

---

## 16. Glossary

| Term | Meaning | Prototype name |
|---|---|---|
| manifest | architecture of one repo | `twin.json` |
| landscape | registry of repos, actors, externals, capabilities | `landscape.yaml` |
| aggregate | generated overview of the whole landscape | `twin/latest.json` |
| current state / target state | aggregate of `main` / of a change | Ist / Soll |
| change | planned change with its own branch | Change |
| small fix | change without delta, approved directly | Kleinfix |
| capability | what the landscape lets someone do | Fähigkeit |
| signal | derived state of a capability | Ampel (`drift`, `geprueft`, `spezifiziert`, `extern`, `luecke`) |
| lifecycle | `planned`, `in-progress`, `active`, `retiring` | `geplant`, `in-arbeit`, `aktiv`, `auslaufend` |
| coverage stage | `none`, `derived`, `reconstructed`, `accepted`, `evidenced` | `keine`, `abgeleitet`, `rekonstruiert`, `abgenommen`, `belegt` |
| change states | `sketch`, `with-agent`, `delta`, `approved`, `in-progress`, `done`, on ice | `skizze`, `beim-agenten`, `delta`, `freigegeben`, `in-umsetzung`, `umgesetzt`, auf Eis |
| views | architecture, design, operations | `architektur`, `design`, `betrieb` |
| workbench | local server for the human–agent loop | Werkbank |
| control room | operations entry with "Needs attention" | Leitwarte |
| owner / guest | human roles | `inhaber` / `gast` |
| foreman / architect / trade | agent roles | Polier / Architekt / Gewerk |
| drift names | contract, flow and operations drift keep their English names; spec, scenario and change drift are German in the prototype | e.g. `szenario-ohne-test`, `soll-basis-veraltet`, `fundstelle-in-spec` |
| acceptance | executable scenarios | `abnahme/` |

---

## 17. Influences

- C4 model (Simon Brown) for the levels; Structurizr and LikeC4 as export targets.
- Domain-Driven Design (Eric Evans) and Context Mapper for bounded contexts, still deferred.
- Backstage catalog files for the idea of a manifest per repo with provides and consumes.
- ISO/IEC/IEEE 42010 for viewpoints and views.
- Architectural Decision Records in the MADR format.
- OpenSpec for the layout of specs and spec deltas.
- Gherkin and Cucumber for executable scenarios.
- *Building Evolutionary Architectures* (Neal Ford, Rebecca Parsons, Patrick Kua): drift checks work like fitness functions.
- *Design Rules* (Carliss Baldwin, Kim Clark): option value of modules; variants per change are cheap parallel experiments.
