# IPD Cognitive Lab — Project Overview

> **Course:** Cognitive Psychology
> **Type:** Student project — localhost demo for faculty presentation
> **Status:** Pre-build (spec approved, development not yet started)

---

## What This Is

A single-device, localhost-only web application that uses the **Iterated Prisoner's Dilemma (IPD)** as a research and teaching instrument. Participants play repeated rounds of Cooperate/Defect against classical rule-based AI strategies. The system logs every decision and generates a behavioural-psychology report covering cooperation, retaliation, forgiveness, risk-taking, and reciprocity patterns.

---

## Who Uses It

- **Participants** (students, classmates, faculty) — sit at the machine, enter their name and age, configure a game, play, and receive an immediate report.
- **Instructor** — physically present in the room; uses the Sessions dashboard (`/sessions`) to review past results.
- **No authentication.** No cloud. No multi-device. Everything runs on one machine.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | React + Vite + shadcn/ui | TypeScript consistency; shadcn gives polished components fast |
| Theme | Pitch black dark | Specified by project owner |
| Backend | Fastify (Node/TypeScript) | Same language as frontend; simple REST; single `npm run dev` |
| Database | SQLite (`better-sqlite3`) | Local file; zero ops; persists across restarts; perfect for single-device use |
| Monorepo runner | `concurrently` | One command starts both frontend and backend |

**Start command:** `npm run dev` from project root
**Frontend:** `http://localhost:5173`
**Backend:** `http://localhost:3001`
**Database file:** `backend/data/ipd.db` (gitignored)

---

## Modules

### 1. Game Engine
- Self-paced rounds (no countdown timer)
- C/D buttons disabled during AI "thinking" (0.8s fake delay)
- Payoff matrix: configurable T/R/P/S (defaults: 5/3/1/0)
- Noise/misimplementation: configurable %; intended move vs executed move both logged
- Round count: configurable (default 20)
- Response latency: client-side, ms from round display → button click

### 2. Strategy Library (15 strategies, client-side)

| # | Name | Core Behaviour |
|---|------|----------------|
| 1 | Tit for Tat | Copy opponent's last move; C first |
| 2 | Generous Tit for Tat | TfT + 10% forgiveness |
| 3 | Suspicious Tit for Tat | TfT but D first |
| 4 | Two Tits for Tat | D for 2 rounds after any opponent D |
| 5 | Grim Trigger | C until first opponent D; then D forever |
| 6 | Pavlov | Win-stay, lose-shift |
| 7 | Always Cooperate | Always C |
| 8 | Always Defect | Always D |
| 9 | Random | 50/50 each round |
| 10 | Hard Joss | TfT + 10% random defection |
| 11 | Soft Joss | TfT + 10% random cooperation |
| 12 | Davis | C for rounds 1–10; Grim Trigger from round 11 |
| 13 | Feld | Cooperation probability decreases linearly 1.0 → 0.5 |
| 14 | Alternator | C, D, C, D… |
| 15 | Go By Majority | Plays opponent's modal move; C on ties |

All strategies are pure TypeScript functions: `(myHistory, opponentHistory) => 'C' | 'D'`
Each has unit tests covering: first move, all-C opponent, all-D opponent, mixed history.

### 3. Session Control Panel
Collapsible panel on the Home page (collapsed by default):
- Opponent strategy (dropdown, default: Tit for Tat)
- Round count (default: 20, range: 1–200)
- Payoff values T/R/P/S (validated: T > R > P ≥ S ≥ 0)
- Noise probability (default: 0%)

### 4. Behavioural Logging
All round data accumulates in **React state** during the game — no mid-game server calls. On game completion, one atomic `POST /api/sessions/complete` saves everything. Partial sessions (refresh/close) are lost by design.

**Per-round log fields:**
`round_number, participant_move, intended_participant_move, noise_applied, opponent_move, participant_score_this_round, opponent_score_this_round, cumulative_participant_score, cumulative_opponent_score, response_latency_ms, timestamp_utc`

### 5. Cognitive-Behavioural Report (8 metrics)

| Metric | Formula |
|--------|---------|
| Cooperation Rate | `Σ C_p[t] / N` |
| Conditional Cooperation Rate | `Σ C_p[t]·C_o[t-1] / Σ C_o[t-1]` (t≥2) |
| Retaliation Index | `Σ D_p[t]·D_o[t-1] / Σ D_o[t]` (t≥2, denom excludes last round) |
| Forgiveness Index | Avg rounds from retaliation D back to next C |
| Reciprocity Correlation | Pearson r between `C_p[t]` and `C_o[t-1]` (t≥2) |
| Risk-Taking Tendency | `Σ C_p[t]·D_o[t-1] / Σ D_o[t]` — cooperating after being defected against |
| Response Latency Profile | Mean + SD of latency (ms) split by C vs D choices |
| Switching Rate | `Σ 1[C_p[t]≠C_p[t-1]] / (N−1)` |

Report displayed immediately on game completion and saved to DB.
Post-report: yes/no question "Were you able to identify the strategy you were playing against?"

