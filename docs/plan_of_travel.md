# ai-pharius - Plan of Travel

> The Hydra reads the books, thinks it through before the game, and hands you a plan.

Roadmap for **ai-pharius**: a personal 11th-edition match-planning coach with a **GitHub Pages** front door and an **authenticated** Cloud Run API.

Canonical mission, non-goals, diagrams, and reasoning philosophy: **[design.md](design.md)**.

---

## Principles

1. **Consumer only for rules/facts** - no PDF download, no embed jobs, no corpus writes in this repo.
2. **Reason, never memorize** - tactical conclusions (attachments, target priority, "good vs") must be derivable from real profiles, ability text, and rules every time. No hardcoded matchup answers.
3. **Dice math is a tool** - any hit/wound/save/expected-damage claim goes through a deterministic, comparative (what-if) calculator, not LLM arithmetic.
4. **Match Plan is the flagship mode** - pre-game, given your list plus whatever you know of the opponent. Not a mid-game chatbot.
5. **State your assumptions** - when the opponent's exact list is unknown, say so and flag guessed units clearly (backed by a Dave-curated `common_builds.yaml`, not invented).
6. **Auth from day one of the API** - Firebase Google sign-in; allowlisted to Dave. Pages shell may be public; the API is not usable without it.
7. **11th edition only**.
8. **Measure reasoning, not recall** - golden cases score whether the reasoning process reaches a sound, derivable conclusion (e.g. the Rubric-attachment case), never whether an answer was retrieved from storage.

---

## Shared corpus (read-only)

Ingest and structured publishes live elsewhere ([roboto-guilliman](https://github.com/Tyberium/roboto-guilliman)). Hydra needs:

| Need | Source (when available) |
|------|-------------------------|
| Core rules citations | Vector collection `warhammer_rules_11th` |
| Stratagem / detachment text | Same index after faction packs are ingested |
| Unit points | Structured `unit_points` (Munitorum-derived) |
| Weapons / profiles / ability text | Structured datasheets |

Phases that need units **wait** on those collections existing. The Pages shell, auth, and rules-read path do not.

`common_builds.yaml` (likely-opponent-units notes) is owned in **this** repo, hand-curated by Dave - not part of the shared corpus, not an ingestion pipeline.

---

## Phase 0 - Scaffold (done)

- [x] Repo, README, docs, `.gitignore`, Pages shell
- **Exit:** docs + static site scaffold

---

## Phase 1 - Standalone shell + auth

**Goal:** Live Hydra feel, gated to you, even if reasoning is still thin.

1. FastAPI (health + ask) on Cloud Run
2. Firebase Auth (Google sign-in) on the Pages UI; API verifies ID token + allowlist (Dave only)
3. Read-only retriever against the shared rules index (**RULES** mode)
4. Hydra persona, summary-first answers
5. Own chat-history collection (`ai_pharius_chat_history`)

**Exit:** Sign in -> ask a rules question -> Hydra-voiced answer with citations; unauthenticated requests get 401; CI smoke on `/health`; no ingest code here.

---

## Phase 2 - Facts

**Goal:** Honest points / weapon / ability-text answers from structured lookups.

1. Lookup client (exact + fuzzy unit names)
2. **FACTS** route - no inventing numbers from model memory
3. Response shows source stamp (document version / as-of date)
4. Golden spot-checks (e.g. named characters' points)

**Exit:** Points/profile questions return a grounded answer + source, or an explicit miss.

---

## Phase 3 - Combat math + COACH (single-question reasoning)

**Goal:** Reliable, derived answers to one-off tactical questions - the foundation Match Plan will orchestrate.

1. Deterministic combat-math calculator tool, **comparative/what-if** (weapon A vs. B, with vs. without a stratagem)
2. Intent router: `RULES` | `FACTS` | `COACH`
3. **COACH** - reasons over real profiles/abilities/rules for single questions (attachment picks, target priority, "what's good against X")
4. Every probability claim routes through the calculator - never model arithmetic
5. Golden eval suite begins here, checklist-scored (required/forbidden claims), starting with Thousand Sons cases including `ts_rubric_5_attach`
6. Optional stronger model on COACH

**Exit:** `ts_rubric_5_attach` and similar cases pass human review by reasoning from profiles/rules, not from a stored answer.

---

## Phase 4 - Match Plan (flagship mode)

**Goal:** Given your list plus whatever you know of the opponent, produce one pre-game plan.

1. Accept your full list + opponent info at any input tier (full list / faction+detachment / faction only)
2. `common_builds.yaml` supplies likely-unit assumptions at tiers 2-3; every assumption is labelled as such in the output
3. Orchestrate COACH + combat-math tool across: threat assessment, priority targets, attachment/support calls, stratagem/CP budget, deployment/screening, win-condition framing
4. Assemble into one structured plan document
5. Golden eval expands to full match-plan scenarios (e.g. Thousand Sons vs. "Tyranids, faction only, assume common builds")

**Exit:** A full match plan against a known Thousand Sons list, and against an unknown-list Tyranids opponent (via `common_builds.yaml`), both pass human review with correctly flagged assumptions.

---

## Phase 5 - Harden

- Pulumi: Cloud Run + read IAM on shared collections + write own cache
- Rate limits / spend guards
- CI eval gate using the golden suite
- Optional Discord / messaging later (same ask pipeline)
- Optional links from other sites - never a launch blocker

Auth is already in Phase 1 - this phase tightens ops, cost, and quality gates.

---

## Non-goals (see design.md for rationale)

- Mid-game live consultation
- Memorized tactical answers of any kind
- Photo / vision board-reading
- Second ingest/embed pipeline for rules or facts
- Automated meta-list scraping (Dave-curated file only, for now)
- Full army-list builder
- Fine-tuning a custom model (prompt + tools + eval first)
- Merging with the arbiter/corpus repo

---

## Open decisions

| Decision | Lean |
|----------|------|
| Same GCP project as the corpus? | Yes - separate SA + collections |
| Pages URL | `tyberium.github.io/ai-pharius` (shell); API gated |
| Firebase project | Own app config for ai-pharius Auth |
| `common_builds.yaml` format | Simple faction/detachment -> typical units + short notes |
| Combat-math tool shape | Must support comparative queries - locked in Phase 3, exact API TBD |

---

## Success snapshot

Sign in, hand the Hydra your Thousand Sons list and "playing Tyranids, don't know their list," and get back a plan that flags the likely opponent units as an assumption, gets the Rubric-attachment call right by reasoning, and backs every damage claim with calculator numbers.
