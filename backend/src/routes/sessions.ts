import { FastifyInstance } from 'fastify';
import db from '../db';

export default async function sessionRoutes(fastify: FastifyInstance) {
  fastify.post('/api/sessions/complete', async (request, reply) => {
    const { session, rounds, report } = request.body as any;

    const insertSession = db.prepare(`
      INSERT INTO sessions (
        participant_name, participant_age, strategy_name, round_count,
        payoff_t, payoff_r, payoff_p, payoff_s, noise_probability,
        started_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const insertRound = db.prepare(`
      INSERT INTO rounds (
        session_id, round_number, participant_move, intended_participant_move,
        noise_applied, opponent_move, participant_score_this_round,
        opponent_score_this_round, cumulative_participant_score,
        cumulative_opponent_score, response_latency_ms, timestamp_utc
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertReport = db.prepare(`
      INSERT INTO reports (
        session_id, cooperation_rate, conditional_cooperation_rate,
        retaliation_index, forgiveness_index, reciprocity_correlation,
        risk_taking_tendency, mean_latency_c_ms, sd_latency_c_ms,
        mean_latency_d_ms, sd_latency_d_ms, switching_rate, generated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const transaction = db.transaction(() => {
      const info = insertSession.run(
        session.participantName, session.participantAge, session.strategyName,
        session.roundCount, session.payoffT, session.payoffR, session.payoffP,
        session.payoffS, session.noiseProbability, new Date().toISOString()
      );
      const sessionId = info.lastInsertRowid;

      for (const r of rounds) {
        insertRound.run(
          sessionId, r.roundNumber, r.participantMove, r.intendedParticipantMove,
          r.noiseApplied ? 1 : 0, r.opponentMove, r.participantScoreThisRound,
          r.opponentScoreThisRound, r.cumulativeParticipantScore,
          r.cumulativeOpponentScore, r.responseLatencyMs, r.timestampUtc
        );
      }

      insertReport.run(
        sessionId, report.cooperationRate, report.conditionalCooperationRate,
        report.retaliationIndex, report.forgivenessIndex, report.reciprocityCorrelation,
        report.riskTakingTendency, report.meanLatencyCMs, report.sdLatencyCMs,
        report.meanLatencyDMs, report.sdLatencyDMs, report.switchingRate
      );

      return sessionId;
    });

    try {
      const sessionId = transaction();
      return { sessionId };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Database transaction failed' });
    }
  });

  fastify.get('/api/sessions', async (request, reply) => {
    const rows = db.prepare(`
      SELECT s.id, s.participant_name as participantName, s.participant_age as participantAge, 
             s.strategy_name as strategyName, s.round_count as roundCount, 
             r.cooperation_rate as cooperationRate, s.completed_at as completedAt
      FROM sessions s
      LEFT JOIN reports r ON s.id = r.session_id
      WHERE s.completed_at IS NOT NULL
      ORDER BY s.completed_at DESC
    `).all();
    return rows;
  });

  fastify.get('/api/sessions/:id', async (request, reply) => {
    const { id } = request.params as any;
    
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
    if (!session) return reply.status(404).send({ error: 'Not found' });
    
    const rounds = db.prepare('SELECT * FROM rounds WHERE session_id = ? ORDER BY round_number ASC').all(id);
    const report = db.prepare('SELECT * FROM reports WHERE session_id = ?').get(id);

    return { session, rounds, report };
  });

  fastify.patch('/api/sessions/:id/recognition', async (request, reply) => {
    const { id } = request.params as any;
    const { answer } = request.body as any;
    db.prepare('UPDATE sessions SET strategy_identified = ? WHERE id = ?').run(answer, id);
    return { ok: true };
  });

  fastify.delete('/api/sessions/:id', async (request, reply) => {
    const { id } = request.params as any;
    // PRAGMA foreign_keys = ON is required for CASCADE DELETE in SQLite.
    // Ensure it's enabled before deleting.
    db.pragma('foreign_keys = ON');
    db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
    return { ok: true };
  });
}