---

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home: name + age form, Session Control panel, Start Game |
| `/game` | Game board: payoff matrix, round progress, C/D buttons, score, history |
| `/report/:sessionId` | Immediate report with all 8 metrics + recognition question |
| `/sessions` | Dashboard: all past sessions, click to view report, delete |

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/sessions/complete` | Atomic save: session + rounds + report |
| `GET` | `/api/sessions` | List all completed sessions |
| `GET` | `/api/sessions/:id` | Full session detail + rounds + report |
| `PATCH` | `/api/sessions/:id/recognition` | Save strategy recognition answer |
| `DELETE` | `/api/sessions/:id` | Delete session (cascades to rounds + report) |

---

## Database Schema (SQLite)

```sql
CREATE TABLE sessions (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_name    TEXT    NOT NULL,
  participant_age     INTEGER NOT NULL,
  strategy_name       TEXT    NOT NULL,
  round_count         INTEGER NOT NULL,
  payoff_t            INTEGER NOT NULL DEFAULT 5,
  payoff_r            INTEGER NOT NULL DEFAULT 3,
  payoff_p            INTEGER NOT NULL DEFAULT 1,
  payoff_s            INTEGER NOT NULL DEFAULT 0,
  noise_probability   REAL    NOT NULL DEFAULT 0,
  strategy_identified TEXT,               -- 'yes' | 'no' | null
  started_at          TEXT    NOT NULL,
  completed_at        TEXT
);

CREATE TABLE rounds (
  id                            INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id                    INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  round_number                  INTEGER NOT NULL,
  participant_move              TEXT    NOT NULL,
  intended_participant_move     TEXT    NOT NULL,
  noise_applied                 INTEGER NOT NULL DEFAULT 0,
  opponent_move                 TEXT    NOT NULL,
  participant_score_this_round  INTEGER NOT NULL,
  opponent_score_this_round     INTEGER NOT NULL,
  cumulative_participant_score  INTEGER NOT NULL,
  cumulative_opponent_score     INTEGER NOT NULL,
  response_latency_ms           INTEGER NOT NULL,
  timestamp_utc                 TEXT    NOT NULL
);

CREATE TABLE reports (
  id                            INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id                    INTEGER NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  cooperation_rate              REAL,
  conditional_cooperation_rate  REAL,
  retaliation_index             REAL,
  forgiveness_index             REAL,
  reciprocity_correlation       REAL,
  risk_taking_tendency          REAL,
  mean_latency_c_ms             REAL,
  sd_latency_c_ms               REAL,
  mean_latency_d_ms             REAL,
  sd_latency_d_ms               REAL,
  switching_rate                REAL,
  generated_at                  TEXT NOT NULL
);
```

---

## Project Structure

```
CogPsych_Prisoner/
├── PROJECT_OVERVIEW.md           ← this file
├── package.json                  ← root; "dev": concurrently frontend + backend
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── components.json           ← shadcn config
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               ← React Router setup
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── GamePage.tsx
│       │   ├── ReportPage.tsx
│       │   └── SessionsPage.tsx
│       ├── components/
│       │   ├── SessionControlPanel.tsx
│       │   ├── PayoffMatrix.tsx
│       │   ├── MoveButtons.tsx
│       │   ├── ScoreBoard.tsx
│       │   ├── RoundHistoryTable.tsx
│       │   ├── AiThinkingIndicator.tsx
│       │   └── MetricCard.tsx
│       ├── lib/
│       │   ├── strategies.ts
│       │   ├── noise.ts
│       │   ├── reports.ts
│       │   └── api.ts
│       └── types/
│           └── index.ts
└── backend/
    ├── package.json
    └── src/
        ├── index.ts
        ├── db.ts
        ├── schema.sql
        └── routes/
            ├── sessions.ts
            └── reports.ts
    └── data/
        └── ipd.db                ← gitignored
```

---

## Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Refresh / close mid-game | Session lost — never saved. Intended. |
| Zero rounds completed | Never POSTed. Nothing saved. |
| POST fails on completion | Report shown from React state; toast error displayed. |
| Invalid payoff matrix | Start button disabled with inline error. |
| Noise = 100% | All moves flipped — handled correctly. |
| Denominator = 0 in any metric | Metric reported as `null`. |
| N < 3 rounds | Reciprocity correlation reported as `null`. |
| Strategy recognition skipped | Stored as `null`. |

---

## Out of Scope

- Human vs Human mode
- Human vs AI ("Jev") mode — stretch goal only, not designed for
- Authentication / user accounts
- Cloud hosting / deployment
- Predictive module
- Alternate framing labels (Trust/Betray etc.)
- Multi-device / concurrent sessions

---

## Build Milestones

| M | Contents |
|---|----------|
| M1 | Monorepo scaffold, Fastify + SQLite, React + Vite + shadcn dark theme, Home page + Session Control, Game page shell |
| M2 | All 15 strategies + unit tests, full game loop (rounds, scoring, noise, AI delay, latency) |
| M3 | Behavioural logging — client-side accumulation + atomic POST on completion |
| M4 | All 8 report metrics + Report page displayed immediately after game |
| M5 | Sessions dashboard, past report view, delete, recognition save |
| M6 | Polish: animations, dark theme consistency, error toasts, demo-ready sign-off |
