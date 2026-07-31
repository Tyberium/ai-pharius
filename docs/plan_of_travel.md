# ai-pharius - Plan of Travel

> Guilliman owns the books. The Hydra only reads them - then tells you how to win.

This is the product roadmap for **ai-pharius**: a standalone 11th-edition battlefield coach. It is intentionally separate from [roboto-guilliman](https://github.com/Tyberium/roboto-guilliman) so the arbiter stays a rules clerk and the coach can grow a different brain.

**Out of scope for early phases:** Battleplan.uk integration. Frontend = **GitHub Pages**. Optional Battleplan link later.

---

## Principles

1. **Consumer only** - no PDF download, no embed jobs, no corpus writes in this repo.
2. **Guilliman first for data** - if ai-pharius needs points or datasheets, Guilliman's ingest publishes them; Hydra consumes.
3. **Three modes, one API** - RULES (cite), FACTS (lookup), COACH (reason). Route before generating.
4. **Summary first** - brief recommendation, then why, then citations / caveats.
5. **Ground facts, reason tactics** - never invent points or weapon profiles; do invent (reason) target priority from grounded stats.
6. **11th edition only** - same red line as Guilliman.
7. **Standalone** - GitHub Pages UI + Cloud Run API; no dependency on Battleplan to ship.
8. **Measure coaching** - golden questions (incl. Scarab Assault Terminators vs mixed Tyranids) before declaring "smart."

---

## Dependency on Guilliman

| Hydra needs | Guilliman delivers |
|-------------|-------------------|
| Core rules for citations | `warhammer_rules_11th` (exists) |
| Stratagem / faction text | Faction pack ingest into shared vector index (planned on Guilliman) |
| Unit points | Munitorum → structured `unit_points` (planned on Guilliman) |
| Weapon / profile lines | Datasheet parse → structured collections (planned on Guilliman) |
| Read IAM | Service account: Datastore/Firestore **read** on shared collections |

ai-pharius phases that need structured units **block** on Guilliman publishing those collections. Coach UX can still start with rules-read + Pages shell.

---

## Phase 0 - Scaffold (done here)

**Goal:** Name, story, and travel plan in git. No application code.

- [x] Repo under Tyberium (`ai-pharius`)
- [x] README (persona, ownership, stack sketch)
- [x] This plan of travel
- [x] `.gitignore` hygiene

**Exit:** Public GitHub repo with docs only.

---

## Phase 1 - Standalone shell (consume rules)

**Goal:** Something live that feels like the Hydra, even if coaching is thin.

**Deliverables:**

1. Minimal FastAPI service (health + ask) on Cloud Run - pattern borrowed from Guilliman, **new** persona prompts.
2. Read-only retriever against `warhammer_rules_11th` (shared GCP project or cross-project IAM).
3. GitHub Pages static UI - question box, answer render, "which head is speaking?" flavour. No SPA framework required; keep it boring and shippable.
4. Intent stub: everything is still RAG-ish, but answers are **summary-first**, not walls of rule text.
5. Separate chat-history collection (`ai_pharius_chat_history`).

**Does not include:** Munitorum parse, datasheet tools, damage math.

**Exit criteria:**

- Pages site asks a rules question and gets a Hydra-voiced answer with citations.
- Guilliman unchanged; no ingest code in this repo.
- Smoke test in CI for `/health`.

---

## Phase 2 - Facts consumer

**Goal:** Honest points and weapon answers once Guilliman publishes structured data.

**Depends on Guilliman:** Munitorum Field Manual → bronze/silver → Firestore (or equivalent) unit points; preferably basic datasheet weapon lists.

**Deliverables:**

1. Lookup client for `unit_points` / datasheet docs (exact + fuzzy name match).
2. Router branch **FACTS** - points questions bypass "invent from training data."
3. Pages UI shows source stamp (*Munitorum vX.X, as of date*).
4. Golden tests: Guilliman pts, a few faction spot-checks.

**Exit criteria:**

- "How many points is Roboute Guilliman?" returns grounded number + source.
- No FACTS answer without a successful lookup.

---

## Phase 3 - Coach mode (the Hydra proper)

**Goal:** Multi-angle tactical advice grounded in profiles + rules.

**Deliverables:**

1. Intent router: `RULES` | `FACTS` | `COACH`.
2. Tool / lookup step before generate: `get_unit`, `get_points`, optional `retrieve_rules`.
3. Coach system prompt: brief → why (profile compare) → rules note → caveats / conditionals.
4. Golden eval set (15–30 Qs), including:
   - Scarab Assault Terminators vs Hormagaunts + Screamer-Killer (split fire)
   - Stratagem timing ("when do I Rapid Ingress?")
   - Simple "what should this unit shoot?" with two clear target profiles
5. Optional: dearer Gemini model **only** on COACH path; Flash for RULES/FACTS.
6. Pages: show mode badge (Rules / Facts / Coach) so users see which head spoke.

**Exit criteria:**

- Scarab scenario passes human review (right allocation logic, grounded profiles).
- Eval harness runnable in CI (soft gate at first, hard gate later).

---

## Phase 4 - Harden and optional extras

**Goal:** Portfolio-grade ops without Battleplan.

- Pulumi stack for Cloud Run + IAM (read Guilliman data, write own cache).
- Rate limiting, billing kill-switch pattern (copy Guilliman ideas).
- Hybrid search only if Guilliman exposes richer indexes; Hydra does not re-build BM25 corpus ownership.
- Clarifying questions when board state is incomplete ("Is the Screamer-Killer already damaged? CP left?").
- Optional Discord/WhatsApp later - same ask pipeline, still standalone brand.
- Optional Battleplan deep-link - out of band, not a blocker.

---

## Non-goals (for now)

- Replacing Guilliman or merging repos
- Second PDF download / embed pipeline
- Full army-list builder / matched-play tournament client
- Fine-tuning a custom model (prompt + tools + eval first)
- Battleplan auth / Firebase ID tokens as a launch requirement

---

## Suggested sequencing with Guilliman

```
Now     ai-pharius Phase 0 (docs)
        Guilliman continues arbiter + corpus growth

Next    ai-pharius Phase 1 (Pages + read rules)
        Guilliman: Munitorum / datasheet structured publish (enables Phase 2)

Then    ai-pharius Phase 2 (facts)
        Guilliman: faction pack text in shared index (helps Phase 3)

Then    ai-pharius Phase 3 (coach + eval)
        Harden both
```

---

## Open decisions (parked)

| Decision | Options | Lean |
|----------|---------|------|
| Same GCP project as Guilliman? | Shared vs separate | Shared project, separate SA + collections |
| Pages custom domain? | github.io vs later domain | `tyberium.github.io/ai-pharius` first |
| Damage calculator tool? | LLM-only vs expected-wounds helper | Helper in Phase 3 if profiles are solid |
| Omegon twin surface? | Joke endpoint / alt persona | Later, if ever |

---

## Success snapshot

You open the GitHub Pages site, ask the Scarab question, and ai-pharius answers like a Hydra who **read the datasheets Guilliman filed** - not like a rules PDF on legs.
