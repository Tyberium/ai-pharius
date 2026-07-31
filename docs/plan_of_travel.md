# ai-pharius - Plan of Travel

> The Hydra reads the books. Then it tells you how to win.

Roadmap for **ai-pharius**: a standalone 11th-edition battlefield coach with a **GitHub Pages** front door.

---

## Principles

1. **Consumer only** - no PDF download, no embed jobs, no corpus writes in this repo.
2. **Ground facts, reason tactics** - never invent points or weapon profiles; do reason target priority from grounded stats.
3. **Three modes, one API** - RULES (cite), FACTS (lookup), COACH (reason). Route before generating.
4. **Summary first** - brief recommendation, then why, then citations / caveats.
5. **11th edition only**.
6. **Standalone** - Pages UI + Cloud Run; ship without other product UIs.
7. **Measure coaching** - golden questions (incl. Scarab Assault Terminators vs mixed Tyranids) before calling it smart.

---

## Shared corpus (read-only)

Ingest and structured publishes live elsewhere ([roboto-guilliman](https://github.com/Tyberium/roboto-guilliman)). Hydra needs:

| Need | Source (when available) |
|------|-------------------------|
| Core rules citations | Vector collection `warhammer_rules_11th` |
| Stratagem / faction text | Same index after faction packs are ingested |
| Unit points | Structured `unit_points` (Munitorum-derived) |
| Weapons / profiles | Structured datasheet collections |

Phases that need units **wait** on those collections existing. The Pages shell and rules-read path do not.

---

## Phase 0 - Scaffold (done)

- [x] Repo, README, this plan, `.gitignore`
- **Exit:** docs-only public repo

---

## Phase 1 - Standalone shell

**Goal:** Live Hydra feel, even if coaching is still thin.

1. FastAPI (health + ask) on Cloud Run  
2. Read-only retriever against the shared rules index  
3. GitHub Pages ask UI (keep it simple)  
4. Summary-first answers; Hydra persona (not a rules-dump clerk)  
5. Own chat-history collection (`ai_pharius_chat_history`)

**Exit:** Pages question → Hydra-voiced answer with citations; CI smoke on `/health`; no ingest code here.

---

## Phase 2 - Facts

**Goal:** Honest points / weapon answers from structured lookups.

1. Lookup client (exact + fuzzy unit names)  
2. **FACTS** route - no inventing numbers from model memory  
3. UI shows source stamp (document version / as-of date)  
4. Golden spot-checks (e.g. named characters' points)

**Exit:** Points questions return grounded number + source, or an explicit miss.

---

## Phase 3 - Coach mode

**Goal:** Multi-angle tactics grounded in profiles + rules.

1. Intent router: `RULES` | `FACTS` | `COACH`  
2. Lookup / tools before generate (`get_unit`, `get_points`, optional rules retrieve)  
3. Coach prompt: brief → why → rules note → caveats  
4. Golden eval (15–30 Qs), including Scarab Terminators vs Hormagaunts + Screamer-Killer  
5. Optional stronger model on COACH only  
6. Pages mode badge (which head spoke)

**Exit:** Scarab scenario passes human review; eval runnable in CI.

---

## Phase 4 - Harden

- Pulumi: Cloud Run + read IAM on shared collections + write own cache  
- Rate limits / spend guards  
- Clarifying questions when board state is incomplete  
- Optional Discord / messaging later (same ask pipeline)  
- Optional links from other sites - never a launch blocker  

---

## Non-goals (for now)

- Second ingest / embed pipeline  
- Full army-list builder  
- Fine-tuning a custom model (prompt + tools + eval first)  
- Merging with the arbiter / corpus repo  

---

## Open decisions

| Decision | Lean |
|----------|------|
| Same GCP project as the corpus? | Yes - separate SA + collections |
| Pages URL | `tyberium.github.io/ai-pharius` first |
| Damage-math helper tool? | Phase 3 if profiles are solid |

---

## Success snapshot

Open the Pages site, ask the Scarab question, get a Hydra answer that used **real profiles and rules** - not a PDF regurgitator and not a hallucinated listicle.
