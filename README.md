# ai-pharius

**Live site:** [https://tyberium.github.io/ai-pharius/](https://tyberium.github.io/ai-pharius/)

> *I am Alpharius. This is a lie.*

**AI + Alpharius** - a personal Warhammer 40,000 **11th edition match-planning coach**.

Hand the Hydra your list and what you know about the opponent, and it reasons from real unit profiles, real rules, and real dice probability to build you a plan: threats to expect, targets to prioritize, characters to attach, stratagems to budget, how to deploy. It is **not** a mid-game chatbot - you plan before the game, not between turns.

**Which head of the Hydra is speaking?** Ask it to build a plan and find out.

This is a **personal tool**: the Pages UI is a static shell; all reasoning goes through an authenticated Cloud Run API (Google sign-in, allowlisted). See **[docs/design.md](docs/design.md)** for mission, reasoning philosophy, and architecture diagrams.

---

## What this is

| | |
|--|--|
| Role | Pre-game match-planning coach (not a mid-game consult, not pure rules lawyering) |
| Edition | **11th / #New40k only** |
| Frontend | **GitHub Pages** (`docs/`) |
| Auth | Firebase Google sign-in -> allowlisted Cloud Run API |
| API | Cloud Run (planned) |
| Data | **Consumer only** for rules/facts - reads a shared corpus; does not ingest PDFs or write embeddings. Owns one small hand-curated file (`common_builds.yaml`) for likely-opponent-unit notes. |

Corpus ingest and structured unit data live in a separate platform repo ([roboto-guilliman](https://github.com/Tyberium/roboto-guilliman)). This project only consumes that data.

---

## Name

**AI** + **Alpharius** -> `ai-pharius`. Multi-headed advice; optional Omegon twin surface later if we want the joke.

---

## How it thinks

Every tactical conclusion - which character to attach, what to shoot first, which stratagem to hold - must be **derived** from real toughness/saves/invulnerability/wounds/ability text and the actual attack-resolution rules, backed by a comparative combat-math calculator (never guessed probability). Nothing is a memorized "X beats Y." If the reasoning chain can't be shown, the answer doesn't ship. Full detail: [docs/design.md](docs/design.md).

---

## Architecture (target)

```
Shared corpus (rules vectors, points, datasheets)     common_builds.yaml
           │  read-only                                 (Dave-curated,
           ▼                                              this repo)
ai-pharius
  auth: Firebase ID token + allowlist
  RULES cite | FACTS lookup | COACH single-question | MATCH PLAN (flagship)
  API (Cloud Run) + GitHub Pages shell
```

Full diagrams: [docs/design.md](docs/design.md).

---

## Stack (planned)

| Layer | Choice |
|-------|--------|
| Coach API | FastAPI on Cloud Run (`europe-west1`), scale-to-zero |
| Auth | Firebase Auth (Google), allowlisted UID |
| LLM | Gemini (cheap path for RULES/FACTS; stronger model for COACH/Match Plan) |
| Rules / facts | Read-only Firestore (shared corpus) |
| Meta knowledge | `common_builds.yaml`, hand-curated, owned here |
| Frontend | Static site on **GitHub Pages** |
| Infra | Pulumi + GitHub Actions |
| Cost | Free-tier first |

Pages UI is scaffolded; coach API is not wired yet.

---

## North-star example

> Thousand Sons list in hand. Opponent: "playing Tyranids," no list known.

A good plan:

1. **Assumption flag** - "no confirmed list; assuming a typical build brings Hormagaunts and a Screamer-Killer or two (common, not confirmed)"
2. **Threats** - what those units can do to your list, from real profiles
3. **Priority targets + attachment calls** - e.g. correctly reasoning that a fast support character's revive-style ability is wasted on a small unit that won't survive to trigger it, and recommending the alternative - derived, not memorized
4. **Stratagem/CP budget, deployment, win-condition framing**

That needs grounded unit data, rules retrieval, a comparative combat-math tool, and first-principles reasoning - not a wall of PDF text, and not something you need mid-game.

---

## Plan of travel

See **[docs/plan_of_travel.md](docs/plan_of_travel.md)** and **[docs/design.md](docs/design.md)**.

0. Scaffold (docs) - done
1. Pages + API shell; auth allowlist; read shared rules (RULES)
2. Facts lookups (points/weapons) once the corpus publishes them
3. Comparative combat-math tool + COACH (single-question reasoning), golden evals begin
4. Match Plan (flagship) - list + opponent-info at any tier, full pre-game plan
5. Harden - CI, IAM, rate limits, eval gate

---

## Related

- [roboto-guilliman](https://github.com/Tyberium/roboto-guilliman) - rules corpus / ingest platform this coach reads from
