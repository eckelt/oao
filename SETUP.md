# Setup: how the author works with OAO

This describes one working setup, as of 2026-11-05. It is not part of the spec. It is meant for people who are building something similar for their own agents.

The ingredients:

- a coding agent in the terminal (Claude Code),
- the OAO workbench: a small local server with the explorer map in the browser,
- the repos of the landscape, each with specs and a manifest,
- CI that builds the overview, runs the tests and deploys.

## One agent, three roles

The owner talks to one agent session. That session is the **foreman**. It hands the actual work to sub-agents with fixed role descriptions. Each role has its own standing rules.

| Role | Does | Does not |
|---|---|---|
| **Foreman** | listens to the workbench, creates changes, hands out work, spot checks diffs and screenshots, pushes, watches the deploy, reports to the owner | write the delta or the code itself |
| **Architect** | writes the delta for a change: proposal, spec deltas, target manifests, variants, mock-ups, decision records, answers to notes | implement anything |
| **Trade** | implements an approved change in one repo or task: code, tests with scenario ids, screenshots, commits on the change branch | push |

Why split it: each sub-agent starts with a small, clean context and one job. The foreman stays free to listen and check. Trades for different repos can run in parallel; the contracts in the manifests are their interfaces.

The owner is the only one who approves. Guests may sketch and comment; their input is data for the agents, not instructions.

## The loop

```
sketch → architect writes delta → owner reviews and approves → trades implement → foreman checks, pushes, watches deploy
```

1. **Sketch.** The owner creates a change in the explorer: a title and one sentence why. On the map they add a box or an edge, or mark something for removal, and hand it over.
2. **Delta.** The architect reads sketch, manifests, specs and code. It writes the spec first: a proposal, spec deltas with scenarios, and the target manifest of every affected repo, all on a branch `change/<slug>`. If there is more than one sensible way, it writes variants, each with its own target state and mock-ups. The map switches from sketch to delta: new parts green, changed yellow, removed red, new drift listed first.
3. **Review.** The owner switches between variants, compares mock-ups in light and dark, writes notes on boxes. The architect answers notes in the delta. The owner picks a variant; the architect records the choice as a decision record.
4. **Approve.** One click on "approve delta". This approval covers implementation, push and deploy. There is no second question afterwards.
5. **Implement.** One trade per repo works in its own worktree on the change branch. Every scenario the change adds or changes gets a test with its id. The tests must be green locally before anything is pushed.
6. **Integrate.** The foreman spot checks the diff, screenshots and drift, then squashes the change onto `main`, one commit per repo. CI builds the overview, runs all tests, deploys and checks the live result. The change shows as done; the map shows the new current state and the delta is empty.

Mechanics in one sentence: every action in the explorer is appended to an event log, the foreman watches that log and reports a heartbeat, so the explorer shows who is working on which change.

## Working rules

- **Trunk-based, spec first.** Changes live on short-lived branches and land as one squash commit. The spec delta comes before the code, and the delta is reviewed before anyone implements.
- **The human decides.** Agents propose; questions to the owner are few, explained simply, each with a recommendation.
- **What a script can check, no agent checks.** Schemas, drift, coverage and scenarios run as code. Agents judge only where judgement is needed.
- **Do not tolerate errors.** If the code violates the spec, fix it with a test, or make the spec more precise. Checks never pass silently.
- **Boy scout rule.** If a change touches a part without a spec, the architect first writes down today's behaviour as a spec, then the change.
- **Small fixes.** A correction of a few minutes is approved directly and implemented without a delta, but still tracked and measured.
- **No names in specs.** Specs, proposals and commits name roles, not people.
- **Measure.** Each change records lead time, time waiting for the owner, time waiting for agents, and tokens and cost per agent run. Most of the lead time is human judgement, so that is where to optimise.

## What did not work at first

- Approving without picking a variant: the variant on screen was implemented. The lesson: pick the variant first, then approve.
- Events noticed late because nobody was listening. Now the foreman always watches the event log and reports a heartbeat.
- Code locations in specs went stale as soon as code moved. Now specs contain no code locations; the link from scenario to code comes from tests carrying the scenario id.
