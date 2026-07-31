# ai-pharius

**Live site:** [https://tyberium.github.io/ai-pharius/](https://tyberium.github.io/ai-pharius/)

> *I am Alpharius. This is a lie.*

**AI + Alpharius** - a standalone Warhammer 40,000 **11th edition battlefield coach**.

The Hydra advises how to *fight*: target priority, fire allocation, stratagem timing, and board plans - not just what the rulebook says when you fail a Battle-shock test.

**Which head of the Hydra is speaking?** Ask a coaching question and find out.

---

## What this is

| | |
|--|--|
| Role | Battlefield coach (tactics, not pure rules lawyering) |
| Edition | **11th / #New40k only** |
| Frontend | **GitHub Pages** (`docs/`) |
| API | Cloud Run (planned) |
| Data | **Consumer only** - reads a shared rules/facts corpus; does not ingest PDFs or write embeddings |

Corpus ingest and structured unit data live in a separate platform repo ([roboto-guilliman](https://github.com/Tyberium/roboto-guilliman)). This project only consumes that data.

---

## Name

**AI** + **Alpharius** → `ai-pharius`. Multi-headed advice; optional Omegon twin surface later if we want the joke.

---

## Architecture (target)

```
Shared corpus (rules vectors, later points / datasheets)
           │  read-only
           ▼
ai-pharius
  intent: RULES cite | FACTS lookup | COACH reason
  API (Cloud Run) + GitHub Pages
```

ai-pharius owns its own runtime state only (e.g. chat cache). It never downloads Warhammer PDFs or embeds the rulebooks.

---

## Stack (planned)

| Layer | Choice |
|-------|--------|
| Coach API | FastAPI on Cloud Run (`europe-west1`), scale-to-zero |
| LLM | Gemini (cheap path for simple asks; stronger model for COACH) |
| Rules / facts | Read-only Firestore (shared corpus) |
| Frontend | Static site on **GitHub Pages** |
| Infra | Pulumi + GitHub Actions |
| Cost | Free-tier first |

Pages UI is scaffolded; coach API is not wired yet.

---

## North-star example

> *I have Scarab Assault Terminators shooting into Hormagaunts and a Screamer-Killer. How should I split fire?*

A good answer:

1. **Brief** - bolters into the swarm; high-Damage into the monster  
2. **Why** - profile comparison (S vs T, AP, Damage vs Wounds)  
3. **Rules note** - Allocate Attacks / relevant citations  
4. **Caveats** - CP, strats, board-state conditionals  

That needs grounded unit data + rules retrieval + a coaching prompt - not a wall of PDF text.

---

## Plan of travel

See **[docs/plan_of_travel.md](docs/plan_of_travel.md)**.

0. Scaffold (docs) - done  
1. Pages + API shell; read shared rules; Hydra voice; summary-first answers  
2. Facts lookups (points / weapons) once the corpus publishes them  
3. Coach mode - router, tools, golden eval (incl. Scarab scenario)  
4. Harden - CI, IAM, rate limits, eval gate  

---

## Related

- [roboto-guilliman](https://github.com/Tyberium/roboto-guilliman) - rules corpus / ingest platform this coach reads from
