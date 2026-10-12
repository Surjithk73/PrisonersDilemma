CREATE TABLE IF NOT EXISTS sessions (
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
  strategy_identified TEXT,
  started_at          TEXT    NOT NULL,
  completed_at        TEXT
);

CREATE TABLE IF NOT EXISTS rounds (
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

CREATE TABLE IF NOT EXISTS reports (
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
