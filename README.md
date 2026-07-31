# ai-pharius

> *I am Alpharius. This is a lie.*

**AI + Alpharius** - a standalone Warhammer 40,000 **11th edition battlefield coach**.

Where [roboto-guilliman](https://github.com/Tyberium/roboto-guilliman) is the Lord Commander's **rules arbiter** (lex, citations, no hallucination), **ai-pharius** is the Hydra: multi-headed advice on how to *fight* - target priority, fire allocation, stratagem timing, and board plans.

**Which head of the Hydra is speaking?** Ask a coaching question and find out.

---

## What this is (and is not)

| | **roboto-guilliman** | **ai-pharius** |
|--|----------------------|----------------|
| Role | Rules arbiter | Battlefield coach |
| Owns ingestion | **Yes** - PDFs, embeddings, Munitorum, datasheets | **No** - pure consumer |
| Answers | "What happens when…?" | "How should I shoot / play this…?" |
| Frontend | battleplan.uk (planned) | **GitHub Pages** (standalone) |
| Persona | Stoic Primarch, Codex | Hydra - cunning, multi-angle, meme-aware |

ai-pharius **never** downloads rules PDFs, embeds chunks, or writes the shared corpus. Guilliman owns the books. The Hydra only **reads**.

Battleplan.uk is **out of scope** for v1. A link from Battleplan may come later; for now the product is self-contained with a simple Pages site so we are not blocked on web-app complexity.

---

## Name

- **AI** + **Alpharius** → `ai-pharius`
- Twin joke optional later (`omegon` as a second surface) - one Hydra is enough for now

---

## Architecture (target)

```
roboto-guilliman (platform)
  download → parse → embed → Firestore vectors
  Munitorum / datasheets → structured collections
           │
           │  read-only
           ▼
ai-pharius (consumer)
  intent router: RULES cite | FACTS lookup | COACH reason
  tools: get_unit / get_points / retrieve_rules
  API (Cloud Run) + GitHub Pages UI
```

Shared GCP / Firestore collections (read by ai-pharius, written only by Guilliman):

- `warhammer_rules_11th` - vector rules corpus
- Future: `unit_points`, datasheet / weapon profiles (structured)

ai-pharius owns only its own runtime state (e.g. `ai_pharius_chat_history`).

---

## Stack (planned)

| Layer | Choice |
|-------|--------|
| Coach API | FastAPI on Cloud Run (`europe-west1`), scale-to-zero |
| LLM | Gemini (Flash for simple; stronger model for COACH path) |
| Rules / facts | Read Guilliman's Firestore (no ingest in this repo) |
| Frontend | Static site on **GitHub Pages** (simple ask UI) |
| Infra | Pulumi + GitHub Actions (same pattern as Guilliman) |
| Cost | Free-tier first; coach path may use a dearer model selectively |

Exact package layout and code land in later phases - this repo starts as **README + plan**.

---

## North-star example

> *I have Scarab Assault Terminators shooting into Hormagaunts and a Screamer-Killer. How should I split fire?*

A good Hydra answer:

1. **Brief** - bolters into the swarm; missiles / high-Damage into the monster  
2. **Why** - profile comparison (S vs T, AP, Damage vs Wounds)  
3. **Rules note** - Allocate Attacks / relevant citations from shared corpus  
4. **Caveats** - CP, strats, board state conditionals  

That answer requires structured unit data + rules retrieval + coaching prompt - not arbiter-only RAG.

---

## Plan of travel

See **[docs/plan_of_travel.md](docs/plan_of_travel.md)** for phases, milestones, and what Guilliman must ship first.

**Short version:**

0. **Scaffold** (this commit) - README, plan, empty repo hygiene  
1. **Consume rules** - read-only client against Guilliman's vector index; thin API + Pages "ask" shell  
2. **Facts** - Guilliman publishes Munitorum / datasheets; Hydra looks up points and weapons  
3. **Coach mode** - intent router, tools, summary-first answers, golden eval (incl. Scarab scenario)  
4. **Harden** - CI, Pulumi, rate limits, eval gate, optional stronger model for COACH only  

---

## Repo status

**No application code yet.** Documentation and direction only.

Edition red line (same as Guilliman): **11th edition / #New40k only.**

---

## Related

- [roboto-guilliman](https://github.com/Tyberium/roboto-guilliman) - rules arbiter and **sole ingestion owner**
